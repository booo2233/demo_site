// Product catalogue. To add a frame, copy an entry and give it a NEW sku.
// The sku is printed into the frame's QR code (/p/<sku>/), so never reuse or
// change the sku of a frame that already has a printed label.

export type Category =
  | "eyeglasses"
  | "sunglasses"
  | "rx-sunglasses"
  | "computer"
  | "kids"
  | "sports";

export type Shape =
  | "round"
  | "oval"
  | "rectangle"
  | "square"
  | "wayfarer"
  | "cat-eye"
  | "aviator"
  | "browline"
  | "hexagon"
  | "sport";

export type Gender = "men" | "women" | "unisex" | "kids";

export type Colorway = {
  name: string;
  frame: string; // frame colour (hex)
  lens: string; // lens tint (hex)
  lensOpacity: number; // 0.15 clear … 0.9 dark sunglass
};

export type Product = {
  sku: string;
  name: string;
  category: Category;
  shape: Shape;
  gender: Gender;
  material: string;
  price: number; // ₹, frame + standard lenses
  mrp?: number; // ₹, shown struck through when higher than price
  colors: Colorway[];
  size: { lens: number; bridge: number; temple: number }; // mm
  weight: number; // grams
  lensKind: "optical" | "sun";
  polarised?: boolean;
  blueCut?: boolean;
  badge?: "Bestseller" | "New" | "Limited";
  images?: string[]; // paths under /public, first one is the main photo
  description: string;
  highlights: string[];
};

export const categories: { id: Category; label: string; blurb: string }[] = [
  { id: "eyeglasses", label: "Eyeglasses", blurb: "Everyday frames, any power" },
  { id: "sunglasses", label: "Sunglasses", blurb: "UV400 shades for Indian sun" },
  { id: "rx-sunglasses", label: "Prescription Sunglasses", blurb: "Your power, tinted" },
  { id: "computer", label: "Computer Glasses", blurb: "Blue-cut for screen time" },
  { id: "kids", label: "Kids", blurb: "Flexible, near-unbreakable" },
  { id: "sports", label: "Sports", blurb: "Wraparound, grippy, light" },
];

export const shapes: { id: Shape; label: string }[] = [
  { id: "round", label: "Round" },
  { id: "oval", label: "Oval" },
  { id: "rectangle", label: "Rectangle" },
  { id: "square", label: "Square" },
  { id: "wayfarer", label: "Wayfarer" },
  { id: "cat-eye", label: "Cat-eye" },
  { id: "aviator", label: "Aviator" },
  { id: "browline", label: "Clubmaster" },
  { id: "hexagon", label: "Hexagon" },
  { id: "sport", label: "Sport wrap" },
];

const CLEAR = { lens: "#e8eef2", lensOpacity: 0.22 };
const P = (name: string) => `/images/p/${name}.webp`;

