import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

interface BlogContent {
  slug: string;
  title: string;
  content: string;
  lang: string;
}

interface BlogPost {
  id: number;
  imgUrl: string;
  alt: string;
  pl_slug: BlogContent | null;
  en_slug: BlogContent | null;
  de_slug: BlogContent | null;
  pl_title: BlogContent | null;
  en_title: BlogContent | null;
  de_title: BlogContent | null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "de"; // Default language
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 10;

  try {
    const offset = (page - 1) * pageSize;

    // Fetch data from both tables using Prisma
    const posts = await prisma.blog.findMany({
      skip: offset,
      take: pageSize,
      orderBy: {
        id: 'desc',
      },
      include: {
        translations: {},
      },
    });

    // If no posts found
    if (posts.length === 0) {
      return new Response(
        JSON.stringify({ error: "No posts found for the selected language" }),
        {
          status: 404,
        }
      );
    }

    // Format posts according to the requested language
    const formattedPosts: BlogPost[] = posts.map((post: any) => {
      const blogPost: BlogPost = {
        id: post.id,
        imgUrl: post.imgUrl,
        alt: post.alt,
        pl_slug: null,
        en_slug: null,
        de_slug: null,
        pl_title: null,
        en_title: null,
        de_title: null,
      };

      post.translations.forEach((langContent: any) => {
        const content = {
          slug: langContent.slug,
          title: langContent.title,
          content: langContent.content,
          lang: langContent.lang,
        };

        if (langContent.lang === "pl") {
          blogPost.pl_slug = content?.slug;
          blogPost.pl_title = content?.title;
        } else if (langContent.lang === "en") {
          blogPost.en_slug = content?.slug;
          blogPost.en_title = content?.title;
        } else if (langContent.lang === "de") {
          blogPost.de_slug = content?.slug;
          blogPost.de_title = content?.title;
        }
      });

      return blogPost;
    });

    // Count all posts for the selected language
    const totalPosts = await prisma.blog.count({
      where: {
        translations: {
          some: {
            lang: lang,
          },
        },
      },
    });

    return new Response(
      JSON.stringify({ posts: formattedPosts, total: totalPosts, page }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error fetching posts" }), {
      status: 500,
    });
  } finally {
    // Always disconnect the Prisma Client
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("id");

  if (!postId) {
    return new Response(JSON.stringify({ error: "Post ID is required" }), {
      status: 400,
    });
  }

  try {
    const post = await prisma.blog.delete({
      where: {
        id: parseInt(postId, 10),
      },
    });

    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Post deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error deleting post" }), {
      status: 500,
    });
  } finally {
    // Always disconnect the Prisma Client
    await prisma.$disconnect();
  }
}
