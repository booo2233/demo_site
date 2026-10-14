import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopView } from "./ShopView";

export const metadata: Metadata = { title: "Shop frames" };

export default function ShopPage() {
  return (
    <Suspense>
      <ShopView />
    </Suspense>
  );
}
