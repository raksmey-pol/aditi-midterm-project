import Container from "@/components/Container";
import ProductList from "@/components/ProductList";

export default function ShopPage() {
  return (
    <div className="space-y-0 pb-16">
      <Container className="py-12 md:py-16">
        <section className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-shop_light_green">
            Shop
          </p>
          <h1 className="mt-2 text-3xl font-bold text-darkColor md:text-4xl">
            Discover quality products for everyday life
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-lightColor">
            Explore curated collections, new arrivals, and trusted essentials
            with a simple shopping experience.
          </p>
        </section>
      </Container>

      <ProductList />
    </div>
  );
}
