import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Order, OrderStatus, Product, Review } from "@/lib/types";

function toProduct(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    name: (data.name as string) ?? "Unnamed product",
    cat: (data.cat as string) ?? "Uncategorized",
    icon: data.icon as string | undefined,
    price: (data.price as number) ?? 0,
    old: (data.old as number | null | undefined) ?? null,
    save: (data.save as number | undefined) ?? 0,
    specs: (data.specs as string[] | undefined) ?? [],
    image: (data.image as string) ?? "",
    images: (data.images as string[] | undefined) ?? [],
    colors: (data.colors as Product["colors"]) ?? [],
    stock: data.stock as number | undefined,
    active: data.active as boolean | undefined,
    featured: data.featured as boolean | undefined,
    description: data.description as string | undefined,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/** All products whose `active` flag isn't explicitly false (legacy docs have no field at all → treated as active). */
export async function getProducts(): Promise<Product[]> {
  const snap = await getDocs(query(collection(db, "products"), orderBy("name")));
  return snap.docs
    .map((d) => toProduct(d.id, d.data()))
    .filter((p) => p.active !== false);
}

export async function getProductById(id: string): Promise<Product | null> {
  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return toProduct(snap.id, snap.data());
}

/** Distinct category strings actually present on real products, with counts — used to keep filters honest even as the catalog changes. */
export async function getProductCategoryCounts(): Promise<Record<string, number>> {
  const products = await getProducts();
  return products.reduce<Record<string, number>>((acc, p) => {
    acc[p.cat] = (acc[p.cat] ?? 0) + 1;
    return acc;
  }, {});
}

export function pickFeaturedProduct(products: Product[]): Product | null {
  if (products.length === 0) return null;
  const flagged = products.find((p) => p.featured);
  if (flagged) return flagged;
  const withDiscount = products.filter((p) => (p.save ?? 0) > 0);
  const pool = withDiscount.length ? withDiscount : products;
  return pool.reduce((best, p) => (p.price > best.price ? p : best), pool[0]);
}

/** Same format the existing storefront (script.js) writes — doc id doubles as the human-readable order id. */
export function generateOrderId(): string {
  return (
    "STE-" +
    Date.now().toString(36).toUpperCase().slice(-5) +
    Math.random().toString(36).slice(2, 4).toUpperCase()
  );
}

export async function createOrder(order: Order): Promise<void> {
  await setDoc(doc(db, "orders", order.id), order);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, "orders", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Order, "id">) };
}

export function subscribeToOrder(
  id: string,
  onChange: (order: Order | null) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    doc(db, "orders", id),
    (snap) => {
      onChange(snap.exists() ? { id: snap.id, ...(snap.data() as Omit<Order, "id">) } : null);
    },
    (err) => onError?.(err)
  );
}

/** Requires the caller to be signed in as that uid (or admin) per firestore.rules. */
export async function getOrdersByUid(uid: string): Promise<Order[]> {
  const snap = await getDocs(query(collection(db, "orders"), where("uid", "==", uid)));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Order, "id">) }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

// ---------- Admin ----------

export function subscribeToAllProducts(
  onChange: (products: Product[]) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    query(collection(db, "products"), orderBy("name")),
    (snap) => onChange(snap.docs.map((d) => toProduct(d.id, d.data()))),
    (err) => onError?.(err)
  );
}

export function subscribeToAllOrders(
  onChange: (orders: Order[]) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    collection(db, "orders"),
    (snap) => {
      const orders = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<Order, "id">) }))
        .sort((a, b) => b.createdAt - a.createdAt);
      onChange(orders);
    },
    (err) => onError?.(err)
  );
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await updateDoc(doc(db, "orders", id), { status });
}

export async function deleteOrder(id: string): Promise<void> {
  await deleteDoc(doc(db, "orders", id));
}

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

export async function saveProduct(input: ProductInput, id?: string): Promise<void> {
  const data = {
    ...input,
    updatedAt: serverTimestamp(),
    ...(id ? {} : { createdAt: serverTimestamp() }),
  };
  if (id) {
    await updateDoc(doc(db, "products", id), data);
  } else {
    await setDoc(doc(collection(db, "products")), data);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, "products", id));
}

export function subscribeToReviews(
  onChange: (reviews: Review[]) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    collection(db, "reviews"),
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Review, "id">) }))),
    (err) => onError?.(err)
  );
}

export async function setReviewApproved(id: string, approved: boolean): Promise<void> {
  await updateDoc(doc(db, "reviews", id), { approved });
}

export async function deleteReview(id: string): Promise<void> {
  await deleteDoc(doc(db, "reviews", id));
}

// ---------- Public reviews ----------

/** Only approved reviews are readable by everyone per firestore.rules. */
export async function getApprovedReviews(productId: string): Promise<Review[]> {
  const snap = await getDocs(
    query(
      collection(db, "reviews"),
      where("productId", "==", productId),
      where("approved", "==", true)
    )
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Review, "id">) }))
    .sort((a, b) => {
      const aTime = a.createdAt instanceof Object && "toMillis" in a.createdAt ? (a.createdAt as { toMillis(): number }).toMillis() : 0;
      const bTime = b.createdAt instanceof Object && "toMillis" in b.createdAt ? (b.createdAt as { toMillis(): number }).toMillis() : 0;
      return bTime - aTime;
    });
}

export async function submitReview(input: {
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
}): Promise<void> {
  await setDoc(doc(collection(db, "reviews")), {
    ...input,
    approved: false,
    createdAt: serverTimestamp(),
  });
}
