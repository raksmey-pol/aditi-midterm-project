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
import { JSX, useEffect, useState } from "react";
import { productService } from "@/lib/services/product.service";


const iconMap: Record<string, JSX.Element> = {
  "t-shirts": <Shirt />,
  "shoes": <Footprints />,
  "accessories": <Glasses />,
  "bags": <Briefcase />,
  "drinkware": <GlassWater />,
  "gadgets": <GanttChart />,
  "other": <ShoppingBasket />,
  "all": <ShoppingBasket />,
};


interface CategoriesProps {
  onSelectCategory?: (category: string) => void;
  selectedCategory?: string;
}

const Categories = ({ onSelectCategory, selectedCategory }: CategoriesProps) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    productService.getCategories()
      .then((data) => {
        setCategories(["all", ...data]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load categories");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm whitespace-nowrap transition
            ${selectedCategory === cat
              ? 'bg-shop_dark_green text-white border-shop_dark_green shadow-md'
              : 'bg-white text-shop_dark_green border-gray-300 hover:bg-shop_light_green hover:text-white hover:border-shop_light_green'}
          `}
          onClick={() => onSelectCategory && onSelectCategory(cat)}
        >
          {iconMap[cat.toLowerCase()] || <ShoppingBasket />}
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default Categories;
