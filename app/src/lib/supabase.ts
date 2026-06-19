import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import { Product, ProductImage, Order } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side admin client (for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Browser client (for client-side operations)
export function createClientBrowser() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// ==================== PRODUCT ACTIONS ====================

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data || [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("featured", true)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  return data || [];
}

export async function getProductBySlug(slug: string): Promise<ProductWithImages | null> {
  const { data: product, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !product) {
    console.error("Error fetching product:", error);
    return null;
  }

  const { data: images } = await supabaseAdmin
    .from("product_images")
    .select("*")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true });

  return { ...product, images: images || [] };
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("published", true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching products:", error);
    return [];
  }

  return data || [];
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin products:", error);
    return [];
  }

  return data || [];
}

export async function createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product | null> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    return null;
  }

  return data;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error);
    return null;
  }

  return data;
}

export async function deleteProduct(id: string): Promise<boolean> {
  // Delete associated images first
  const { data: images } = await supabaseAdmin
    .from("product_images")
    .select("cloudinary_public_id")
    .eq("product_id", id);

  if (images && images.length > 0) {
    // Delete images from Cloudinary
    for (const img of images) {
      await deleteFromCloudinary(img.cloudinary_public_id);
    }
  }

  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    return false;
  }

  return true;
}

// ==================== PRODUCT IMAGE ACTIONS ====================

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  const { data, error } = await supabaseAdmin
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching product images:", error);
    return [];
  }

  return data || [];
}

export async function addProductImage(image: Omit<ProductImage, "id" | "created_at">): Promise<ProductImage | null> {
  const { data, error } = await supabaseAdmin
    .from("product_images")
    .insert(image)
    .select()
    .single();

  if (error) {
    console.error("Error adding product image:", error);
    return null;
  }

  return data;
}

export async function deleteProductImage(id: string): Promise<boolean> {
  // Get the cloudinary_public_id first
  const { data: image } = await supabaseAdmin
    .from("product_images")
    .select("cloudinary_public_id")
    .eq("id", id)
    .single();

  if (image) {
    await deleteFromCloudinary(image.cloudinary_public_id);
  }

  const { error } = await supabaseAdmin
    .from("product_images")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting product image:", error);
    return false;
  }

  return true;
}

export async function setPrimaryImage(productId: string, imageId: string): Promise<boolean> {
  // Unset all primary images for this product
  await supabaseAdmin
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);

  // Set the new primary image
  const { error } = await supabaseAdmin
    .from("product_images")
    .update({ is_primary: true })
    .eq("id", imageId);

  if (error) {
    console.error("Error setting primary image:", error);
    return false;
  }

  return true;
}

export async function reorderProductImages(updates: { id: string; sort_order: number }[]): Promise<boolean> {
  for (const update of updates) {
    const { error } = await supabaseAdmin
      .from("product_images")
      .update({ sort_order: update.sort_order })
      .eq("id", update.id);

    if (error) {
      console.error("Error reordering images:", error);
      return false;
    }
  }

  return true;
}

// ==================== CLOUDINARY ACTIONS ====================

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Cloudinary credentials not configured");
      return;
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = require("crypto")
      .createHash("sha1")
      .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
}

// ==================== ORDER ACTIONS ====================

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data || [];
}

export async function getRecentOrders(limit: number = 10): Promise<Order[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent orders:", error);
    return [];
  }

  return data || [];
}

export async function createOrder(order: Omit<Order, "id" | "status" | "created_at">): Promise<Order | null> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert(order)
    .select()
    .single();

  if (error) {
    console.error("Error creating order:", error);
    return null;
  }

  return data;
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating order status:", error);
    return false;
  }

  return true;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting order:", error);
    return false;
  }

  return true;
}

// ==================== STATS ====================

export async function getDashboardStats(): Promise<{
  totalProducts: number;
  totalOrders: number;
  featuredProducts: number;
  totalRevenue: number;
}> {
  const { count: totalProducts } = await supabaseAdmin
    .from("products")
    .select("*", { count: "exact", head: true });

  const { count: totalOrders } = await supabaseAdmin
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { count: featuredProducts } = await supabaseAdmin
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("featured", true);

  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("product_price");

  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.product_price), 0) || 0;

  return {
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    featuredProducts: featuredProducts || 0,
    totalRevenue,
  };
}
