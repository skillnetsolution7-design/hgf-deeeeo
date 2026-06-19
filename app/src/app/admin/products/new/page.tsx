import { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "New Product | Izzy Admin",
};

export default function NewProductPage() {
  return <ProductForm />;
}
