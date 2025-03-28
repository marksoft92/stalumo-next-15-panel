import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";

const prisma = new PrismaClient();

// Ścieżka do folderu z obrazami na VPS
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/var/www/uploads/gallery";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 10;

  try {
    const offset = (page - 1) * pageSize;

    // Fetch data from the database using Prisma
    const images = await prisma.image.findMany({
      skip: offset,
      take: pageSize,
      orderBy: {
        id: "asc",
      },
    });

    // If no images found
    if (images.length === 0) {
      return new NextResponse(JSON.stringify({ error: "No images found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify({ images }), { status: 200 });
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
    // Najpierw pobierz informacje o obrazie
    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return new NextResponse(JSON.stringify({ error: "Image not found" }), {
        status: 404,
      });
    }

    // Usuń plik z serwera
    const filePath = join(UPLOAD_DIR, image.url.split("/").pop() || "");
    try {
      await unlink(filePath);
    } catch (error) {
      console.error("Error deleting file:", error);
      // Kontynuuj nawet jeśli plik nie istnieje
    }

    // Usuń wpis z bazy danych
    await prisma.image.delete({
      where: { id },
    });

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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;
    const alt = formData.get("alt") as string;

    if (!image || !alt) {
      return new NextResponse(
        JSON.stringify({ error: "Image and alt text are required" }),
        { status: 400 }
      );
    }

    // Konwertuj plik na Buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generuj unikalną nazwę pliku
    const timestamp = Date.now();
    const filename = `${timestamp}-${image.name}`;
    const filePath = join(UPLOAD_DIR, filename);

    // Zapisz plik na serwerze
    await writeFile(filePath, buffer);

    // Zapisz ścieżkę w bazie danych
    const newImage = await prisma.image.create({
      data: {
        url: `/uploads/gallery/${filename}`,
        alt,
      },
    });

    return new NextResponse(JSON.stringify({ message: "Image created" }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating image:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create image" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
