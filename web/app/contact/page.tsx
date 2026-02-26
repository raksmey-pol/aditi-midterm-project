import Container from "@/components/Container";

export default function ContactPage() {
  return (
    <Container className="py-12 md:py-16">
      <div className="space-y-8">
        <section className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-shop_light_green">
            Contact
          </p>
          <h1 className="mt-2 text-3xl font-bold text-darkColor md:text-4xl">
            We are here to help
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-lightColor">
            Reach out for support, product questions, or order assistance.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold text-darkColor">Email</h2>
            <p className="mt-2 text-sm leading-6 text-lightColor">
              support@example.com
            </p>
          </article>
          <article className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold text-darkColor">Phone</h2>
            <p className="mt-2 text-sm leading-6 text-lightColor">
              +855 12 345 678
            </p>
          </article>
          <article className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold text-darkColor">Hours</h2>
            <p className="mt-2 text-sm leading-6 text-lightColor">
              Mon - Fri, 9:00 AM - 6:00 PM
            </p>
          </article>
        </section>
      </div>
    </Container>
  );
}
