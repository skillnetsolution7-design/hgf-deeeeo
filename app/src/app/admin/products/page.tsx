import { Metadata } from "next";
import { ProductsView } from "@/components/admin/ProductsView";

export const metadata: Metadata = {
  title: "Products | Izzy Admin",
};

export default function AdminProductsPage() {
  return <ProductsView />;
}
