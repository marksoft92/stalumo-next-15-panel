import DashboardHome from "@/components/DashboardHome";
import TrendsWordHome from "@/components/TrendsWordHome";
import Container from "@/components/ui/container";

export default async function HomePage() {
  return <Container>     <DashboardHome />
    <TrendsWordHome />
  </Container>;
}
