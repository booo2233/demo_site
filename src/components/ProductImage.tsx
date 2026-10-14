/* eslint-disable @next/next/no-img-element -- static export serves images as-is */
import { FrameArt } from "@/components/FrameArt";
import type { Product } from "@/data/products";
import { asset } from "@/lib/store";

export function Photo({
  src,
  alt,
  className = "",
  eager,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <img
      src={asset(src)}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

/** The frame's main photo, or its illustration when it has no photos yet. */
export function ProductImage({ product: p, className = "" }: { product: Product; className?: string }) {
  if (p.images?.length) {
    return <Photo src={p.images[0]} alt={`${p.name} in ${p.colors[0].name}`} className={className} />;
  }
  return (
    <div className={`grid h-full w-full place-items-center dark:bg-[#ebe3d6] ${className}`}>
      <FrameArt shape={p.shape} color={p.colors[0]} material={p.material} className="w-[84%]" />
    </div>
  );
}
