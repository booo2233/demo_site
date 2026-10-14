import type { Metadata } from "next";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { store } from "@/lib/store";
import { BookTest } from "./BookTest";

export const metadata: Metadata = { title: "Visit the store" };

export default function VisitPage() {
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapsQuery)}`;
  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <span className="eyebrow">{store.opening}</span>
      <h1 className="mt-1 text-3xl md:text-5xl">Come try them on.</h1>
      <p className="mt-2 max-w-lg text-muted">
        Find us at Edachira Junction, Kakkanad. Scan any frame&apos;s tag, try it on, and get your eyes
        tested while you&apos;re here. Opening offers on selected frames and lenses.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="glass rounded-[2rem] p-5 md:p-7">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <div className="font-semibold">{store.name}</div>
                <p className="text-sm text-muted">{store.address}</p>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <dl className="flex-1 space-y-1 text-sm">
                {store.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-3">
                    <dt className="text-muted">{h.days}</dt>
                    <dd className="font-medium">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={maps} target="_blank" rel="noreferrer" className="btn btn-primary flex-1">
                <Navigation className="h-4 w-4" /> Directions
              </a>
              <a href={`tel:${store.phone.replace(/\s/g, "")}`} className="btn glass liquid flex-1">
                <Phone className="h-4 w-4" /> Call
              </a>
            </div>
          </div>

          <div className="glass rounded-[2rem] p-5 md:p-7">
            <div className="font-semibold">In the store</div>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted">
              {["Eye testing", "Designer frames", "Precision lenses", "Premium sunglasses", "Prescription sunglasses", "Frame fitting"].map(
                (s) => (
                  <li key={s} className="glass-strong rounded-xl px-3 py-2">
                    {s}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <BookTest />
      </div>
    </div>
  );
}
