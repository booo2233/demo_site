"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, MapPin, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { asset, store } from "@/lib/store";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop/", label: "Shop", icon: LayoutGrid },
  { href: "/visit/", label: "Visit", icon: MapPin },
  { href: "/bag/", label: "Bag", icon: ShoppingBag },
];

function isActive(pathname: string, href: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  const target = href.replace(/\/$/, "") || "/";
  if (target === "/") return path === "/";
  if (target === "/shop") return path === "/shop" || path.startsWith("/p");
  return path.startsWith(target);
}

/* eslint-disable @next/next/no-img-element -- static export serves images as-is */
export function Logo({ className = "", tone = "auto" }: { className?: string; tone?: "auto" | "deep" }) {
  const img = (v: "deep" | "gold", extra = "") => (
    <span className={`items-center gap-2.5 ${extra}`}>
      <img src={asset(`/images/mark-${v}.png`)} alt="" className="h-6 w-auto" />
      <img src={asset(`/images/wordmark-${v}.png`)} alt={store.name} className="h-[15px] w-auto" />
    </span>
  );
  return (
    <span className={`inline-flex ${className}`}>
      {tone === "deep" ? img("deep", "flex") : (
        <>
          {img("deep", "flex dark:hidden")}
          {img("gold", "hidden dark:flex")}
        </>
      )}
    </span>
  );
}

function BagBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute -top-1 -right-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-bg">
      {count}
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  return (
    <header className="no-print sticky top-0 z-40 px-4 pt-3">
      <nav className="glass mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full pr-2 pl-5">
        <Link href="/" aria-label={`${store.name} home`}>
          <Logo />
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {tabs.slice(0, 3).map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(pathname, t.href) ? "bg-ink/8 text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {t.label === "Visit" ? "Visit store" : t.label}
            </Link>
          ))}
        </div>
        <Link
          href="/bag/"
          className="liquid relative grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5"
          aria-label={`Bag, ${count} items`}
        >
          <ShoppingBag className="h-5 w-5" strokeWidth={1.8} />
          <BagBadge count={count} />
        </Link>
      </nav>
    </header>
  );
}

export function TabBar() {
  const pathname = usePathname();
  const { count } = useCart();
  return (
    <nav
      className="no-print fixed inset-x-0 z-40 flex justify-center px-4 md:hidden"
      style={{ bottom: "calc(0.85rem + env(safe-area-inset-bottom))" }}
      aria-label="Main"
    >
      <div className="glass flex w-full max-w-sm items-center justify-between rounded-full p-1.5">
        {tabs.map((t) => {
          const active = isActive(pathname, t.href);
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-medium transition-all duration-500 ease-spring ${
                active ? "glass-strong text-accent" : "text-muted"
              }`}
              style={
                active
                  ? {
                      boxShadow:
                        "inset 0 1px 0 var(--glass-rim), 0 0 0 1px var(--glass-edge), 0 4px 14px -4px rgba(0,0,0,.18)",
                    }
                  : undefined
              }
            >
              <span className="relative">
                <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.2 : 1.8} />
                {t.href === "/bag/" && <BagBadge count={count} />}
              </span>
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="no-print mx-auto mt-16 max-w-6xl px-4">
      <div className="glass flex flex-col gap-6 rounded-[2rem] p-6 text-sm md:flex-row md:items-start md:justify-between md:p-8">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-muted">
            Eyewear boutique in Kakkanad. Eye testing, designer frames, lenses and premium sunglasses.
          </p>
          <p className="mt-3 text-muted">{store.address}</p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <span className="eyebrow">Shop</span>
            <Link href="/shop/?c=eyeglasses" className="text-muted hover:text-ink">Eyeglasses</Link>
            <Link href="/shop/?c=sunglasses" className="text-muted hover:text-ink">Sunglasses</Link>
            <Link href="/shop/?c=rx-sunglasses" className="text-muted hover:text-ink">Prescription sunglasses</Link>
            <Link href="/shop/?c=computer" className="text-muted hover:text-ink">Computer glasses</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="eyebrow">Store</span>
            <Link href="/visit/" className="text-muted hover:text-ink">Visit &amp; eye test</Link>
            <Link href="/admin/qr/" className="text-muted hover:text-ink">QR labels (staff)</Link>
            <a href={`tel:${store.phone.replace(/\s/g, "")}`} className="text-muted hover:text-ink">
              {store.phone}
            </a>
            <a
              href={`https://instagram.com/${store.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="text-muted hover:text-ink"
            >
              @{store.instagram}
            </a>
          </div>
        </div>
      </div>
      <p className="py-6 text-center text-xs text-faint">
        © {new Date().getFullYear()} {store.name}. Demo website — prices and products are samples.
      </p>
    </footer>
  );
}
