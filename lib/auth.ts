import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";

export async function registerCustomer(
  name: string,
  email: string,
  password: string
): Promise<void> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", cred.user.uid), {
    name,
    email,
    role: "customer",
    createdAt: serverTimestamp(),
  });
}

export async function loginWithEmail(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return { uid, ...(snap.data() as Omit<UserProfile, "uid">) };
}

/**
 * Accounts created before this profile system existed (e.g. the shop
 * owner's original admin.html login) have no users/{uid} doc yet. Rather
 * than leave them stuck, a default 'customer' profile is created the first
 * time they sign in — role can then only be raised to 'admin' by editing
 * Firestore directly (see firestore.rules), matching the "no public admin
 * signup" requirement.
 */
export async function ensureUserProfile(user: User): Promise<UserProfile | null> {
  const existing = await getUserProfile(user.uid);
  if (existing) return existing;

  const profile = {
    name: user.displayName || user.email || "Customer",
    email: user.email ?? "",
    role: "customer" as const,
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(db, "users", user.uid), profile);
  return { uid: user.uid, ...profile };
}
