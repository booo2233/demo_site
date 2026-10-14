"use client";

import { useEffect, useState } from "react";
import { Camera, ClipboardList, Store } from "lucide-react";
import type { Product } from "@/data/products";
import { formatINR } from "@/lib/format";
import {
  coatingOptions,
  emptyRx,
  thicknessOptions,
  visionOptions,
  type EyeRx,
  type LensChoice,
  type Prescription,
  type RxMode,
} from "@/lib/lenses";

type Opt = { id: string; label: string; detail: string; price: number };

function OptionGrid<T extends Opt>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: T[];
  value: string;
  onChange: (id: T["id"]) => void;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="grid gap-2 sm:grid-cols-3">
      {options.map((o) => {
        const checked = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => onChange(o.id)}
            className={`liquid flex items-start justify-between gap-2 rounded-2xl p-3.5 text-left sm:flex-col ${
              checked ? "glass glass-strong ring-2 ring-accent" : "glass"
            }`}
          >
            <span>
              <span className="block text-[0.95rem] font-semibold">{o.label}</span>
              <span className="block text-xs text-muted">{o.detail}</span>
            </span>
            <span className={`shrink-0 text-sm font-medium ${o.price ? "" : "text-success"}`}>
              {o.price ? `+ ${formatINR(o.price)}` : "Included"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-xs font-bold text-bg">{n}</span>
        <span className="font-semibold">{title}</span>
      </div>
      {children}
    </div>
  );
}

const rxModes: { id: RxMode; label: string; icon: typeof Camera }[] = [
  { id: "enter", label: "Type it in", icon: ClipboardList },
  { id: "upload", label: "Upload photo", icon: Camera },
  { id: "later", label: "Later / eye test", icon: Store },
];

export function LensPicker({
  product,
  value,
  onChange,
}: {
  product: Product;
  value: LensChoice;
  onChange: (v: LensChoice) => void;
}) {
  const set = (patch: Partial<LensChoice>) => onChange({ ...value, ...patch });
  const needsRx = value.vision !== "zero";

  return (
    <div className="space-y-6">
      <Step n={1} title="Vision">
        <OptionGrid
          name="Vision"
          options={visionOptions(product)}
          value={value.vision}
          onChange={(vision) => set({ vision })}
        />
      </Step>

      <Step n={2} title={product.lensKind === "sun" ? "Tint" : "Lens type"}>
        <OptionGrid
          name="Lens type"
          options={coatingOptions(product)}
          value={value.coating}
          onChange={(coating) => set({ coating })}
        />
      </Step>

      {needsRx && (
        <>
          <Step n={3} title="Lens thickness">
            <OptionGrid
              name="Lens thickness"
              options={thicknessOptions}
              value={value.thickness}
              onChange={(thickness) => set({ thickness })}
            />
          </Step>

          <Step n={4} title="Your prescription">
            <div role="radiogroup" aria-label="Prescription" className="glass flex rounded-full p-1">
              {rxModes.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={value.rxMode === id}
                  onClick={() => set({ rxMode: id, rx: id === "enter" ? (value.rx ?? emptyRx()) : value.rx })}
                  className={`flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full text-xs font-medium transition-all duration-500 ease-spring sm:text-sm ${
                    value.rxMode === id ? "bg-ink text-bg shadow" : "text-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>

            <div className="mt-3">
              {value.rxMode === "enter" && (
                <RxForm
                  rx={value.rx ?? emptyRx()}
                  showAdd={value.vision === "progressive"}
                  onChange={(rx) => set({ rx })}
                />
              )}
              {value.rxMode === "upload" && (
                <RxUpload fileName={value.rxFileName} onFile={(rxFileName) => set({ rxFileName })} />
              )}
              {value.rxMode === "later" && (
                <p className="glass rounded-2xl p-4 text-sm text-muted">
                  No problem. Send it to us on WhatsApp after ordering, or get a free eye test in store
                  before we cut your lenses.
                </p>
              )}
            </div>
          </Step>
        </>
      )}
    </div>
  );
}

function RxForm({
  rx,
  showAdd,
  onChange,
}: {
  rx: Prescription;
  showAdd: boolean;
  onChange: (rx: Prescription) => void;
}) {
  const cols: (keyof EyeRx)[] = showAdd ? ["sph", "cyl", "axis", "add"] : ["sph", "cyl", "axis"];
  const eyes = [
    { key: "right" as const, label: "Right (OD)" },
    { key: "left" as const, label: "Left (OS)" },
  ];
  return (
    <div className="glass rounded-2xl p-4">
      <div className="grid gap-2" style={{ gridTemplateColumns: `5.5rem repeat(${cols.length}, minmax(0, 1fr))` }}>
        <span />
        {cols.map((c) => (
          <span key={c} className="eyebrow text-center">
            {c}
          </span>
        ))}
        {eyes.map((eye) => (
          <div key={eye.key} className="contents">
            <span className="self-center text-sm font-medium">{eye.label}</span>
            {cols.map((c) => (
              <input
                key={c}
                aria-label={`${eye.label} ${c.toUpperCase()}`}
                className="field h-11 px-2 text-center"
                inputMode={c === "axis" ? "numeric" : "decimal"}
                placeholder={c === "axis" ? "0–180" : "0.00"}
                value={rx[eye.key][c]}
                onChange={(e) =>
                  onChange({ ...rx, [eye.key]: { ...rx[eye.key], [c]: e.target.value } })
                }
              />
            ))}
          </div>
        ))}
      </div>
      <label className="mt-3 flex items-center gap-3">
        <span className="w-[5.5rem] text-sm font-medium">PD (mm)</span>
        <input
          className="field h-11 max-w-[7rem] text-center"
          inputMode="decimal"
          placeholder="63"
          value={rx.pd}
          onChange={(e) => onChange({ ...rx, pd: e.target.value })}
        />
      </label>
      <p className="mt-3 text-xs text-muted">
        Copy the numbers from your prescription slip. Our optician double-checks every order before
        cutting lenses.
      </p>
    </div>
  );
}

function RxUpload({ fileName, onFile }: { fileName?: string; onFile: (name: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <label className="glass liquid flex cursor-pointer items-center gap-4 rounded-2xl p-4">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Prescription preview" className="h-16 w-16 rounded-xl object-cover" />
      ) : (
        <span className="glass-strong grid h-16 w-16 place-items-center rounded-xl">
          <Camera className="h-6 w-6 text-accent" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{fileName ?? "Take or choose a photo"}</span>
        <span className="block text-xs text-muted">
          {fileName ? "Tap to change. You'll send it to us on WhatsApp with your order." : "A clear photo of your prescription slip"}
        </span>
      </span>
      <input
        type="file"
        accept="image/*,application/pdf"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          onFile(f.name);
          setPreview(f.type.startsWith("image/") ? URL.createObjectURL(f) : null);
        }}
      />
    </label>
  );
}
