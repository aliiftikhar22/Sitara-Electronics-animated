"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Search, User, ShoppingCart } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { SITE } from "@/lib/constants";
import { useCart } from "@/lib/useCart";
import { useEscapeKey } from "@/lib/useEscapeKey";
import CartDrawer from "@/components/CartDrawer";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/#categories", label: "Categories" },
  { href: "/#why", label: "About" },
  { href: "/#contact", label: "Contact" },
];

const NAV_HEIGHT = 76;

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const { count } = useCart();
  useEscapeKey(() => setMenuOpen(false), menuOpen);

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-theme='dark']")
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsDark(true);
        });
        const anyIntersecting = entries.some((e) => e.isIntersecting);
        if (!anyIntersecting) {
          const stillDark = targets.some((el) => {
            const rect = el.getBoundingClientRect();
            return rect.top <= NAV_HEIGHT && rect.bottom >= NAV_HEIGHT;
          });
          setIsDark(stillDark);
        }
      },
      { rootMargin: `-${NAV_HEIGHT}px 0px -${100}% 0px`, threshold: 0 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.set(menuRef.current, { display: "flex" });
      gsap.fromTo(
        menuRef.current,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power3.inOut" }
      );
      if (linksRef.current) {
        gsap.fromTo(
          linksRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.06,
            delay: 0.2,
            ease: "power3.out",
          }
        );
      }
    } else {
      document.body.style.overflow = "";
      gsap.to(menuRef.current, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.45,
        ease: "power3.inOut",
        onComplete: () => gsap.set(menuRef.current, { display: "none" }),
      });
    }
  }, [menuOpen]);

  const dark = isDark && !menuOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          dark
            ? "bg-navy/80 backdrop-blur-md text-white"
            : "bg-paper/80 backdrop-blur-md text-ink"
        }`}
        style={{ height: NAV_HEIGHT }}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="Sitara Electronics"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="font-display font-semibold tracking-tight text-lg leading-none">
              SITARA
              <span className="block text-[10px] font-sans font-medium tracking-[0.25em] opacity-70">
                ELECTRONICS
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative opacity-80 transition-opacity hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              aria-label="Search"
              className="hidden sm:flex opacity-80 hover:opacity-100 transition-opacity"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/account"
              aria-label="Account"
              className="hidden sm:flex opacity-80 hover:opacity-100 transition-opacity"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              className="relative opacity-80 hover:opacity-100 transition-opacity"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent-deep text-[10px] font-semibold text-white">
                  {count}
                </span>
              )}
            </button>
            <button
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden opacity-90"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        className="fixed inset-0 z-40 hidden flex-col bg-navy text-white px-8 pt-32 pb-10 md:hidden"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <div ref={linksRef} className="flex flex-col gap-6 text-3xl font-display">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            className="text-left"
            onClick={() => {
              setMenuOpen(false);
              setCartOpen(true);
            }}
          >
            Cart {count > 0 && `(${count})`}
          </button>
          <Link href="/account" onClick={() => setMenuOpen(false)}>
            Account
          </Link>
        </div>
        <div className="mt-auto text-sm opacity-70 space-y-1">
          <p>{SITE.phone}</p>
          <p>{SITE.address}</p>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
