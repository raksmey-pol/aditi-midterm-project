import Container from "@/components/Container";
import { ShieldCheck, Truck, HeartHandshake, Users } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    description:
      "Every product in our store is carefully curated and quality-checked before listing so you always get what you see.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "We partner with reliable logistics providers to ensure your orders arrive on time, every time.",
  },
  {
    icon: HeartHandshake,
    title: "Customer First",
    description:
      "Our support team is available around the clock to help with any questions, returns, or issues.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "We empower local sellers and independent businesses to reach customers across the country.",
  },
];

const team = [
  { name: "Maria Santos", role: "Founder & CEO", initials: "MS" },
  { name: "James Reyes", role: "Head of Operations", initials: "JR" },
  { name: "Carla Mendoza", role: "Lead Designer", initials: "CM" },
  { name: "Leo Cruz", role: "Chief Technology Officer", initials: "LC" },
];

export default function AboutPage() {
  return (
    <div className="pb-16">
      {/* Hero */}
      <div className="bg-shop_light_pink py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold text-darkColor">About Us</h1>
            <p className="text-lightColor text-lg leading-relaxed">
              We started with a simple idea: make quality products accessible to
              everyone. Today we connect thousands of buyers and sellers across
              the country.
            </p>
          </div>
        </Container>
      </div>

      {/* Mission */}
      <Container className="mt-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-shop_light_green font-semibold text-sm uppercase tracking-wider">
              Our Mission
            </span>
            <h2 className="text-3xl font-bold text-darkColor">
              Building a marketplace people can trust
            </h2>
            <p className="text-lightColor leading-relaxed">
              We believe shopping should be simple, safe, and enjoyable. Our
              platform is designed to give buyers the best selection at fair
              prices while helping sellers grow their businesses with powerful
              tools and a wider audience.
            </p>
            <p className="text-lightColor leading-relaxed">
              Since our founding, we have processed over 500k orders and
              onboarded more than 2,000 sellers — and we are just getting
              started.
            </p>
          </div>
          <div className="bg-shop_light_bg rounded-2xl p-10 flex items-center justify-center">
            <div className="text-center space-y-6">
              {[
                { label: "Orders Delivered", value: "500 K+" },
                { label: "Active Sellers", value: "2,000+" },
                { label: "Happy Customers", value: "150 K+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl font-bold text-shop_dark_green">
                    {stat.value}
                  </p>
                  <p className="text-lightColor text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Values */}
      <div className="bg-shop_light_bg mt-16 py-16">
        <Container>
          <h2 className="text-3xl font-bold text-darkColor text-center mb-10">
            What We Stand For
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-6 shadow-sm space-y-3"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-shop_light_pink">
                  <Icon className="text-shop_dark_green w-5 h-5" />
                </div>
                <h3 className="font-semibold text-darkColor">{title}</h3>
                <p className="text-lightColor text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Team */}
      <Container className="mt-16">
        <h2 className="text-3xl font-bold text-darkColor text-center mb-10">
          Meet the Team
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map(({ name, role, initials }) => (
            <div key={name} className="text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-shop_dark_green flex items-center justify-center mx-auto">
                <span className="text-white text-xl font-bold">{initials}</span>
              </div>
              <div>
                <p className="font-semibold text-darkColor">{name}</p>
                <p className="text-sm text-lightColor">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
