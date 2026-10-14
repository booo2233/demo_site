"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Banknote, Lock, Store, Truck, Wallet } from "lucide-react";
import { getProduct } from "@/data/products";
import { placeOrder, useCart, useHydrated, type Order } from "@/lib/cart";
import { formatINR } from "@/lib/format";

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Tamil Nadu",
  "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

type Customer = Order["customer"];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total } = useCart();
  const hydrated = useHydrated();
  const [delivery, setDelivery] = useState<Order["delivery"]>("pickup");
  const [payment, setPayment] = useState<Order["payment"]>("store");
  const [placed, setPlaced] = useState(false);
  const [c, setC] = useState<Customer>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "Kerala",
    pincode: "",
  });
  const set = (k: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setC({ ...c, [k]: e.target.value });

  if (!hydrated || placed) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-10 text-center">
        <p className="text-lg font-semibold">Nothing to check out yet</p>
        <Link href="/shop/" className="btn btn-primary mt-5">
          Browse frames
        </Link>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlaced(true);
    const order = placeOrder({ items, total, customer: c, delivery, payment });
    router.push(`/order/?id=${order.id}`);
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-4xl px-4 pt-6">
      <h1 className="text-3xl md:text-4xl">Checkout</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <Section title="Contact">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Full name">
                <input required className="field" autoComplete="name" value={c.name} onChange={set("name")} />
              </Field>
              <Field label="Mobile number">
                <input
                  required
                  className="field"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  pattern="[6-9][0-9]{9}"
                  title="10-digit Indian mobile number"
                  placeholder="98XXXXXXXX"
                  value={c.phone}
                  onChange={set("phone")}
                />
              </Field>
              <Field label="Email (optional)" wide>
                <input className="field" type="email" autoComplete="email" value={c.email} onChange={set("email")} />
              </Field>
            </div>
          </Section>

          <Section title="Delivery">
            <div className="grid gap-2 sm:grid-cols-2">
              <Choice
                checked={delivery === "pickup"}
                onClick={() => setDelivery("pickup")}
                icon={Store}
                title="Collect in store"
                detail="Free fitting and adjustment"
              />
              <Choice
                checked={delivery === "home"}
                onClick={() => setDelivery("home")}
                icon={Truck}
                title="Home delivery"
                detail="Free across India, 5–7 days"
              />
            </div>
            {delivery === "home" && (
              <div className="fade-up mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Address" wide>
                  <input
                    required
                    className="field"
                    autoComplete="street-address"
                    placeholder="House no., street, area"
                    value={c.address}
                    onChange={set("address")}
                  />
                </Field>
                <Field label="City">
                  <input required className="field" autoComplete="address-level2" value={c.city} onChange={set("city")} />
                </Field>
                <Field label="PIN code">
                  <input
                    required
                    className="field"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    pattern="[1-9][0-9]{5}"
                    title="6-digit PIN code"
                    value={c.pincode}
                    onChange={set("pincode")}
                  />
                </Field>
                <Field label="State" wide>
                  <select className="field appearance-none" value={c.state} onChange={set("state")}>
                    {STATES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
              </div>
            )}
          </Section>

          <Section title="Payment">
            <div className="grid gap-2 sm:grid-cols-3">
              <Choice
                checked={payment === "store"}
                onClick={() => setPayment("store")}
                icon={Store}
                title="Pay at store"
                detail="Cash, card or UPI"
              />
              <Choice
                checked={payment === "cod"}
                onClick={() => setPayment("cod")}
                icon={Banknote}
                title="Cash on delivery"
                detail="Pay when it arrives"
              />
              <Choice disabled icon={Wallet} title="UPI / Cards" detail="Coming soon" />
            </div>
          </Section>
        </div>

        <aside className="glass h-fit rounded-[1.75rem] p-5 md:sticky md:top-24">
          <h2 className="font-semibold">Order summary</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3">
                <span className="text-muted">
                  {getProduct(i.sku)?.name} × {i.qty}
                </span>
                <span>{formatINR(i.unitPrice * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-ink/8 pt-3 text-lg font-semibold">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
          <button type="submit" className="btn btn-primary mt-5 w-full">
            <Lock className="h-4 w-4" /> Place order
          </button>
          <p className="mt-3 text-center text-xs text-muted">
            We&apos;ll call to confirm your prescription before making your lenses.
          </p>
        </aside>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-[1.75rem] p-5">
      <h2 className="mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={`flex flex-col gap-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

function Choice({
  checked = false,
  disabled,
  onClick,
  icon: Icon,
  title,
  detail,
}: {
  checked?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  icon: typeof Store;
  title: string;
  detail: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      onClick={onClick}
      className={`liquid flex items-center gap-3 rounded-2xl p-3.5 text-left disabled:opacity-45 ${
        checked ? "glass glass-strong ring-2 ring-accent" : "glass"
      }`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${checked ? "text-accent" : "text-muted"}`} />
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-muted">{detail}</span>
      </span>
    </button>
  );
}
