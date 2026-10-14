"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { getProduct } from "@/data/products";
import { getOrder, useHydrated, type Order } from "@/lib/cart";
import { formatINR } from "@/lib/format";
import { describeLens, describeRx } from "@/lib/lenses";
import { store, whatsappLink } from "@/lib/store";

function orderMessage(o: Order) {
  const lines = o.items.map((i, n) => {
    const p = getProduct(i.sku)!;
    const rx = describeRx(i.lens);
    return [
      `${n + 1}. ${p.name} (${p.sku}) – ${p.colors[i.colorIndex]?.name} × ${i.qty} – ${formatINR(i.unitPrice * i.qty)}`,
      `   Lenses: ${describeLens(p, i.lens)}`,
      rx ? `   ${rx}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  });
  const where =
    o.delivery === "pickup"
      ? "Collect in store"
      : `Deliver to: ${o.customer.address}, ${o.customer.city}, ${o.customer.state} ${o.customer.pincode}`;
  return [
    `Hi ${store.name}! New order ${o.id}`,
    "",
    ...lines,
    "",
    `Total: ${formatINR(o.total)}`,
    `Name: ${o.customer.name} · ${o.customer.phone}`,
    where,
    `Payment: ${o.payment === "store" ? "Pay at store" : "Cash on delivery"}`,
  ].join("\n");
}

export function OrderView() {
  const id = useSearchParams().get("id") ?? "";
  const hydrated = useHydrated();
  if (!hydrated) return null;
  const order = getOrder(id);

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-10 text-center">
        <p className="text-lg font-semibold">We couldn&apos;t find that order on this device.</p>
        <Link href="/shop/" className="btn btn-primary mt-5">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 pt-8">
      <div className="glass fade-up rounded-[2rem] p-6 text-center md:p-8">
        <CheckCircle2 className="mx-auto h-14 w-14 text-success" strokeWidth={1.6} />
        <h1 className="mt-3 text-2xl md:text-3xl">Thank you, {order.customer.name.split(" ")[0]}!</h1>
        <p className="mt-1 text-muted">
          Order <span className="font-semibold text-ink">{order.id}</span> is placed.
        </p>
        <p className="mt-4 text-sm text-muted">
          Send it to us on WhatsApp so our optician can confirm your prescription and start on your
          lenses.
        </p>
        <button
          onClick={() => window.open(whatsappLink(orderMessage(order)), "_blank", "noopener")}
          className="btn btn-primary mt-5 w-full"
        >
          <MessageCircle className="h-4 w-4" /> Send order on WhatsApp
        </button>
      </div>

      <div className="glass mt-4 rounded-[1.75rem] p-5">
        <ul className="space-y-3 text-sm">
          {order.items.map((i) => {
            const p = getProduct(i.sku);
            if (!p) return null;
            return (
              <li key={i.id} className="flex justify-between gap-3">
                <span>
                  <span className="font-medium">
                    {p.name} × {i.qty}
                  </span>
                  <span className="block text-xs text-muted">{describeLens(p, i.lens)}</span>
                </span>
                <span>{formatINR(i.unitPrice * i.qty)}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex justify-between border-t border-ink/8 pt-3 font-semibold">
          <span>Total</span>
          <span>{formatINR(order.total)}</span>
        </div>
        <p className="mt-3 text-xs text-muted">
          {order.delivery === "pickup" ? `Collect from ${store.address}` : `Delivering to ${order.customer.city}`} ·{" "}
          {order.payment === "store" ? "Pay at store" : "Cash on delivery"}
        </p>
      </div>

      <Link href="/shop/" className="btn glass liquid mt-4 w-full">
        Continue shopping
      </Link>
    </div>
  );
}
