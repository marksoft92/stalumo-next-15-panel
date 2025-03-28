// import { PrismaClient } from "@prisma/client";
// import { NextRequest } from "next/server";

// const prisma = new PrismaClient();

// interface BlogContent {
//   slug: string;
//   title: string;
//   content: string;
//   lang: string;
// }

// interface BlogPost {
//   id: number;
//   imgUrl: string;
//   alt: string;
//   pl_slug: BlogContent | null;
//   en_slug: BlogContent | null;
//   de_slug: BlogContent | null;
// }

// export async function GET(req: NextRequest) {
//   try {
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: "Error fetching posts" }), {
//       status: 500,
//     });
//   } finally {
//     // Always disconnect the Prisma Client
//     await prisma.$disconnect();
//   }
// }
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Pobieramy dane z body
    const { imgUrl, alt, translations } = await req.json();

    // Tworzymy nowy wpis w tabeli Blog
    const newBlogPost = await prisma.blog.create({
      data: {
        imgUrl,
        alt,
        translations: {
          create: translations, // Tworzymy tłumaczenia w zależności od danych
        },
      },
    });

    // Zwracamy odpowiedź, w tym nowo utworzony wpis
    return NextResponse.json(
      { message: "Post created successfully!", data: newBlogPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Error creating blog post" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
