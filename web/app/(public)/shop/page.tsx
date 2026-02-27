import Container from "@/components/Container";
import ProductList from "@/components/ProductList";

export default function ShopPage() {
  return (
    <div className="space-y-10 pb-16">
      {/* Hero banner */}
      <div className="bg-shop_light_pink py-12">
        <Container>
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-darkColor">Our Shop</h1>
            <p className="text-lightColor max-w-xl mx-auto">
              Discover our full collection of premium products — from everyday
              essentials to the latest trends, all at competitive prices.
            </p>
          </div>
        </Container>
      </div>

      {/* Product grid */}
      <ProductList />
    </div>
  );
}
