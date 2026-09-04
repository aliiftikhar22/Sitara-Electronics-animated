import type { Metadata } from "next";
import CheckoutClient from "@/components/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Cash on Delivery order with Sitara Electronics.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
