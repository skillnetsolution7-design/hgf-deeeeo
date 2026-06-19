export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  featured: boolean;
  published: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  cloudinary_public_id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface ProductWithImages extends Product {
  images: ProductImage[];
}

export interface Order {
  id: string;
  customer_name: string;
  address: string;
  phone_1: string;
  phone_2: string | null;
  product_name: string;
  product_price: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  created_at: string;
}

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_price?: number;
  featured?: boolean;
  published?: boolean;
  stock?: number;
}

export interface UpdateProductInput {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  compare_price?: number;
  featured?: boolean;
  published?: boolean;
  stock?: number;
}
