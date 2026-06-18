import { Product } from "@/components/ProductCard";

export interface ApiCategory {
  _id?: string;
  name?: string;
  slug?: string;
  themeKey?: string;
}

export interface ApiProduct {
  _id: string;
  name: string;
  code?: string;
  price: number;
  description?: string;
  images?: { url?: string }[];
  category?: ApiCategory;
  brand?: ApiCategory;
  packageSize?: string;
  storageInstruction?: string;
  shelfLife?: string;
  ingredients?: string;
}

export function normalizeProduct(product: ApiProduct): Product {
  const category = product.category || product.brand || {};

  return {
    id: product._id,
    name: product.name,
    slug: product._id,
    image: product.images?.[0]?.url || "/fallback-product.jpg",
    price: product.price,
    category: {
      name: category.name || "Sản phẩm",
      slug: category.slug || category.themeKey || "default",
      themeKey: category.themeKey || category.slug || "default",
    },
    packageSize: product.packageSize || "",
    product_code: product.code || "",
    description: product.description || "",
  };
}
