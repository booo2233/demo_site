"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Printer, RotateCcw } from "lucide-react";
import { Logo } from "@/components/Shell";
import { categories, products, type Category } from "@/data/products";
import { useHydrated } from "@/lib/cart";
import { formatINR } from "@/lib/format";
import { asset, siteUrl, store } from "@/lib/store";

type Mode = "labels" | "poster";

function useQrSvgs(urls: string[]) {
  const [svgs, setSvgs] = useState<Record<string, string>>({});
  const key = urls.join("|");
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      urls.map((u) =>
        QRCode.toString(u, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#000", light: "#fff" } }).then(
          (svg) => [u, svg] as const,
        ),
      ),
    ).then((pairs) => {
      if (!cancelled) setSvgs(Object.fromEntries(pairs));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` captures `urls`
  }, [key]);
  return svgs;
}

function Qr({ svg, className }: { svg?: string; className?: string }) {
  if (!svg) return <div className={`animate-pulse rounded bg-black/10 ${className}`} />;
  return <div className={`[&>svg]:h-full [&>svg]:w-full ${className}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export function QrSheet() {
  const hydrated = useHydrated();
  const [mode, setMode] = useState<Mode>("labels");
  const [override, setOverride] = useState<string | null>(null);
  const [filter, setFilter] = useState<Category | null>(null);
  const [excluded, setExcluded] = useState<Set<string>>(new Set());

  const detected = hydrated ? siteUrl("").replace(/\/$/, "") : "";
  const base = (override ?? detected).replace(/\/$/, "");

  const visible = products.filter((p) => !filter || p.category === filter);
  const selected = visible.filter((p) => !excluded.has(p.sku));
  const posterUrl = `${base}/shop/`;
  const urls = useMemo(
    () => (base ? [posterUrl, ...products.map((p) => `${base}/p/${p.sku}/`)] : []),
    [base, posterUrl],
  );
  const svgs = useQrSvgs(urls);

  const toggle = (sku: string) => {
    const next = new Set(excluded);
    if (next.has(sku)) next.delete(sku);
    else next.add(sku);
    setExcluded(next);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <div className="no-print">
        <span className="eyebrow">Staff tools</span>
        <h1 className="mt-1 text-3xl md:text-4xl">QR codes</h1>
        <p className="mt-2 max-w-xl text-muted">
          Print a label for every frame on display, plus a poster for the counter. Each frame&apos;s code
          opens its own page and never changes, even if you edit the price or photos later.
        </p>

        <div className="glass mt-6 space-y-4 rounded-[1.75rem] p-5">
          <div role="radiogroup" aria-label="What to print" className="glass flex w-fit rounded-full p-1">
            {(["labels", "poster"] as const).map((m) => (
              <button
                key={m}
                role="radio"
                aria-checked={mode === m}
                onClick={() => setMode(m)}
                className={`h-9 rounded-full px-4 text-sm font-medium transition-all duration-500 ease-spring ${
                  mode === m ? "bg-ink text-bg" : "text-muted"
                }`}
              >
                {m === "labels" ? "Frame labels" : "Store poster"}
              </button>
            ))}
          </div>

          <label className="block">
            <span className="text-xs font-medium text-muted">Website address the codes point to</span>
            <div className="mt-1.5 flex gap-2">
              <input
                className="field"
                value={override ?? detected}
                onChange={(e) => setOverride(e.target.value)}
                placeholder="https://lensaura.in"
                spellCheck={false}
              />
              {override !== null && (
                <button onClick={() => setOverride(null)} className="btn glass liquid px-3" aria-label="Reset address">
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>
            <span className="mt-1 block text-xs text-muted">
              Change this to the shop&apos;s real domain before printing the final labels.
            </span>
          </label>

          {mode === "labels" && (
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
              <button className="chip glass liquid" aria-pressed={!filter} onClick={() => setFilter(null)}>
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  className="chip glass liquid"
                  aria-pressed={filter === c.id}
                  onClick={() => setFilter(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted">
              {mode === "labels" ? `${selected.length} labels selected · tap a label to skip it` : "One A4 poster"}
            </span>
            <button onClick={() => window.print()} className="btn btn-primary" disabled={!base}>
              <Printer className="h-4 w-4" /> Print
            </button>
          </div>
        </div>
      </div>

      {/* The printable sheet */}
      <div className="mt-6 rounded-[1.25rem] bg-white p-4 text-black shadow-xl print:mt-0 print:rounded-none print:p-0 print:shadow-none">
        {mode === "labels" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 print:grid-cols-3 print:gap-[4mm]">
            {visible.map((p) => {
              const url = `${base}/p/${p.sku}/`;
              const skip = excluded.has(p.sku);
              return (
                <button
                  key={p.sku}
                  onClick={() => toggle(p.sku)}
                  className={`flex break-inside-avoid flex-col items-center rounded-xl border border-dashed border-black/25 p-3 text-center transition-opacity ${
                    skip ? "opacity-25 print:hidden" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset("/images/wordmark-deep.png")} alt={store.name} className="h-auto w-[70%] max-w-[32mm]" />
                  <Qr svg={svgs[url]} className="mt-2 aspect-square w-full max-w-[34mm]" />
                  <span className="mt-2 text-sm leading-tight font-semibold">{p.name}</span>
                  <span className="text-xs">
                    {formatINR(p.price)} · <span className="font-mono">{p.sku}</span>
                  </span>
                  <span className="mt-1 text-[10px] text-black/60">Scan for sizes, colours &amp; lenses</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-10 text-center print:py-[20mm]">
            <Logo tone="deep" className="scale-150" />
            <h2 className="mt-10 text-4xl tracking-tight md:text-5xl">Scan to explore</h2>
            <p className="mt-2 text-lg text-black/60">Every frame in the store, with prices and lens options.</p>
            <Qr svg={svgs[posterUrl]} className="mt-8 aspect-square w-64 md:w-80 print:w-[110mm]" />
            <p className="mt-6 font-mono text-sm text-black/50">{posterUrl.replace(/^https?:\/\//, "")}</p>
            <p className="mt-8 text-sm text-black/60">
              Or tap the QR tag on any frame · {store.hours[0].days} {store.hours[0].time}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
