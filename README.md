# Sitara Electronics — Cinematic Website

Next.js 16 + TypeScript + Tailwind + GSAP, connected to the same Firebase
project (`sitara-electronics`) the old static site and admin panel already
use. All 29 real products, plus every order placed on the old site, are
already in Firestore — nothing needs to be re-entered.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. `.env.local` already has the real Firebase
config; `.env.example` documents the same variables for deploying elsewhere
(Vercel, Netlify, etc.) — copy those five `NEXT_PUBLIC_FIREBASE_*` values
into your host's environment variable settings.

## Required one-time setup before Auth/Admin will work

The live Firestore security rules are still the old ones (any signed-in
user = admin, and no rule at all for a `users` collection). This repo
includes a **rewritten `firestore.rules`** with real role-based admin
access, but I can't publish it myself — that needs your Firebase login.

1. Go to [Firebase Console](https://console.firebase.google.com) →
   `sitara-electronics` project → Firestore Database → **Rules** tab.
2. Replace the contents with this repo's `firestore.rules` file → **Publish**.
3. Log in at `/login` with your existing admin.html email/password (the
   Auth account already exists — do **not** use `/register` for it). This
   automatically creates a Firestore profile document for you.
4. In Firebase Console → Firestore → `users` collection, find the document
   with your uid and change its `role` field from `customer` to `admin`.
5. Reload `/admin` — you now have the same product/order management as
   before, plus a dashboard and review moderation, gated by that role
   instead of just a hidden URL.

There's no public admin sign-up on purpose — every other visitor who
registers gets `role: "customer"` and can only see their own order history.

## Housekeeping from development

A few test artifacts exist in the live project from verifying the build —
safe to remove whenever convenient:

- **Order `STE-TNP92MK`** (and any other order with a customer name
  containing "TEST ORDER") — placed to confirm checkout writes correctly.
  Delete it from Orders in `admin.html` or the new `/admin`.
- **Two test accounts** in Firebase Console → Authentication:
  `claude-verification-test@sitara-test.invalid` and
  `claude-verification-test-2@sitara-test.invalid` — used to verify
  register/login. Safe to delete.

## Project structure

- `app/` — routes (App Router): home, `/products`, `/products/[id]`,
  `/checkout`, `/track-order`, `/login`, `/register`, `/account`, `/admin`.
- `components/` — UI, including `components/admin/` for the dashboard.
- `lib/firebase.ts`, `lib/firestore.ts`, `lib/auth.ts` — Firebase wiring and
  queries, typed to match the **real** data already in Firestore.
- `lib/gsap.ts` — shared GSAP/ScrollTrigger setup used by every animated
  section.
- `public/products/`, `public/categories/`, `public/brands/` — local image
  assets. Real product photos live as base64 inside Firestore documents
  (the existing admin panel's approach, so no Firebase Storage is needed).
