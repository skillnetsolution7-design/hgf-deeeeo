import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { supabaseAdmin } from "@/lib/supabase";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: product } = await supabaseAdmin
    .from("products")
    .select("name")
    .eq("id", id)
    .single();

  return {
    title: product ? `Edit: ${product.name} | Izzy Admin` : "Edit Product | Izzy Admin",
  };
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  // Fetch product with images
  const { data: product } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  const { data: images } = await supabaseAdmin
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("sort_order", { ascending: true });

  const productWithImages = {
    ...product,
    images: images || [],
  };

  return <ProductForm product={productWithImages} />;
}
