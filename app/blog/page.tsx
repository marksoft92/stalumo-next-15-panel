import BlogTable from "@/components/BlogTable";
import Container from "@/components/ui/container";

// Funkcja do generowania metadanych SEO

// Pobieranie początkowych postów z API
const fetchPosts = async (lang: string, page: number, limit: number) => {
  try {
    const res = await fetch(`http://localhost:3000/api/blog`);
    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }
    const data = await res.json();
    return data.posts;
  } catch {
    console.error("Błąd podczas pobierania postów:");
    return [];
  }
};

const BlogPageContainer = async ({ params }: { params: any }) => {
  const data = await params;
  const posts = await fetchPosts(data.locale, 1, 5);

  return (
    <Container>{!!posts?.length && <BlogTable posts={posts} />}</Container>
  );
};

export default BlogPageContainer;
