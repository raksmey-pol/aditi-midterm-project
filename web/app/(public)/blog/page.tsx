import Container from "@/components/Container";
import { Clock, Tag } from "lucide-react";

const posts = [
  {
    id: 1,
    category: "Tips & Tricks",
    title: "10 Ways to Find the Best Deals Online",
    excerpt:
      "Learn how to use filters, alerts, and seasonal sales to never miss a bargain again. From flash sales to loyalty programs, we cover it all.",
    date: "January 15, 2026",
    readTime: "5 min read",
    color: "bg-shop_light_pink",
  },
  {
    id: 2,
    category: "Seller Stories",
    title: "How Maria Grew Her Handmade Jewelry Business by 300%",
    excerpt:
      "Starting with just a few listings, Maria turned her passion for handcrafted accessories into a thriving online store with help from our platform tools.",
    date: "January 28, 2026",
    readTime: "7 min read",
    color: "bg-deal-bg",
  },
  {
    id: 3,
    category: "Product Spotlight",
    title: "Top 5 Trending Products This Season",
    excerpt:
      "See what buyers are putting in their carts right now — from smart home gadgets to sustainable fashion finds that are flying off the virtual shelves.",
    date: "February 3, 2026",
    readTime: "4 min read",
    color: "bg-shop_light_pink",
  },
  {
    id: 4,
    category: "Company News",
    title: "We Just Reached 150,000 Happy Customers!",
    excerpt:
      "A heartfelt thank-you to our entire community: buyers, sellers, and the team that makes it happen. Here's what's coming next.",
    date: "February 10, 2026",
    readTime: "3 min read",
    color: "bg-deal-bg",
  },
  {
    id: 5,
    category: "How-To",
    title: "A Beginner's Guide to Selling on Our Platform",
    excerpt:
      "Learn how to set up your seller profile, list products, manage orders, and start earning — all in under an hour.",
    date: "February 17, 2026",
    readTime: "6 min read",
    color: "bg-shop_light_pink",
  },
  {
    id: 6,
    category: "Sustainability",
    title: "Our Commitment to Eco-Friendly Packaging",
    excerpt:
      "We are partnering with sellers to reduce plastic waste and encourage sustainable packaging choices. Find out how you can participate.",
    date: "February 20, 2026",
    readTime: "4 min read",
    color: "bg-deal-bg",
  },
];

const categories = [
  "All",
  "Tips & Tricks",
  "Seller Stories",
  "Product Spotlight",
  "Company News",
  "How-To",
  "Sustainability",
];

export default function BlogPage() {
  return (
    <div className="pb-16">
      {/* Hero */}
      <div className="bg-shop_light_pink py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold text-darkColor">Our Blog</h1>
            <p className="text-lightColor text-lg">
              Stories, tips, and updates from the team. Stay in the loop with
              everything happening at the store.
            </p>
          </div>
        </Container>
      </div>

      <Container className="mt-12">
        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer hoverEffect border ${
                cat === "All"
                  ? "bg-shop_dark_green text-white border-shop_dark_green"
                  : "bg-white text-lightColor border-gray-200 hover:border-shop_light_green hover:text-shop_light_green"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Posts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md hoverEffect"
            >
              {/* Color thumbnail */}
              <div
                className={`${post.color} h-36 flex items-center justify-center`}
              >
                <span className="text-5xl font-black text-white/30 select-none">
                  {post.id.toString().padStart(2, "0")}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-shop_light_green" />
                  <span className="text-xs font-semibold text-shop_light_green uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                <h2 className="font-bold text-darkColor leading-snug line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-sm text-lightColor leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-lightColor">{post.date}</span>
                  <div className="flex items-center gap-1 text-xs text-lightColor">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load more */}
        <div className="mt-10 text-center">
          <button className="px-8 py-2.5 border border-shop_dark_green text-shop_dark_green rounded-lg text-sm font-semibold hover:bg-shop_dark_green hover:text-white hoverEffect">
            Load More Posts
          </button>
        </div>
      </Container>
    </div>
  );
}
