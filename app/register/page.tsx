import type { Metadata } from "next";
import RegisterClient from "@/components/RegisterClient";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return <RegisterClient />;
}
