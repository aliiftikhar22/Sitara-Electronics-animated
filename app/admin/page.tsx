import type { Metadata } from "next";
import AdminGate from "@/components/admin/AdminGate";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <AdminGate>
      <AdminShell />
    </AdminGate>
  );
}
