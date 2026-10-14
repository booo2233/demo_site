import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Aurora, Footer, Header, TabBar } from "@/components/Shell";
import { store } from "@/lib/store";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: `${store.name} — Eyewear Boutique, Kakkanad`, template: `%s · ${store.name}` },
  description:
    "Eye testing, designer frames, lenses and prescription sunglasses at Edachira Junction, Kakkanad. Scan any frame's QR code in store to see every detail.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3eee6" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a09" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <body className="safe-bottom min-h-dvh">
        <Aurora />
        <Header />
        <main>{children}</main>
        <Footer />
        <TabBar />
      </body>
    </html>
  );
}
