import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderView } from "./OrderView";

export const metadata: Metadata = { title: "Order placed" };

export default function OrderPage() {
  return (
    <Suspense>
      <OrderView />
    </Suspense>
  );
}
