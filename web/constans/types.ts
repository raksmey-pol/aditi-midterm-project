import { StaticImageData } from "next/image";

export type ProductType = {
  id: string | number;
  name: string;
  price: number;
  description: string;
  sizes: string[];
  colors: string[];
  image: Record<string, string | StaticImageData>;
};

export type ProductsType = ProductType[];
