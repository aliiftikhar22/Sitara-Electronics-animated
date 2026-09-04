import type { Metadata } from "next";
import ProductsClient from "@/components/ProductsClient";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse Sitara Electronics' full wholesale catalog — refrigerators, air conditioners, fans, microwaves, irons and more.",
};

export default async function ProductsPage(props: PageProps<"/products">) {
  const searchParams = await props.searchParams;
  const category = searchParams.category;

  return (
    <ProductsClient
      initialCategory={typeof category === "string" ? category : undefined}
    />
  );
}
