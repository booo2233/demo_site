"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, MessageCircle, QrCode, Share2, ShoppingBag } from "lucide-react";
import { FrameArt } from "@/components/FrameArt";
import { LensPicker } from "@/components/LensPicker";
import { Photo } from "@/components/ProductImage";
import { categoryLabel, shapeLabel, type Product } from "@/data/products";
import { cart } from "@/lib/cart";
import { discountPct, formatINR } from "@/lib/format";
import { defaultLens, describeLens, lensPrice, type LensChoice } from "@/lib/lenses";
import { siteUrl, whatsappLink } from "@/lib/store";

export function ProductView({ product: p }: { product: Product }) {
  const [colorIndex, setColorIndex] = useState(0);
  const [lens, setLens] = useState<LensChoice>(() => defaultLens(p));
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  const color = p.colors[colorIndex];
  const extra = lensPrice(p, lens);
  const total = p.price + extra;
  const off = discountPct(p.price, p.mrp);

  const addToBag = () => {
    cart.add({ sku: p.sku, colorIndex, lens, unitPrice: total });
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  const share = async () => {
    const url = siteUrl(`/p/${p.sku}/`);
    try {
      if (navigator.share) {
        await navigator.share({ title: p.name, text: `${p.name} at Lens Aura`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* share sheet dismissed */
    }
  };

  const enquiry = () =>
    whatsappLink(
      `Hi Lens Aura! I'm interested in ${p.name} (${p.sku}) in ${color.name}, ${formatINR(p.price)}.\n${siteUrl(`/p/${p.sku}/`)}`,
    );

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-20 md:pb-0">
      <Link href={`/shop/?c=${p.category}`} className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> {categoryLabel(p.category)}
      </Link>

      <div className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10">
        {/* Stage */}
        <div className="md:sticky md:top-24 md:self-start">
          <Gallery product={p} colorIndex={colorIndex} />

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => window.open(enquiry(), "_blank", "noopener")}
              className="btn glass liquid flex-1"
            >
              <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
            </button>
            <button onClick={share} className="btn glass liquid" aria-label="Share this frame">
              {copied ? <Check className="h-4 w-4 text-success" /> : <Share2 className="h-4 w-4" />}
              <span className="hidden sm:inline">{copied ? "Link copied" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Details */}
        <div>
          <span className="text-sm text-muted">
            {categoryLabel(p.category)} · {shapeLabel(p.shape)}
          </span>
          <h1 className="mt-1 text-3xl md:text-4xl">{p.name}</h1>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-2xl font-semibold">{formatINR(p.price)}</span>
            {off > 0 && (
              <>
                <span className="text-faint line-through">{formatINR(p.mrp!)}</span>
                <span className="text-sm font-semibold text-success">{off}% off</span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-muted">Frame with standard lenses. Inclusive of GST.</p>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">{p.description}</p>

          {/* Colours */}
          <div className="mt-6">
            <div className="text-sm">
              <span className="font-semibold">Colour</span> <span className="text-muted">· {color.name}</span>
            </div>
            <div role="radiogroup" aria-label="Colour" className="mt-2.5 flex gap-3">
              {p.colors.map((c, i) => (
                <button
                  key={c.name}
                  role="radio"
                  aria-checked={i === colorIndex}
                  aria-label={c.name}
                  onClick={() => setColorIndex(i)}
                  className={`liquid relative h-11 w-11 rounded-full p-1 ${i === colorIndex ? "ring-2 ring-accent" : "glass"}`}
                >
                  <span
                    className="block h-full w-full overflow-hidden rounded-full ring-1 ring-black/10"
                    style={{ background: `linear-gradient(135deg, ${c.frame} 55%, ${c.lens} 55%)` }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="glass mt-6 rounded-[1.75rem] p-5">
            <div className="flex items-center justify-around text-center">
              {[
                { v: p.size.lens, l: "Lens width" },
                { v: p.size.bridge, l: "Bridge" },
                { v: p.size.temple, l: "Temple" },
              ].map((s, i) => (
                <div key={s.l} className="flex items-center gap-4">
                  {i > 0 && <span className="h-8 w-px bg-ink/10" />}
                  <div>
                    <div className="text-xl font-semibold">
                      {s.v}
                      <span className="text-sm font-normal text-muted"> mm</span>
                    </div>
                    <div className="text-xs text-muted">{s.l}</div>
                  </div>
                </div>
              ))}
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-ink/8 pt-4 text-sm">
              <Spec k="Material" v={p.material} />
              <Spec k="Weight" v={`${p.weight} g`} />
              <Spec k="Shape" v={shapeLabel(p.shape)} />
              <Spec k="Frame code" v={p.sku} />
            </dl>
            <ul className="mt-4 space-y-1.5 border-t border-ink/8 pt-4 text-sm">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Lenses */}
          <h2 className="mt-10 text-2xl">Choose your lenses</h2>
          <p className="mt-1 mb-5 text-sm text-muted">Made in our lab and fitted to this frame.</p>
          <LensPicker product={p} value={lens} onChange={setLens} />

          {/* Summary (desktop) */}
          <div className="glass mt-8 hidden rounded-[1.75rem] p-5 md:block">
            <Summary p={p} lens={lens} extra={extra} total={total} />
            <button onClick={addToBag} className="btn btn-primary mt-4 w-full">
              {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
              {added ? "Added to bag" : "Add to bag"}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky buy bar (phones), floats above the tab bar */}
      <div
        className="no-print fixed inset-x-0 z-30 flex justify-center px-4 md:hidden"
        style={{ bottom: "calc(5.85rem + env(safe-area-inset-bottom))" }}
      >
        <div className="glass glass-strong flex w-full max-w-sm items-center gap-3 rounded-full p-1.5 pl-5">
          <div className="min-w-0 flex-1 leading-tight">
            <div className="font-semibold">{formatINR(total)}</div>
            <div className="truncate text-[11px] text-muted">{describeLens(p, lens)}</div>
          </div>
          <button onClick={addToBag} className="btn btn-primary">
            {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
            {added ? "Added" : "Add to bag"}
          </button>
        </div>
      </div>

      {added && (
        <div className="no-print fixed inset-x-0 top-20 z-50 flex justify-center px-4">
          <Link href="/bag/" className="glass glass-strong fade-up flex items-center gap-3 rounded-full py-2 pr-2 pl-4 text-sm font-medium">
            <Check className="h-4 w-4 text-success" /> Added to your bag
            <span className="rounded-full bg-ink px-3 py-1.5 text-bg">View bag</span>
          </Link>
        </div>
      )}
    </div>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}

function Summary({ p, lens, extra, total }: { p: Product; lens: LensChoice; extra: number; total: number }) {
  return (
    <dl className="space-y-1.5 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">Frame + standard lenses</dt>
        <dd>{formatINR(p.price)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-muted">{describeLens(p, lens)}</dt>
        <dd>{extra ? `+ ${formatINR(extra)}` : "Included"}</dd>
      </div>
      <div className="flex justify-between border-t border-ink/8 pt-2 text-base font-semibold">
        <dt>Total</dt>
        <dd>{formatINR(total)}</dd>
      </div>
    </dl>
  );
}

/** Swipeable photos of the frame, ending with a live colour preview. */
function Gallery({ product: p, colorIndex }: { product: Product; colorIndex: number }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const color = p.colors[colorIndex];
  const photos = p.images ?? [];
  const slides = photos.length + 1;

  const goTo = (i: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="fade-up">
      <div className="glass relative overflow-hidden rounded-[2.25rem] p-2">
        <div
          ref={track}
          onScroll={(e) => {
            const el = e.currentTarget;
            setActive(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="no-scrollbar flex aspect-square snap-x snap-mandatory overflow-x-auto rounded-[1.8rem] md:aspect-[5/4]"
        >
          {photos.map((src, i) => (
            <div key={src} className="h-full w-full shrink-0 snap-center bg-white/40 dark:bg-white/5">
              <Photo src={src} alt={`${p.name}, view ${i + 1}`} eager={i === 0} />
            </div>
          ))}
          <div className="relative grid h-full w-full shrink-0 snap-center place-items-center bg-white/30 dark:bg-[#ebe3d6]">
            <div
              className="absolute inset-[18%] rounded-full opacity-50 blur-3xl transition-colors duration-700"
              style={{ background: color.frame }}
            />
            <FrameArt key={colorIndex} shape={p.shape} color={color} material={p.material} className="fade-up relative w-[84%]" />
            <span className="glass glass-strong absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap">
              Colour preview · {color.name}
            </span>
          </div>
        </div>

        <span className="glass glass-strong absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold">
          <QrCode className="h-3.5 w-3.5" /> {p.sku}
        </span>
        {p.badge && (
          <span className="glass glass-strong absolute top-5 right-5 rounded-full px-3 py-1.5 text-xs font-semibold">
            {p.badge}
          </span>
        )}
      </div>

      {slides > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto p-0.5">
          {photos.map((src, i) => (
            <button
              key={src}
              onClick={() => goTo(i)}
              aria-label={`Show view ${i + 1}`}
              className={`liquid h-16 w-20 shrink-0 overflow-hidden rounded-2xl ${
                active === i ? "ring-2 ring-accent" : "glass opacity-75"
              }`}
            >
              <Photo src={src} alt="" />
            </button>
          ))}
          <button
            onClick={() => goTo(photos.length)}
            aria-label="Show colour preview"
            className={`liquid grid h-16 w-20 shrink-0 place-items-center rounded-2xl ${
              active === photos.length ? "glass glass-strong ring-2 ring-accent dark:bg-[#ebe3d6]" : "glass opacity-75 dark:bg-[#ebe3d6]"
            }`}
          >
            <FrameArt shape={p.shape} color={color} material={p.material} className="w-[86%]" />
          </button>
        </div>
      )}
    </div>
  );
}
