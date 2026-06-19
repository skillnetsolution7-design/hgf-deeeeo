import { Metadata } from "next";
import { OrdersView } from "@/components/admin/OrdersView";

export const metadata: Metadata = {
  title: "Orders | Izzy Admin",
};

export default function AdminOrdersPage() {
  return <OrdersView />;
}
