"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { categories, products, shapes, type Category, type Gender, type Shape } from "@/data/products";

const genders: { id: Gender; label: string }[] = [
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "unisex", label: "Unisex" },
  { id: "kids", label: "Kids" },
];

const sorts = [
  { id: "featured", label: "Featured" },
  { id: "low", label: "Price: low to high" },
  { id: "high", label: "Price: high to low" },
] as const;

type Sort = (typeof sorts)[number]["id"];

export function ShopView() {
  const params = useSearchParams();
  const router = useRouter();
  const fromUrl = params.get("c");
  const category = categories.some((c) => c.id === fromUrl) ? (fromUrl as Category) : null;

  const [query, setQuery] = useState("");
  const [shape, setShape] = useState<Shape | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [sort, setSort] = useState<Sort>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const setCategory = (c: Category | null) => {
    router.replace(c ? `/shop/?c=${c}` : "/shop/", { scroll: false });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!shape || p.shape === shape) &&
        (!gender || p.gender === gender || (gender !== "kids" && p.gender === "unisex")) &&
        (!q ||
          `${p.name} ${p.sku} ${p.material} ${p.shape} ${p.colors.map((c) => c.name).join(" ")}`
            .toLowerCase()
            .includes(q)),
    );
    if (sort === "low") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [category, shape, gender, sort, query]);

  const activeFilters = (shape ? 1 : 0) + (gender ? 1 : 0) + (sort !== "featured" ? 1 : 0);
  const title = categories.find((c) => c.id === category)?.label ?? "All frames";

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <h1 className="text-3xl md:text-4xl">{title}</h1>
      <p className="mt-1 text-muted">
        {results.length} {results.length === 1 ? "frame" : "frames"}
      </p>

      <div className="mt-5 flex gap-2">
        <label className="glass flex h-12 flex-1 items-center gap-2 rounded-full px-4">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search frames, colours or code (LA-2001)"
            className="w-full bg-transparent outline-none placeholder:text-faint"
            type="search"
            enterKeyHint="search"
          />
        </label>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="glass liquid relative grid h-12 w-12 place-items-center rounded-full"
          aria-expanded={showFilters}
          aria-label="Filters"
        >
          {showFilters ? <X className="h-5 w-5" /> : <SlidersHorizontal className="h-5 w-5" />}
          {activeFilters > 0 && !showFilters && (
            <span className="absolute -top-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-[11px] font-bold text-bg">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <button className="chip glass liquid" aria-pressed={!category} onClick={() => setCategory(null)}>
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className="chip glass liquid"
            aria-pressed={category === c.id}
            onClick={() => setCategory(category === c.id ? null : c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="glass fade-up mt-4 space-y-5 rounded-[1.75rem] p-5">
          <FilterRow label="Shape">
            {shapes.map((s) => (
              <button
                key={s.id}
                className="chip glass liquid"
                aria-pressed={shape === s.id}
                onClick={() => setShape(shape === s.id ? null : s.id)}
              >
                {s.label}
              </button>
            ))}
          </FilterRow>
          <FilterRow label="For">
            {genders.map((g) => (
              <button
                key={g.id}
                className="chip glass liquid"
                aria-pressed={gender === g.id}
                onClick={() => setGender(gender === g.id ? null : g.id)}
              >
                {g.label}
              </button>
            ))}
          </FilterRow>
          <FilterRow label="Sort">
            {sorts.map((s) => (
              <button
                key={s.id}
                className="chip glass liquid"
                aria-pressed={sort === s.id}
                onClick={() => setSort(s.id)}
              >
                {s.label}
              </button>
            ))}
          </FilterRow>
          {activeFilters > 0 && (
            <button
              className="text-sm font-medium text-accent"
              onClick={() => {
                setShape(null);
                setGender(null);
                setSort("featured");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {results.length ? (
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </div>
      ) : (
        <div className="glass mt-6 rounded-[1.75rem] p-10 text-center">
          <p className="font-semibold">No frames match</p>
          <p className="mt-1 text-sm text-muted">Try another search or clear the filters.</p>
        </div>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
