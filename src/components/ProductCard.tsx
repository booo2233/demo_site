import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { categoryLabel, type Product } from "@/data/products";
import { discountPct, formatINR } from "@/lib/format";

export function ProductCard({ product: p, className = "" }: { product: Product; className?: string }) {
  const off = discountPct(p.price, p.mrp);
  return (
    <Link
      href={`/p/${p.sku}/`}
      className={`glass liquid group flex flex-col overflow-hidden rounded-[1.75rem] p-2.5 ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.3rem] bg-white/40 dark:bg-white/5">
        <ProductImage
          product={p}
          className="transition-transform duration-700 ease-spring group-hover:scale-105"
        />
        {p.badge && (
          <span className="glass glass-strong absolute top-2 left-2 rounded-full px-2.5 py-1 text-[11px] font-semibold">
            {p.badge}
          </span>
        )}
        <div className="glass absolute right-2 bottom-2 flex gap-1 rounded-full px-1.5 py-1">
          {p.colors.map((c) => (
            <span
              key={c.name}
              className="h-3 w-3 rounded-full ring-1 ring-black/15"
              style={{ background: c.frame }}
              title={c.name}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col px-1.5 pt-2.5 pb-1">
        <span className="text-xs text-muted">{categoryLabel(p.category)}</span>
        <span className="mt-0.5 font-semibold leading-snug">{p.name}</span>
        <span className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-1.5">
          <span className="font-semibold">{formatINR(p.price)}</span>
          {off > 0 && (
            <>
              <span className="text-xs text-faint line-through">{formatINR(p.mrp!)}</span>
              <span className="text-xs font-semibold text-success">{off}% off</span>
            </>
          )}
        </span>
      </div>
    </Link>
  );
}
