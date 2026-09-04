import Hero from "@/components/Hero";
import HorizontalScroll from "@/components/animations/HorizontalScroll";
import CategorySection from "@/components/CategorySection";
import BrandStrip from "@/components/BrandStrip";
import WhySitara from "@/components/WhySitara";
import FeaturedProduct from "@/components/FeaturedProduct";
import TestimonialSection from "@/components/TestimonialSection";
import FinalCta from "@/components/FinalCta";
import { getProducts, pickFeaturedProduct } from "@/lib/firestore";

// Re-fetch periodically so the featured product reflects admin changes
// without needing a full redeploy.
export const revalidate = 300;

export default async function Home() {
  let featured = null;
  try {
    const products = await getProducts();
    featured = pickFeaturedProduct(products);
  } catch {
    featured = null;
  }

  return (
    <>
      <Hero />
      <HorizontalScroll />
      <CategorySection />
      <BrandStrip />
      <WhySitara />
      <FeaturedProduct product={featured} />
      <TestimonialSection />
      <FinalCta />
    </>
  );
}
