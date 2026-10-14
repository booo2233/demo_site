"use client";

import { useSyncExternalStore } from "react";
import type { LensChoice } from "@/lib/lenses";

export type CartItem = {
  id: string;
  sku: string;
  colorIndex: number;
  lens: LensChoice;
  qty: number;
  unitPrice: number; // frame + lenses, ₹
};

export type Order = {
  id: string;
  createdAt: string;
  items: CartItem[];
  total: number;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  delivery: "pickup" | "home";
  payment: "store" | "cod" | "upi";
};

const CART_KEY = "lensaura.cart.v1";
const ORDERS_KEY = "lensaura.orders.v1";
const EMPTY: CartItem[] = [];

// Storage can be unavailable (private mode, blocked site data), so every
// access is guarded and the cart falls back to living in memory.
function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* keep in memory only */
  }
}

let items: CartItem[] | null = null;
const listeners = new Set<() => void>();

function read() {
  if (items === null) items = load<CartItem[]>(CART_KEY, []);
  return items;
}

function write(next: CartItem[]) {
  items = next;
  save(CART_KEY, next);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_KEY) {
      items = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart() {
  const cart = useSyncExternalStore(subscribe, read, () => EMPTY);
  const count = cart.reduce((n, i) => n + i.qty, 0);
  const total = cart.reduce((n, i) => n + i.qty * i.unitPrice, 0);
  return { items: cart, count, total };
}

export const cart = {
  add(item: Omit<CartItem, "id" | "qty">) {
    write([...read(), { ...item, id: crypto.randomUUID(), qty: 1 }]);
  },
  setQty(id: string, qty: number) {
    write(
      qty <= 0
        ? read().filter((i) => i.id !== id)
        : read().map((i) => (i.id === id ? { ...i, qty } : i)),
    );
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id));
  },
  clear() {
    write([]);
  },
};

export function placeOrder(order: Omit<Order, "id" | "createdAt">): Order {
  const full: Order = {
    ...order,
    id: `LA${Date.now().toString(36).toUpperCase().slice(-6)}`,
    createdAt: new Date().toISOString(),
  };
  save(ORDERS_KEY, [full, ...load<Order[]>(ORDERS_KEY, [])].slice(0, 20));
  cart.clear();
  return full;
}

export function getOrder(id: string) {
  return load<Order[]>(ORDERS_KEY, []).find((o) => o.id === id);
}

const noop = () => () => {};

/** False during the static prerender and hydration, true afterwards. */
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}
