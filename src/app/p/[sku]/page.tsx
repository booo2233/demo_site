import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, products } from "@/data/products";
import { ProductView } from "./ProductView";

// /p/<sku>/ is the permanent address printed into each frame's QR code.
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ sku: p.sku }));
}

export async function generateMetadata(props: PageProps<"/p/[sku]">): Promise<Metadata> {
  const { sku } = await props.params;
  const p = getProduct(sku);
  return p ? { title: p.name, description: p.description } : {};
}

export default async function ProductPage(props: PageProps<"/p/[sku]">) {
  const { sku } = await props.params;
  const p = getProduct(sku);
  if (!p) notFound();

  const related = products
    .filter((r) => r.sku !== p.sku && (r.category === p.category || r.shape === p.shape))
    .slice(0, 4);

  return (
    <>
      <ProductView product={p} />
      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-6xl px-4">
          <h2 className="text-2xl">You may also like</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {related.map((r) => (
              <ProductCard key={r.sku} product={r} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
