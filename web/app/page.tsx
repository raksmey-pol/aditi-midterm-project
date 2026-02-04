"use client";

import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import ProductList from "@/components/ProductList";

export default function HomePage() {
  return (
    <div className="space-y-12 pb-16">
      <Container>
        <HomeBanner />
      </Container>

      <ProductList />
    </div>
  );
}
