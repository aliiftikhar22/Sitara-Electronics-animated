import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Share2 } from "lucide-react";
import { SITE, CATEGORIES } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/logo.png"
              alt="Sitara Electronics"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="font-display font-semibold text-white text-lg">
              SITARA ELECTRONICS
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Lahore&apos;s wholesale house for refrigerators, ovens, microwaves,
            heaters, ACs and irons — one honest price for everyone, from one
            piece up.
          </p>
          <div className="flex gap-4 mt-6">
            <a
              href={SITE.whatsapp}
              aria-label="WhatsApp"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="Share"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <Share2 className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-medium mb-4 text-sm tracking-wide uppercase">
            Categories
          </h4>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="hover:text-white transition-colors"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-4 text-sm tracking-wide uppercase">
            Company
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="hover:text-white transition-colors"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/track-order"
                className="hover:text-white transition-colors"
              >
                Track Order
              </Link>
            </li>
            <li>
              <Link
                href="/account"
                className="hover:text-white transition-colors"
              >
                Account
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-4 text-sm tracking-wide uppercase">
            Contact
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={`tel:${SITE.phoneHref}`} className="hover:text-white">
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={SITE.whatsapp} className="hover:text-white">
                WhatsApp Us
              </a>
            </li>
            <li>{SITE.address}</li>
            <li>{SITE.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <span>© {new Date().getFullYear()} Sitara Electronics. All rights reserved.</span>
          <Link href="/login" className="hover:text-white/80">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
