import Container from "@/components/Container";

export default function BlogPage() {
  return (
    <Container className="py-12 md:py-16">
      <div className="space-y-8">
        <section className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-shop_light_green">
            Blog
          </p>
          <h1 className="mt-2 text-3xl font-bold text-darkColor md:text-4xl">
            Stories, tips, and updates from our team
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-lightColor">
            Stay informed with practical guides, product highlights, and
            e-commerce insights.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "How to choose the right product",
              excerpt: "A quick guide to compare features and make better decisions.",
            },
            {
              title: "What’s new this month",
              excerpt: "See the latest improvements, arrivals, and platform updates.",
            },
          ].map((post) => (
            <article
              key={post.title}
              className="rounded-xl border border-border bg-background p-6"
            >
              <h2 className="text-lg font-semibold text-darkColor">{post.title}</h2>
              <p className="mt-2 text-sm leading-6 text-lightColor">{post.excerpt}</p>
            </article>
          ))}
        </section>
      </div>
    </Container>
  );
}
