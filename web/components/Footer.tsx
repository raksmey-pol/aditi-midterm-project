"use client";
import Logo from "./Logo";
import Link from "next/link";
import Container from "./Container";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 mt-16">
      <Container>
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between py-12">

          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <Logo />
            <p className="text-sm mt-2">© 2024 My E-commerce Store.</p>
            <p className="text-sm">All rights reserved.</p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3 items-center md:items-start">
            <p className="text-shop_light_green font-semibold">Link</p>
            <Link href="/">Home</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>

          {/* Products */}
          <div className="flex flex-col gap-3 items-center md:items-start">
            <p className="text-shop_light_green font-semibold">Products</p>
            <Link href="/products">All Products</Link>
            <Link href="/new">New Arrivals</Link>
            <Link href="/best">Best Sellers</Link>
            <Link href="/sale">Sale</Link>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3 items-center md:items-start">
            <p className="text-shop_light_green font-semibold">Company</p>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/affiliate">Affiliate Program</Link>
          </div>

        </div>
      </Container>
    </footer>
  );
};

export default Footer;
