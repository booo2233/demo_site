import type { Metadata } from "next";
import { QrSheet } from "./QrSheet";

export const metadata: Metadata = { title: "QR codes", robots: { index: false } };

export default function QrPage() {
  return <QrSheet />;
}
