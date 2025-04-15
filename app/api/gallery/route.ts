// import { PrismaClient } from "@prisma/client";
// import { NextRequest, NextResponse } from "next/server";
// import SFTPClient from "ssh2-sftp-client";
// import { randomUUID } from "crypto";
//
// const prisma = new PrismaClient();
// const sftp = new SFTPClient();
//
// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const file = formData.get("file") as File;
//   const alt = formData.get("alt") as string;
//
//   // 📌 Sprawdzamy, czy plik został przesłany
//   if (!file) {
//     return new NextResponse(JSON.stringify({ error: "Brak pliku" }), {
//       status: 400,
//     });
//   }
//
//   // 📌 Pobieramy dane do SFTP z env
//   const vpsHost = process.env.VPS_HOST!;
//   const vpsUsername = process.env.VPS_USERNAME!;
//   const vpsPassword = process.env.VPS_PASSWORD!;
//   const uploadPath = process.env.VPS_UPLOAD_PATH!;
//   const filename = `${randomUUID()}-${file.name}`;
//
//   try {
//     // 📌 1. Łączymy się z VPS i przesyłamy plik
//     await sftp.connect({
//       host: vpsHost,
//       username: vpsUsername,
//       password: vpsPassword,
//     });
//
//     // 📌 Przesyłamy plik do zdefiniowanego folderu
//     const buffer = Buffer.from(await file.arrayBuffer());
//     await sftp.put(buffer, `${uploadPath}/${filename}`);
//     await sftp.end(); // Zamykamy połączenie z SFTP
//
//     // 📌 2. Zapisujemy URL do bazy danych przy pomocy Prisma
//     // 📌 Zapisujemy URL do bazy danych przy pomocy Prisma
//     const image = await prisma.image.create({
//       data: {
//         url: `http://panel.stalumo.pl/image-public-uploads/${filename}`, // Poprawny URL
//         alt, // Opis alternatywny zdjęcia
//       },
//     });
//
//     // 📌 3. Zwracamy odpowiedź z zapisanymi danymi
//     return new NextResponse(JSON.stringify(image), { status: 200 });
//   } catch (error) {
//     console.error("Błąd przesyłania pliku:", error);
//     return new NextResponse(
//       JSON.stringify({ error: "Błąd przesyłania pliku" }),
//       { status: 500 }
//     );
//   } finally {
//     // 📌 Zamykanie połączeń
//     await prisma.$disconnect(); // Zamykanie połączenia z bazą danych
//     await sftp.end(); // Zamykamy połączenie z SFTP
//   }
// }
// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const page = parseInt(searchParams.get("page") || "1", 10);
//   const pageSize = 10;
//
//   try {
//     const offset = (page - 1) * pageSize;
//
//     // Fetch data from the database using Prisma
//     const images = await prisma.image.findMany({
//       skip: offset,
//       take: pageSize,
//       orderBy: {
//         id: "desc",
//       },
//     });
//
//     // If no images found
//     if (images.length === 0) {
//       return new NextResponse(JSON.stringify({ error: "No images found" }), {
//         status: 404,
//       });
//     }
//
//     // Fetch total count of images
//     const total = await prisma.image.count();
//
//     return new NextResponse(JSON.stringify({ images, total }), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching images:", error);
//     return new NextResponse(
//       JSON.stringify({ error: "Failed to fetch images" }),
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }
// export async function DELETE(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const id = parseInt(searchParams.get("id") || "0", 10);
//
//   try {
//     // Delete image from the database using Prisma
//     const deletedImage = await prisma.image.delete({
//       where: { id },
//     });
//
//     // If no image found
//     if (!deletedImage) {
//       return new NextResponse(JSON.stringify({ error: "Image not found" }), {
//         status: 404,
//       });
//     }
//
//     return new NextResponse(JSON.stringify({ message: "Image deleted" }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Error deleting image:", error);
//     return new NextResponse(
//       JSON.stringify({ error: "Failed to delete image" }),
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// Zmienna środowiskowa z absolutną ścieżką, np. "/home/username/uploads"
const uploadPath = process.env.VPS_UPLOAD_PATH!;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const alt = formData.get("alt") as string;

  if (!file) {
    return new NextResponse(JSON.stringify({ error: "Brak pliku" }), {
      status: 400,
    });
  }

  const filename = `${randomUUID()}-${file.name}`;
  const fullPath = path.join(uploadPath, filename);

  try {
    // Upewnij się, że folder istnieje
    await mkdir(uploadPath, { recursive: true });

    // Zapisujemy plik na dysku lokalnym
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(fullPath, buffer);

    // Tworzymy rekord w bazie danych
    const image = await prisma.image.create({
      data: {
        url: `https://panel.stalumo.pl/image-public-uploads/${filename}`,
        alt,
      },
    });

    return new NextResponse(JSON.stringify(image), { status: 200 });
  } catch (error) {
    console.error("Błąd przesyłania pliku:", error);
    return new NextResponse(
        JSON.stringify({ error: "Błąd przesyłania pliku" }),
        { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 10;

  try {
    const offset = (page - 1) * pageSize;
    const images = await prisma.image.findMany({
      skip: offset,
      take: pageSize,
      orderBy: {
        id: "desc",
      },
    });

    if (images.length === 0) {
      return new NextResponse(JSON.stringify({ error: "No images found" }), {
        status: 404,
      });
    }

    const total = await prisma.image.count();
    return new NextResponse(JSON.stringify({ images, total }), { status: 200 });
  } catch (error) {
    console.error("Error fetching images:", error);
    return new NextResponse(
        JSON.stringify({ error: "Failed to fetch images" }),
        { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id") || "0", 10);

  try {
    const deletedImage = await prisma.image.delete({
      where: { id },
    });

    if (!deletedImage) {
      return new NextResponse(JSON.stringify({ error: "Image not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify({ message: "Image deleted" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return new NextResponse(
        JSON.stringify({ error: "Failed to delete image" }),
        { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
