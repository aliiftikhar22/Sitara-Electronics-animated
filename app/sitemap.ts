import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { getProducts } from "@/lib/firestore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, priority: 1 },
    { url: `${SITE.url}/products`, priority: 0.9 },
    { url: `${SITE.url}/track-order`, priority: 0.5 },
    { url: `${SITE.url}/login`, priority: 0.3 },
    { url: `${SITE.url}/register`, priority: 0.3 },
  ];

  try {
    const products = await getProducts();
    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${SITE.url}/products/${p.id}`,
      priority: 0.7,
    }));
    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
