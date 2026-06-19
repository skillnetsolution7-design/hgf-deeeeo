import { Metadata } from "next";
import { SettingsView } from "@/components/admin/SettingsView";

export const metadata: Metadata = {
  title: "Settings | Izzy Admin",
};

export default function AdminSettingsPage() {
  return <SettingsView />;
}
