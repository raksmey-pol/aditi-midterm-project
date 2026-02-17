"use client";

import Container from "./Container";
import ProductCard from "./ProductCard";
import Categories from "./Categories";



import { useEffect, useState } from "react";
import { productService, Product } from "@/lib/services/product.service";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    productService
      .getProducts({ size: 8 })
      .then((res) => {
        setProducts(res.content);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load products");
        setLoading(false);
      });
  }, []);



  return (
    <section className="py-12 bg-shop-light-pink">
      <Container className="space-y-8">
        <Categories />
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  sizes: ["M"],
                  colors: ["#888"],
                  image: { color: product.imageUrl, gray: product.imageUrl, green: product.imageUrl },
                }}
              /> 
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default ProductList;
