import { PrismaClient, BlogTranslation } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

interface BlogContent {
  id: number;
  imgUrl: string;
  alt: string;
  translations: {
    [lang: string]: {
      slug: string;
      title: string;
      content: string;
    } | null;
  };
}

export async function GET(req: NextRequest, { params }: { params: any }) {
  const id = parseInt(params.slug); // ID pobrany z URL

  try {
    // Zapytanie do bazy danych, aby znaleźć post na podstawie id
    const post = await prisma.blog.findFirst({
      where: {
        id, // Szukamy po id bloga
      },
      include: {
        translations: true, // Zawsze pobieramy wszystkie tłumaczenia
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Zwrócenie danych
    const blogContent: BlogContent = {
      id: post.id,
      imgUrl: post.imgUrl,
      alt: post.alt,
      translations: {
        pl: post.translations.find((t) => t.lang === "pl") || null,
        en: post.translations.find((t) => t.lang === "en") || null,
        de: post.translations.find((t) => t.lang === "de") || null,
      },
    };

    return NextResponse.json(blogContent, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching post" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Pobieramy dane z body
    const { id, imgUrl, alt, translations } = await req.json();


    // Najpierw usuwamy wszystkie tłumaczenia dla tego bloga
    await prisma.blogTranslation.deleteMany({
      where: { blogId: id },
    });

    // Następnie tworzymy nowe tłumaczenia
    const createdTranslations = await prisma.blogTranslation.createMany({
      data: translations.map((translation: any) => ({
        blogId: id,
        lang: translation.lang,
        title: translation.title,
        content: translation.content,
        slug: translation.slug,
      })),
    });

    // Aktualizujemy wpis w tabeli Blog
    const updatedBlogPost = await prisma.blog.update({
      where: { id },
      data: {
        imgUrl,
        alt,
      },
      include: {
        translations: true,
      },
    });



    // Zwracamy odpowiedź, w tym zaktualizowany wpis
    return NextResponse.json(
      { message: "Post updated successfully!", data: updatedBlogPost },
      { status: 200 }
    );
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      {
        error: "Error updating blog post",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
