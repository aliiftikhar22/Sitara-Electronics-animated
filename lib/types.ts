// Mirrors the real schema already live in Firestore (written by the existing
// admin.js at Downloads/Sitara-Electronics) — 29 real products use exactly
// these field names. Newer optional fields (stock/active/featured/description)
// are additive so old docs keep rendering without a migration.
export interface ProductColor {
  name: string;
  hex: string;
  imageIndex: number;
}

export interface Product {
  id: string;
  name: string;
  cat: string;
  icon?: string;
  price: number;
  old?: number | null;
  save?: number;
  specs?: string[];
  image: string;
  images?: string[];
  colors?: ProductColor[];
  stock?: number;
  active?: boolean;
  featured?: boolean;
  description?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  order: number;
}

// Matches the real order shape already written by the existing storefront
// (script.js): doc id IS the human-readable order id ("STE-XXXXX"), status is
// lowercase, createdAt is a plain Date.now() number (not a Firestore Timestamp).
export type OrderStatus = "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  color?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
  };
  status: OrderStatus;
  createdAt: number;
  /** Optional — set when the customer was signed in at checkout, enabling order history. Guest orders (the historical norm) omit it. */
  uid?: string;
}

export type UserRole = "customer" | "admin";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: unknown;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt?: unknown;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  color?: string;
  stock?: number;
}
