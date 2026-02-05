"use client";

import Container from "./Container";
import ProductCard from "./ProductCard";
import Categories from "./Categories";
import { ProductsType } from "@/constans/types";
import { product1_color, product1_gray, product1_green, product2_color, product2_gray, product2_green, product3_color, product3_gray, product3_green, product4_color, product4_gray, product4_green, product5_color, product5_gray, product5_green } from "@/assets/images/indext";

const products: ProductsType = [
  {
    id: 1,
    name: "Product 1",
    price: 29.99,
    description: "This is a great product.",
    sizes: ["S", "M", "L"],
    colors: ["Gray", "Color", "Green"],
    image: {
      gray: product1_gray,
      color: product1_color,
      green: product1_green,
    }
  },
  {
    id: 2,
    name: "Product 2",
    price: 39.99,
    description: "This is another great product.",
    sizes: ["S", "M", "L"],
    colors: ["Gray", "Color", "Green"],
    image: {
      gray: product2_gray,
      color: product2_color,
      green: product2_green,
    }
  },
  {
    id: 3,
    name: "Product 3",
    price: 49.99,
    description: "This is yet another great product.",
    sizes: ["S", "M", "L"],
    colors: ["Gray", "Color", "Green"],
    image: {
      gray: product3_gray,
      color: product3_color,
      green: product3_green,
    }
  },
  {
    id: 4,
    name: "Product 4",
    price: 59.99,
    description: "This is the best product.",
    sizes: ["S", "M", "L"],
    colors: ["Gray", "Color", "Green"],
    image: {
      gray: product4_gray,
      color: product4_color,
      green: product4_green,
    }
  },
  {
    id: 5,
    name: "Product 5",
    price: 69.99,
    description: "This is the ultimate product.",
    sizes: ["S", "M", "L"],
    colors: ["Gray", "Color", "Green"],
    image: {
      gray: product5_gray,
      color: product5_color,
      green: product5_green,
    }
  }
];


const ProductList = () => {
  return (
    <section className="py-12 bg-shop-light-pink">
      <Container className="space-y-8">

        <Categories />

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Featured Products
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product: ProductsType[number]) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </Container>
    </section>
  );
};

export default ProductList;
