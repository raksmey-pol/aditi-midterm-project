import Container from "@/components/Container";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "support@mystore.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+63 912 345 6789",
    sub: "Mon – Fri, 9 AM – 6 PM",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "123 Commerce St., Makati City",
    sub: "Metro Manila, Philippines",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon – Sat: 9 AM – 7 PM",
    sub: "Closed on Sundays",
  },
];

export default function ContactPage() {
  return (
    <div className="pb-16">
      {/* Hero */}
      <div className="bg-shop_light_pink py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold text-darkColor">Contact Us</h1>
            <p className="text-lightColor text-lg">
              Have a question, concern, or just want to say hello? We&apos;d
              love to hear from you.
            </p>
          </div>
        </Container>
      </div>

      <Container className="mt-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 space-y-6">
            <h2 className="text-2xl font-bold text-darkColor">
              Send a Message
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-darkColor">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Juan"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-shop_light_green"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-darkColor">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Dela Cruz"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-shop_light_green"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-darkColor">
                Email
              </label>
              <input
                type="email"
                placeholder="juan@example.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-shop_light_green"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-darkColor">
                Subject
              </label>
              <input
                type="text"
                placeholder="How can we help?"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-shop_light_green"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-darkColor">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Write your message here..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-shop_light_green resize-none"
              />
            </div>

            <button className="w-full bg-shop_dark_green text-white font-semibold py-2.5 rounded-lg hover:bg-shop_dark_green/90 hoverEffect">
              Send Message
            </button>
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-darkColor">
                Get in Touch
              </h2>
              <p className="text-lightColor">
                Our friendly team is always happy to assist you with any
                questions or feedback.
              </p>
            </div>

            <div className="grid gap-4">
              {contactInfo.map(({ icon: Icon, label, value, sub }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 bg-shop_light_bg rounded-xl p-4"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-shop_light_pink shrink-0">
                    <Icon className="text-shop_dark_green w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-darkColor">
                      {label}
                    </p>
                    <p className="text-sm text-darkColor">{value}</p>
                    <p className="text-xs text-lightColor mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
