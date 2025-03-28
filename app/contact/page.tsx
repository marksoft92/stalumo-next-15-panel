import ChatTable from "@/components/ChatTable";
import Button from "@/components/ui/button";
import Container from "@/components/ui/container";

const ChatPageContainer = async ({ params }: { params: any }) => {
  return (
    <Container>
      <div className="p-10 flex flex-row text-center algin-center justify-center gap-10">
        <h2 className="text-[2rem] flex items-end">Lista wiadomośći</h2>
        <Button title="Nowy artykół" href="/blog/new" />
      </div>
      {<ChatTable />}
    </Container>
  );
};

export default ChatPageContainer;
