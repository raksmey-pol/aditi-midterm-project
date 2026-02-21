
import HomeBanner from "@/components/HomeBanner";
import ProductList from "@/components/ProductList";
import Container from "@/components/Container";

export default function PublicPage() {
  return (
    <div className="space-y-12 pb-16">
      <Container>
        <HomeBanner/>
      </Container>
      <ProductList/>
    </div>
  );
}