export const products: Product[] = [
  {
    sku: "LA-1001",
    name: "Halo Round",
    category: "eyeglasses",
    shape: "round",
    gender: "unisex",
    material: "Stainless steel",
    price: 2499,
    mrp: 3299,
    colors: [
      { name: "Gold", frame: "#c9a24a", ...CLEAR },
      { name: "Silver", frame: "#b7bac0", ...CLEAR },
      { name: "Gunmetal", frame: "#4b4f57", ...CLEAR },
    ],
    size: { lens: 49, bridge: 21, temple: 145 },
    weight: 14,
    lensKind: "optical",
    badge: "Bestseller",
    images: ["/images/gold-round-cream.webp", "/images/gold-round-black.webp", P("silver-round-paper")],
    description:
      "A fine metal round with a keyhole bridge and adjustable nose pads. Light enough to forget, classic enough for any face.",
    highlights: ["Adjustable silicone nose pads", "Spring hinges", "Fits most face sizes"],
  },
  {
    sku: "LA-1002",
    name: "Metro Rectangle",
    category: "eyeglasses",
    shape: "rectangle",
    gender: "men",
    material: "Italian acetate",
    price: 1899,
    mrp: 2499,
    colors: [
      { name: "Gloss black", frame: "#16130f", ...CLEAR },
      { name: "Tortoise", frame: "#6b3e1f", ...CLEAR },
      { name: "Navy", frame: "#1f2f55", ...CLEAR },
    ],
    size: { lens: 54, bridge: 18, temple: 145 },
    weight: 22,
    lensKind: "optical",
    images: ["/images/black-wayfarer.webp", P("black-rect-top")],
    description:
      "A clean, confident rectangle for the office and beyond. Hand-polished acetate that keeps its shine.",
    highlights: ["Hand-polished acetate", "5-barrel hinges", "Suits round and oval faces"],
  },
  {
    sku: "LA-1003",
    name: "Muse Cat-Eye",
    category: "eyeglasses",
    shape: "cat-eye",
    gender: "women",
    material: "Italian acetate",
    price: 2799,
    colors: [
      { name: "Black", frame: "#141416", ...CLEAR },
      { name: "Tortoise", frame: "#6b3e1f", ...CLEAR },
    ],
    size: { lens: 52, bridge: 17, temple: 140 },
    weight: 20,
    lensKind: "optical",
    badge: "New",
    images: [P("cateye-clipon")],
    description:
      "A softly lifted cat-eye with a magnetic sun clip. Clear specs at your desk, shades the moment you step outside.",
    highlights: ["Magnetic sun clip included", "Polarised clip, UV400", "Suits heart and square faces"],
  },
  {
    sku: "LA-1004",
    name: "Atlas Square",
    category: "eyeglasses",
    shape: "square",
    gender: "unisex",
    material: "TR90 (flexible)",
    price: 1599,
    mrp: 1999,
    colors: [
      { name: "Black / Crystal", frame: "#1d1d1f", ...CLEAR },
      { name: "All black", frame: "#0f0f10", ...CLEAR },
    ],
    size: { lens: 52, bridge: 19, temple: 145 },
    weight: 15,
    lensKind: "optical",
    images: [P("square-twotone")],
    description:
      "A bold two-tone square in flexible TR90 that bends instead of breaking. Built for everyday wear and tear.",
    highlights: ["Bends without breaking", "Only 15 g", "Suits oval and round faces"],
  },
  {
    sku: "LA-1005",
    name: "Lumen Hexa",
    category: "eyeglasses",
    shape: "hexagon",
    gender: "unisex",
    material: "Pure titanium",
    price: 4499,
    mrp: 5499,
    colors: [
      { name: "Champagne", frame: "#b9925a", ...CLEAR },
      { name: "Silver", frame: "#a7abb2", ...CLEAR },
    ],
    size: { lens: 50, bridge: 20, temple: 145 },
    weight: 11,
    lensKind: "optical",
    badge: "Limited",
    images: [P("hexa-gold")],
    description:
      "A six-sided titanium frame: featherlight, hypoallergenic and rust-proof. A statement you can wear all day.",
    highlights: ["Pure titanium, hypoallergenic", "Only 11 g", "Rust- and sweat-proof"],
  },
  {
    sku: "LA-1006",
    name: "Penny Panto",
    category: "eyeglasses",
    shape: "round",
    gender: "unisex",
    material: "Italian acetate",
    price: 2199,
    colors: [
      { name: "Black fade", frame: "#16130f", ...CLEAR },
      { name: "Honey", frame: "#b5772f", ...CLEAR },
    ],
    size: { lens: 48, bridge: 21, temple: 145 },
    weight: 19,
    lensKind: "optical",
    images: [P("panto-black")],
    description: "A soft panto shape with a keyhole bridge, fading from black to crystal at the bottom of the rim.",
    highlights: ["Gradient acetate", "Keyhole bridge", "Suits square and heart faces"],
  },
  {
    sku: "LA-2001",
    name: "Skyline Navigator",
    category: "sunglasses",
    shape: "aviator",
    gender: "men",
    material: "Metal",
    price: 3299,
    mrp: 3999,
    colors: [
      { name: "Gold / Brown gradient", frame: "#c9a24a", lens: "#5a3b22", lensOpacity: 0.8 },
      { name: "Silver / Grey", frame: "#a7abb2", lens: "#2a2a2c", lensOpacity: 0.85 },
    ],
    size: { lens: 58, bridge: 15, temple: 140 },
    weight: 26,
    lensKind: "sun",
    polarised: true,
    badge: "Bestseller",
    images: [P("navigator-gold")],
    description:
      "A squared-off pilot frame with a double bridge and polarised gradient lenses that cut glare off roads and water.",
    highlights: ["Polarised, UV400", "Half-rim double bridge", "Glare-free driving"],
  },
  {
    sku: "LA-2002",
    name: "Coast Square",
    category: "sunglasses",
    shape: "square",
    gender: "unisex",
    material: "Acetate + metal",
    price: 2499,
    colors: [
      { name: "Black / Grey", frame: "#141416", lens: "#2a2a2c", lensOpacity: 0.9 },
      { name: "Midnight / Green", frame: "#1c2238", lens: "#2f3a26", lensOpacity: 0.88 },
    ],
    size: { lens: 55, bridge: 18, temple: 145 },
    weight: 27,
    lensKind: "sun",
    images: [P("square-sun-peach"), P("square-sun-stairs")],
    description: "An easy, oversized square with full UV400 protection. Looks good on almost everyone.",
    highlights: ["UV400 protection", "Scratch-resistant lenses", "Suits almost every face"],
  },
  {
    sku: "LA-2003",
    name: "Riviera Cat-Eye",
    category: "sunglasses",
    shape: "cat-eye",
    gender: "women",
    material: "Acetate",
    price: 2999,
    colors: [
      { name: "Black-gold / Grey", frame: "#141416", lens: "#2a2a2c", lensOpacity: 0.88 },
      { name: "Champagne / Brown", frame: "#cdb08a", lens: "#6b4a2e", lensOpacity: 0.7 },
      { name: "Black / Rose", frame: "#141416", lens: "#c98f86", lensOpacity: 0.65 },
    ],
    size: { lens: 55, bridge: 17, temple: 140 },
    weight: 24,
    lensKind: "sun",
    badge: "New",
    images: [P("cateye-sun-beach"), P("cateye-sun-concrete"), P("cateye-sun-pink")],
    description: "A dramatic, holiday-ready cat-eye in three moods: classic black, champagne and rose.",
    highlights: ["Gradient lenses", "UV400 protection", "Suits oval and heart faces"],
  },
  {
    sku: "LA-2004",
    name: "Monsoon Round",
    category: "sunglasses",
    shape: "round",
    gender: "unisex",
    material: "Metal",
    price: 2199,
    colors: [
      { name: "Gold / Amber", frame: "#c9a24a", lens: "#e0a830", lensOpacity: 0.55 },
      { name: "Silver / Brown gradient", frame: "#b7bac0", lens: "#5a3b22", lensOpacity: 0.78 },
    ],
    size: { lens: 50, bridge: 21, temple: 145 },
    weight: 18,
    lensKind: "sun",
    images: ["/images/yellow-round.webp", P("round-sun-side")],
    description: "A retro metal round with warm tinted lenses. Brightens grey monsoon days, softens harsh summer ones.",
    highlights: ["UV400 protection", "Adjustable nose pads", "Lightweight metal"],
  },
  {
    sku: "LA-3001",
    name: "Drive Rx Aviator",
    category: "rx-sunglasses",
    shape: "aviator",
    gender: "unisex",
    material: "Metal",
    price: 4999,
    mrp: 5999,
    colors: [
      { name: "Gold / G15 green", frame: "#c9a24a", lens: "#2f3a26", lensOpacity: 0.85 },
      { name: "Gunmetal / Grey", frame: "#4b4f57", lens: "#2a2a2c", lensOpacity: 0.85 },
    ],
    size: { lens: 58, bridge: 14, temple: 140 },
    weight: 25,
    lensKind: "sun",
    polarised: true,
    badge: "Bestseller",
    images: [P("aviator-gold")],
    description:
      "Aviators made with your exact power and a polarised tint. No more swapping specs and shades on the highway.",
    highlights: ["Made to your prescription", "Polarised, UV400", "Ideal for driving"],
  },
  {
    sku: "LA-3002",
    name: "Sunset Rx Round",
    category: "rx-sunglasses",
    shape: "round",
    gender: "unisex",
    material: "Acetate",
    price: 4499,
    colors: [
      { name: "Tortoise / Grey", frame: "#5b3a1f", lens: "#2a2a2c", lensOpacity: 0.85 },
      { name: "Black / Green", frame: "#141416", lens: "#2f3a26", lensOpacity: 0.85 },
    ],
    size: { lens: 49, bridge: 21, temple: 145 },
    weight: 26,
    lensKind: "sun",
    images: [P("round-sun-tortoise")],
    description: "A tortoiseshell round with prescription tinted lenses, from −8.00 to +6.00.",
    highlights: ["Power from −8.00 to +6.00", "UV400 protection", "Optional polarisation"],
  },
  {
    sku: "LA-3003",
    name: "Clubline Rx",
    category: "rx-sunglasses",
    shape: "browline",
    gender: "men",
    material: "Acetate + metal",
    price: 5299,
    colors: [
      { name: "Black-silver / Grey", frame: "#1d1d1f", lens: "#2a2a2c", lensOpacity: 0.8 },
      { name: "Tortoise-gold / Blue mirror", frame: "#3a2a1c", lens: "#2c6d83", lensOpacity: 0.75 },
    ],
    size: { lens: 51, bridge: 21, temple: 145 },
    weight: 24,
    lensKind: "sun",
    images: [P("clubmaster-front"), P("clubmaster-side")],
    description: "A sharp browline with prescription tinted lenses. Smart enough for meetings, tinted enough for the drive home.",
    highlights: ["Made to your prescription", "Metal bottom rim", "UV400 protection"],
  },
  {
    sku: "LA-3004",
    name: "Aura Tint",
    category: "rx-sunglasses",
    shape: "rectangle",
    gender: "women",
    material: "Pure titanium",
    price: 5499,
    colors: [
      { name: "Gold / Mocha tint", frame: "#c9a24a", lens: "#6e5546", lensOpacity: 0.55 },
      { name: "Silver / Grey tint", frame: "#b7bac0", lens: "#3c3c40", lensOpacity: 0.5 },
    ],
    size: { lens: 53, bridge: 17, temple: 140 },
    weight: 13,
    lensKind: "sun",
    badge: "New",
    images: ["/images/hero-model.webp"],
    description:
      "Our signature: a fine titanium rectangle with a soft, see-through tint. Light enough for indoors, dark enough for the drive.",
    highlights: ["Made to your prescription", "Light 50% tint, UV400", "Only 13 g"],
  },
  {
    sku: "LA-4001",
    name: "Focus Blue",
    category: "computer",
    shape: "rectangle",
    gender: "unisex",
    material: "TR90 (flexible)",
    price: 1499,
    mrp: 1999,
    colors: [
      { name: "Crystal", frame: "#c8ccd2", lens: "#d6e6ff", lensOpacity: 0.3 },
      { name: "Black", frame: "#1d1d1f", lens: "#d6e6ff", lensOpacity: 0.3 },
    ],
    size: { lens: 53, bridge: 18, temple: 145 },
    weight: 14,
    lensKind: "optical",
    blueCut: true,
    badge: "Bestseller",
    images: [P("eye-chart")],
    description: "Blue-cut lenses included. Less eye strain on long laptop and phone days, with or without power.",
    highlights: ["Blue-cut lenses included", "Anti-glare coating", "Zero power or prescription"],
  },
  {
    sku: "LA-4002",
    name: "Pixel Oval",
    category: "computer",
    shape: "oval",
    gender: "women",
    material: "Acetate",
    price: 1299,
    colors: [
      { name: "Lilac", frame: "#a99ad6", lens: "#d6e6ff", lensOpacity: 0.3 },
      { name: "Tortoise", frame: "#6b3e1f", lens: "#d6e6ff", lensOpacity: 0.3 },
    ],
    size: { lens: 50, bridge: 18, temple: 140 },
    weight: 17,
    lensKind: "optical",
    blueCut: true,
    description: "A soft oval in fun colours with blue-cut lenses for screen-heavy days.",
    highlights: ["Blue-cut lenses included", "Lightweight acetate", "Suits square faces"],
  },
  {
    sku: "LA-5001",
    name: "Tiny Explorer",
    category: "kids",
    shape: "round",
    gender: "kids",
    material: "Silicone (flexible)",
    price: 1199,
    colors: [
      { name: "Sky blue", frame: "#4aa3df", ...CLEAR },
      { name: "Bubblegum", frame: "#ef7fb0", ...CLEAR },
      { name: "Lime", frame: "#8cc63f", ...CLEAR },
    ],
    size: { lens: 44, bridge: 16, temple: 125 },
    weight: 10,
    lensKind: "optical",
    description: "Soft, bendy, near-unbreakable silicone with a head strap for active kids aged 3–8.",
    highlights: ["Bends 180° without breaking", "Includes sports strap", "Ages 3–8"],
  },
  {
    sku: "LA-5002",
    name: "Junior Round",
    category: "kids",
    shape: "round",
    gender: "kids",
    material: "TR90 (flexible)",
    price: 999,
    colors: [
      { name: "Black", frame: "#16130f", ...CLEAR },
      { name: "Red", frame: "#d0342c", ...CLEAR },
    ],
    size: { lens: 42, bridge: 17, temple: 130 },
    weight: 12,
    lensKind: "optical",
    images: [P("round-black-small")],
    description: "A small, sturdy round in tough TR90, sized for kids aged 6–12.",
    highlights: ["Flexible TR90", "Spring hinges", "Ages 6–12"],
  },
  {
    sku: "LA-6001",
    name: "Velocity Shield",
    category: "sports",
    shape: "sport",
    gender: "unisex",
    material: "Polycarbonate",
    price: 3499,
    colors: [
      { name: "Black / Fire mirror", frame: "#1d1d1f", lens: "#b4461f", lensOpacity: 0.8 },
      { name: "White / Ice mirror", frame: "#f2f2f2", lens: "#3e7fb8", lensOpacity: 0.78 },
    ],
    size: { lens: 140, bridge: 16, temple: 130 },
    weight: 23,
    lensKind: "sun",
    polarised: true,
    images: [P("sport-shield-worn")],
    description: "A one-piece shield for cycling and running, with rubber grips that stay put when you sweat.",
    highlights: ["Polarised, UV400", "Rubber nose and temple grips", "Impact-resistant"],
  },
  {
    sku: "LA-6002",
    name: "Trail Wrap",
    category: "sports",
    shape: "sport",
    gender: "unisex",
    material: "TR90 (flexible)",
    price: 2799,
    colors: [
      { name: "Matte black / Smoke", frame: "#1d1d1f", lens: "#2a2a2c", lensOpacity: 0.88 },
      { name: "Olive / Smoke", frame: "#4d5b3a", lens: "#2a2a2c", lensOpacity: 0.85 },
    ],
    size: { lens: 62, bridge: 17, temple: 130 },
    weight: 21,
    lensKind: "sun",
    images: [P("sport-wrap-angle"), P("sport-wrap-front")],
    description: "A light, flexible half-rim wrap for treks and weekend rides. Prescription inserts available.",
    highlights: ["UV400 protection", "Flexible TR90", "Prescription inserts available"],
  },
];

export function getProduct(sku: string) {
  return products.find((p) => p.sku.toLowerCase() === sku.toLowerCase());
}

export function categoryLabel(id: Category) {
  return categories.find((c) => c.id === id)?.label ?? id;
}

export function shapeLabel(id: Shape) {
  return shapes.find((s) => s.id === id)?.label ?? id;
}
