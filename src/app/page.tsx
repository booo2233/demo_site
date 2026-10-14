import Link from "next/link";
import { ArrowRight, Eye, Glasses, Monitor, QrCode, ScanLine, Sparkles, Sun, SunDim, Truck } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Photo } from "@/components/ProductImage";
import { categories, products, type Category } from "@/data/products";
import { store } from "@/lib/store";

const categoryPhoto: Record<Category, string> = {
  eyeglasses: "/images/gold-round-cream.webp",
  sunglasses: "/images/p/shelf-sunglasses.webp",
  "rx-sunglasses": "/images/p/aviator-gold.webp",
  computer: "/images/p/eye-chart.webp",
  kids: "/images/p/kids-playful.webp",
  sports: "/images/p/sport-shield-worn.webp",
};

const lensTech = [
  { icon: Sun, title: "Polarised", body: "Cuts harsh glare off roads, water and glass. Made for the Kerala sun." },
  { icon: Monitor, title: "Blue-cut", body: "Filters blue light from screens to ease eye strain on long workdays." },
  { icon: SunDim, title: "Photochromic", body: "Clear indoors, tinted outdoors. One pair for the whole day." },
  { icon: Eye, title: "Progressive", body: "Near, middle and far vision in a single, line-free lens." },
];

const posters = [1, 2, 3, 4, 5].map((n) => `/images/poster-${n}.webp`);

