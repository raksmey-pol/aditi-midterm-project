"use client";

import {
  Briefcase,
  Footprints,
  GanttChart,
  Glasses,
  GlassWater,
  Shirt,
  ShoppingBasket,
} from "lucide-react";

const categories = [
  { name: "All", icon: <ShoppingBasket />, slug: "all" },
  { name: "T-Shirts", icon: <Shirt />, slug: "t-shirts" },
  { name: "Shoes", icon: <Footprints />, slug: "shoes" },
  { name: "Accessories", icon: <Glasses />, slug: "accessories" },
  { name: "Bags", icon: <Briefcase />, slug: "bags" },
  { name: "Drinkware", icon: <GlassWater />, slug: "drinkware" },
  { name: "Gadgets", icon: <GanttChart />, slug: "gadgets" },
  { name: "Other", icon: <ShoppingBasket />, slug: "other" },
];

const Categories = () => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category.slug}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full text-sm whitespace-nowrap hover:bg-shop_light_green hover:text-white transition"
        >
          {category.icon}
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default Categories;
