import ArticleBox from "@/components/ArticleBox";
import Container from "@/components/ui/container";
import { generateMetadata } from "./metadata";

// Funkcja do pobierania danych artykułów
const fetchPosts = async (lang: string, slug: string) => {
  const res = await fetch(
    `http://localhost:3000/api/blog/${slug}?lang=${lang}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  const data = await res.json();
  return data;
};

// Poprawiona wersja
const ArticlePageContainer = async ({ params }: { params: any }) => {
  // Typy params są poprawnie zadeklarowane, więc nie trzeba używać `await` dla params
  const { locale, slug } = params;

  const article = await fetchPosts(locale, slug);

  return (
    <Container>
      <ArticleBox article={article} />
    </Container>
  );
};

export { generateMetadata };
export default ArticlePageContainer;