export default function Home() {
  const featured = products.filter((p) => p.badge && p.images?.length);

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Opening announcement */}
      <div className="fade-up mt-4 flex justify-center">
        <Link href="/visit/" className="glass liquid inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium sm:text-sm">
          <Sparkles className="h-4 w-4 text-accent" />
          <span>
            <span className="font-semibold">{store.opening}</span>
            <span className="hidden text-muted sm:inline"> · Opening offers on selected frames &amp; lenses</span>
          </span>
          <ArrowRight className="h-3.5 w-3.5 text-muted" />
        </Link>
      </div>

      {/* Hero */}
      <section className="grid items-center gap-8 pt-8 pb-4 md:grid-cols-[1fr_1.05fr] md:gap-12 md:pt-12">
        <div className="fade-up">
          <span className="eyebrow">Eyewear · Boutique · Kakkanad</span>
          <h1 className="mt-4 text-[3.1rem] leading-[1.02] md:text-7xl">
            See better.
            <br />
            <em className="text-accent">Look better.</em>
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            Eye testing, designer frames, precision lenses and premium sunglasses, including sunglasses
            made to your prescription.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/shop/" className="btn btn-primary">
              Explore the collection <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/visit/" className="btn glass liquid">
              Book a free eye test
            </Link>
          </div>
        </div>

        <div className="fade-up relative" style={{ animationDelay: "120ms" }}>
          <div className="glass overflow-hidden rounded-[2.5rem] p-2">
            <div className="aspect-[4/4.2] overflow-hidden rounded-[2rem]">
              <Photo src="/images/hero-model.webp" alt="Model wearing the Aura Tint titanium sunglasses" eager />
            </div>
          </div>
          <Link
            href="/p/LA-3004/"
            className="glass glass-strong liquid absolute right-5 bottom-5 left-5 flex items-center justify-between rounded-[1.4rem] px-4 py-3 md:right-auto md:-left-8 md:w-72"
          >
            <div>
              <div className="text-xs text-muted">Prescription sunglasses</div>
              <div className="font-semibold">Aura Tint · ₹5,499</div>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-bg">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          <span className="glass glass-strong absolute top-5 right-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold">
            <ScanLine className="h-3.5 w-3.5 text-accent" /> Scan · See · Try
          </span>
        </div>
      </section>

      {/* How the QR codes work */}
      <section className="mt-10">
        <div className="glass grid gap-5 rounded-[2rem] p-6 md:grid-cols-3 md:p-8">
          {[
            { icon: QrCode, title: "Scan the tag", body: "Every frame on our shelves has its own QR code." },
            { icon: Glasses, title: "See every detail", body: "Photos, size, material, colours, lenses and price." },
            { icon: Truck, title: "Order in minutes", body: "Add your power, then collect in store or get it delivered." },
          ].map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="flex gap-4">
              <span className="glass glass-strong grid h-11 w-11 shrink-0 place-items-center rounded-2xl">
                <Icon className="h-5 w-5 text-accent" />
              </span>
              <div>
                <div className="font-semibold">
                  <span className="text-faint">{i + 1}.</span> {title}
                </div>
                <p className="text-sm text-muted">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mt-16">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl md:text-4xl">Shop by category</h2>
          <Link href="/shop/" className="text-sm font-medium text-accent">
            See all
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop/?c=${c.id}`}
              className="glass liquid group relative block overflow-hidden rounded-[1.75rem] p-1.5"
            >
              <div className="aspect-[4/3.4] overflow-hidden rounded-[1.4rem]">
                <Photo
                  src={categoryPhoto[c.id]}
                  alt=""
                  className="transition-transform duration-700 ease-spring group-hover:scale-105"
                />
              </div>
              <div className="glass glass-strong absolute right-3 bottom-3 left-3 rounded-2xl px-3.5 py-2.5">
                <div className="text-sm leading-tight font-semibold md:text-base">{c.label}</div>
                <div className="hidden text-xs text-muted sm:block">{c.blurb}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mt-16">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl md:text-4xl">Loved right now</h2>
          <Link href="/shop/" className="text-sm font-medium text-accent">
            Shop all
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 md:gap-4">
          {featured.map((p) => (
            <ProductCard key={p.sku} product={p} className="w-[64%] shrink-0 snap-start sm:w-[40%] md:w-[23%]" />
          ))}
        </div>
      </section>

      {/* Campaign */}
      <section className="mt-12">
        <span className="eyebrow">{store.opening}</span>
        <h2 className="mt-1 text-3xl md:text-4xl">Clarity has a new address.</h2>
        <div className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 md:gap-4">
          {posters.map((src, i) => (
            <div key={src} className="glass w-[70%] shrink-0 snap-start rounded-[1.75rem] p-1.5 sm:w-[42%] md:w-[30%]">
              <div className="aspect-[4/5] overflow-hidden rounded-[1.4rem]">
                <Photo src={src} alt={`Lens Aura grand opening poster ${i + 1}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lens technology */}
      <section className="mt-12">
        <h2 className="text-3xl md:text-4xl">Lenses, made for your eyes</h2>
        <p className="mt-2 max-w-xl text-muted">
          Choose your lenses on any frame. Every pair is checked by our optician before it is cut.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {lensTech.map(({ icon: Icon, title, body }) => (
            <div key={title} className="glass rounded-[1.75rem] p-5">
              <Icon className="h-6 w-6 text-accent" strokeWidth={1.8} />
              <div className="mt-3 font-semibold">{title}</div>
              <p className="mt-1 text-sm text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Visit */}
      <section className="mt-16">
        <div className="relative overflow-hidden rounded-[2.25rem]">
          <Photo src="/images/gold-round-black.webp" alt="" className="absolute inset-0" />
          <div className="relative grid gap-6 p-4 md:grid-cols-2 md:p-8">
            <div className="glass rounded-[1.75rem] p-6 md:p-8">
              <span className="eyebrow">Visit {store.name}</span>
              <h2 className="mt-2 text-3xl md:text-4xl">Free eye test, every day.</h2>
              <p className="mt-3 text-muted">
                Walk in or book a slot. Our optometrist checks your eyes in 15 minutes, then helps you
                choose frames that suit your face.
              </p>
              <p className="mt-4 text-sm font-medium">{store.address}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/visit/" className="btn btn-primary">
                  Book a slot
                </Link>
                <a href={`tel:${store.phone.replace(/\s/g, "")}`} className="btn glass liquid">
                  Call {store.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
