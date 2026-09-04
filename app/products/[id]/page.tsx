import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductById } from "@/lib/firestore";
import ProductDetailClient from "@/components/ProductDetailClient";

export async function generateMetadata(
  props: PageProps<"/products/[id]">
): Promise<Metadata> {
  const { id } = await props.params;
  const product = await getProductById(id);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: `${product.name} — ${product.cat} at Sitara Electronics, Lahore. Genuine wholesale pricing.`,
  };
}

export default async function ProductDetailPage(props: PageProps<"/products/[id]">) {
  const { id } = await props.params;
  const product = await getProductById(id);

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
