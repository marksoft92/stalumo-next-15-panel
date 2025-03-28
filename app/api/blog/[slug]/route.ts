import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
const prisma = new PrismaClient();

interface BlogContent {
  slug: string;
  title: string;
  content: string;
  lang: string;
}

export async function GET(req: NextRequest, { params }: { params: any }) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "en"; // Domyślny język angielski
  const slug = params.slug; // Slug pobrany z URL

  try {
    // Zapytanie do bazy danych, aby znaleźć post na podstawie sluga i języka
    const post = await prisma.blogTranslation.findFirst({
      where: {
        slug,
        // lang,
      },
      include: {
        blog: true, // Uwzględnij dane z głównego bloga (np. imgUrl, alt)
      },
    });

    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
      });
    }

    // Zwrócenie danych w odpowiednim języku
    // const translatedPost: BlogContent = {
    //   slug: post.slug,
    //   title: post.title,
    //   content: post.content,
    //   lang: post.lang,
    // };

    const translatedPost = await prisma.blogTranslation.findFirst({
      where: {
        blogId: post.blogId, // Szukamy wpisu o tym samym ID, ale w innym języku
        lang,
      },
    });

    return new Response(
      JSON.stringify({
        id: post?.blog.id, // Pobierz id z głównej tabeli Blog
        imgUrl: post?.blog.imgUrl,
        alt: post?.blog.alt,
        slug: translatedPost?.slug,
        title: translatedPost?.title,
        content: translatedPost?.content,
        lang: translatedPost?.lang,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error fetching post" }), {
      status: 500,
    });
  }
}
