import BlogTable from "@/components/BlogTable";
import Button from "@/components/ui/button";
import Container from "@/components/ui/container";

const BlogPageContainer = async ({ params }: { params: any }) => {
  return (
    <Container>
      <div className="p-10 flex flex-row text-center algin-center justify-center gap-10">
        <h2 className="text-[2rem] flex items-end">Lista artykułów na blogu</h2>
        <Button title="Nowy artykuł" href="/blog/new" />
      </div>
      {<BlogTable />}
    </Container>
  );
};

export default BlogPageContainer;
