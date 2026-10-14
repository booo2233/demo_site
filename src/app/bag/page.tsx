"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { FrameArt } from "@/components/FrameArt";
import { getProduct } from "@/data/products";
import { cart, useCart, useHydrated, type CartItem } from "@/lib/cart";
import { formatINR } from "@/lib/format";
import { describeLens, describeRx } from "@/lib/lenses";

export default function BagPage() {
  const { items, count, total } = useCart();
  const hydrated = useHydrated();

  return (
    <div className="mx-auto max-w-4xl px-4 pt-6">
      <h1 className="text-3xl md:text-4xl">Your bag</h1>

      {!hydrated ? null : items.length === 0 ? (
        <div className="glass fade-up mt-6 flex flex-col items-center rounded-[2rem] px-6 py-14 text-center">
          <span className="glass-strong grid h-16 w-16 place-items-center rounded-full">
            <ShoppingBag className="h-7 w-7 text-muted" />
          </span>
          <p className="mt-4 text-lg font-semibold">Your bag is empty</p>
          <p className="mt-1 text-sm text-muted">Scan a frame&apos;s tag in store, or browse the collection.</p>
          <Link href="/shop/" className="btn btn-primary mt-6">
            Browse frames
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_20rem]">
          <ul className="space-y-3">
            {items.map((item) => (
              <BagLine key={item.id} item={item} />
            ))}
          </ul>
          <aside className="glass h-fit rounded-[1.75rem] p-5 md:sticky md:top-24">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">
                  Subtotal ({count} {count === 1 ? "item" : "items"})
                </dt>
                <dd>{formatINR(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Delivery</dt>
                <dd className="text-success">Free</dd>
              </div>
              <div className="flex justify-between border-t border-ink/8 pt-3 text-lg font-semibold">
                <dt>Total</dt>
                <dd>{formatINR(total)}</dd>
              </div>
            </dl>
            <Link href="/checkout/" className="btn btn-primary mt-5 w-full">
              Checkout
            </Link>
            <p className="mt-3 text-center text-xs text-muted">Lenses ready in 3–5 days · Free adjustments for life</p>
          </aside>
        </div>
      )}
    </div>
  );
}

function BagLine({ item }: { item: CartItem }) {
  const p = getProduct(item.sku);
  if (!p) return null;
  const color = p.colors[item.colorIndex] ?? p.colors[0];
  const rx = describeRx(item.lens);
  return (
    <li className="glass fade-up flex gap-4 rounded-[1.75rem] p-3 pr-4">
      <Link
        href={`/p/${p.sku}/`}
        className="grid aspect-square w-24 shrink-0 place-items-center rounded-[1.25rem] bg-white/40 sm:w-28 dark:bg-white/5"
      >
        <FrameArt shape={p.shape} color={color} material={p.material} className="w-[88%]" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col py-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/p/${p.sku}/`} className="font-semibold">
              {p.name}
            </Link>
            <div className="text-xs text-muted">
              {color.name} · {p.sku}
            </div>
          </div>
          <span className="font-semibold">{formatINR(item.unitPrice * item.qty)}</span>
        </div>
        <div className="mt-1 text-xs text-muted">{describeLens(p, item.lens)}</div>
        {rx && <div className="mt-0.5 truncate text-xs text-muted">{rx}</div>}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="glass flex items-center rounded-full">
            <button
              className="grid h-8 w-8 place-items-center"
              aria-label="Decrease quantity"
              onClick={() => cart.setQty(item.id, item.qty - 1)}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
            <button
              className="grid h-8 w-8 place-items-center"
              aria-label="Increase quantity"
              onClick={() => cart.setQty(item.id, item.qty + 1)}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={() => cart.remove(item.id)}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        </div>
      </div>
    </li>
  );
}
