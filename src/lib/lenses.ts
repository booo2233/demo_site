import type { Product } from "@/data/products";

export type Vision = "zero" | "single" | "progressive";
export type Thickness = "1.56" | "1.61" | "1.67";
export type RxMode = "enter" | "upload" | "later";

export type EyeRx = { sph: string; cyl: string; axis: string; add: string };
export type Prescription = { right: EyeRx; left: EyeRx; pd: string };

export type LensChoice = {
  vision: Vision;
  coating: string; // id from coatingOptions()
  thickness: Thickness;
  rxMode: RxMode;
  rx?: Prescription;
  rxFileName?: string;
};

type Option<T extends string> = { id: T; label: string; detail: string; price: number };

export function visionOptions(p: Product): Option<Vision>[] {
  const opts: Option<Vision>[] = [
    { id: "zero", label: "No power", detail: "Style or protection only", price: 0 },
    { id: "single", label: "Single vision", detail: "For distance or reading", price: 1000 },
    { id: "progressive", label: "Progressive", detail: "Near, mid and far in one lens", price: 3500 },
  ];
  return p.category === "kids" ? opts.slice(0, 2) : opts;
}

export function coatingOptions(p: Product): Option<string>[] {
  if (p.lensKind === "sun") {
    return [
      p.polarised
        ? { id: "polarised", label: "Polarised", detail: "Included with this frame", price: 0 }
        : { id: "tinted", label: "Tinted UV400", detail: "Full UV protection", price: 0 },
      ...(p.polarised
        ? []
        : [{ id: "polarised", label: "Polarised", detail: "Cuts glare off roads and water", price: 1200 }]),
      { id: "gradient", label: "Gradient tint", detail: "Dark at top, lighter below", price: 500 },
    ];
  }
  return [
    p.blueCut
      ? { id: "bluecut", label: "Blue-cut", detail: "Included with this frame", price: 0 }
      : { id: "antiglare", label: "Anti-glare clear", detail: "Reduces reflections", price: 0 },
    ...(p.blueCut
      ? []
      : [{ id: "bluecut", label: "Blue-cut", detail: "Less screen strain", price: 700 }]),
    { id: "photochromic", label: "Photochromic", detail: "Darkens in sunlight", price: 1500 },
  ];
}

export const thicknessOptions: Option<Thickness>[] = [
  { id: "1.56", label: "Standard", detail: "1.56 index, up to ±3.00", price: 0 },
  { id: "1.61", label: "Thin", detail: "1.61 index, up to ±6.00", price: 800 },
  { id: "1.67", label: "Ultra-thin", detail: "1.67 index, high power", price: 2000 },
];

export function defaultLens(p: Product): LensChoice {
  return {
    vision: "zero",
    coating: coatingOptions(p)[0].id,
    thickness: "1.56",
    rxMode: "later",
  };
}

export function lensPrice(p: Product, c: LensChoice) {
  const vision = visionOptions(p).find((o) => o.id === c.vision)?.price ?? 0;
  const coating = coatingOptions(p).find((o) => o.id === c.coating)?.price ?? 0;
  const thick =
    c.vision === "zero" ? 0 : (thicknessOptions.find((o) => o.id === c.thickness)?.price ?? 0);
  return vision + coating + thick;
}

export function describeLens(p: Product, c: LensChoice) {
  const parts = [
    visionOptions(p).find((o) => o.id === c.vision)?.label,
    coatingOptions(p).find((o) => o.id === c.coating)?.label,
  ];
  if (c.vision !== "zero") {
    parts.push(thicknessOptions.find((o) => o.id === c.thickness)?.label + " lens");
  }
  return parts.filter(Boolean).join(" · ");
}

export function describeRx(c: LensChoice) {
  if (c.vision === "zero") return null;
  if (c.rxMode === "upload") return `Prescription photo: ${c.rxFileName ?? "attached"}`;
  if (c.rxMode === "later" || !c.rx) return "Prescription: to be shared / eye test in store";
  const eye = (e: EyeRx) =>
    `SPH ${e.sph || "0"} CYL ${e.cyl || "0"} AXIS ${e.axis || "-"}${e.add ? ` ADD ${e.add}` : ""}`;
  return `R: ${eye(c.rx.right)} | L: ${eye(c.rx.left)} | PD ${c.rx.pd || "-"}`;
}

export const emptyRx = (): Prescription => ({
  right: { sph: "", cyl: "", axis: "", add: "" },
  left: { sph: "", cyl: "", axis: "", add: "" },
  pd: "",
});
