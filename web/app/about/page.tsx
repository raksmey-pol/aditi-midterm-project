import Container from "@/components/Container";

export default function AboutPage() {
  return (
    <Container className="py-12 md:py-16">
      <div className="space-y-8">
        <section className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-shop_light_green">
            About
          </p>
          <h1 className="mt-2 text-3xl font-bold text-darkColor md:text-4xl">
            Building a simple and reliable shopping experience
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-lightColor">
            Our mission is to connect customers with quality products through a
            clean interface, transparent pricing, and dependable service.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Mission", text: "Make online shopping easy and trustworthy." },
            { title: "Vision", text: "Create a platform people enjoy returning to." },
            { title: "Values", text: "Quality, clarity, and customer-first support." },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-border bg-background p-6"
            >
              <h2 className="text-lg font-semibold text-darkColor">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-lightColor">{item.text}</p>
            </article>
          ))}
        </section>
      </div>
    </Container>
  );
}
