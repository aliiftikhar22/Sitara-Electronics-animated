export const SITE = {
  name: "Sitara Electronics",
  tagline: "Lahore's Wholesale Appliance House",
  description:
    "Sitara Electronics, Lahore — Refrigerators, Ovens, Microwaves, Heaters, ACs & Irons at genuine wholesale prices, even on a single piece.",
  phone: "0323 4537911",
  phoneHref: "+923234537911",
  whatsapp: "https://wa.me/923234537911",
  address: "Shalimar Link Road, Lahore",
  hours: "Mon–Sun, 11am–9pm",
  url: "https://sitaraelectronics.com",
} as const;

// `cat` is the exact string stored on real Firestore product docs (written by
// the existing admin panel) — used to filter /products by category. `image`
// is a real photo; categories without one fall back to an `icon` tile instead
// of a fabricated stock photo. This list mirrors what's actually stocked
// online today (Fans, Refrigerators, Air Conditioners, Microwaves, Irons,
// Vacuum Cleaners, Blenders & Juicers) rather than the full in-store CSV
// inventory, which also covers appliances not yet listed on the site.
export const CATEGORIES = [
  {
    slug: "refrigerators",
    cat: "Refrigerators",
    name: "Refrigerators",
    description: "Frost-free & direct-cool",
    image: "/categories/refrigerator.webp",
    icon: "Refrigerator",
  },
  {
    slug: "air-conditioners",
    cat: "Air Conditioners",
    name: "Air Conditioners",
    description: "Split inverter ACs",
    image: "/categories/Air conditioner.webp",
    icon: "Wind",
  },
  {
    slug: "fans",
    cat: "Fans",
    name: "Fans",
    description: "Ceiling · Pedestal · Exhaust",
    image: "/categories/Fan.png",
    icon: "Fan",
  },
  {
    slug: "microwaves",
    cat: "Microwaves",
    name: "Microwaves",
    description: "20–30L microwave ovens",
    image: "/categories/microwave.webp",
    icon: "Microwave",
  },
  {
    slug: "irons",
    cat: "Irons",
    name: "Irons",
    description: "Steam · Ceramic · Garment",
    image: "/categories/Iron.webp",
    icon: "Zap",
  },
  {
    slug: "vacuum-cleaners",
    cat: "Vacuum Cleaners",
    name: "Vacuum Cleaners",
    description: "Upright & everyday cleaning",
    image: null,
    icon: "WashingMachine",
  },
  {
    slug: "blenders-juicers",
    cat: "Blenders & Juicers",
    name: "Blenders & Juicers",
    description: "Kitchen prep appliances",
    image: null,
    icon: "Blend",
  },
] as const;

export const BRANDS = [
  { name: "Haier", image: "/brands/haier.png" },
  { name: "Dawlance", image: "/brands/dawlance.png" },
  { name: "Gaba National", image: "/brands/gaba-national.png" },
  { name: "Canon", image: "/brands/canon.png" },
  { name: "Kenwood", image: "/brands/kenwood.png" },
] as const;

export const TESTIMONIALS = [
  {
    name: "Dr. Ammarah Fayyaz",
    quote:
      "Bought almost all electronics of my home from them. Humble, reliable and honest sellers. Sale quality products with great after sales service.",
  },
  {
    name: "Hamid Khan",
    quote:
      "Excellent quality! AC cooling is outstanding, runs quietly, and offers great value for money. Highly recommended!",
  },
  {
    name: "Ahmadraza Sialwi",
    quote:
      "Excellent service. They provide the product which they commit. Reliable and humble.",
  },
] as const;
