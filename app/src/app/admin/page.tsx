import { Metadata } from "next";
import { DashboardView } from "@/components/admin/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard | Izzy Admin",
};

export default function AdminDashboardPage() {
  return <DashboardView />;
}
