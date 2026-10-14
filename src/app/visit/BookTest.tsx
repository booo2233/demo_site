"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { store, whatsappLink } from "@/lib/store";

const slots = ["10:30 am", "12:00 pm", "2:00 pm", "4:00 pm", "6:00 pm", "7:30 pm"];

function nextDays(n: number) {
  const fmt = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" });
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return { key: d.toDateString(), label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : fmt.format(d), full: fmt.format(d) };
  });
}

export function BookTest() {
  const [days] = useState(() => nextDays(7));
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slot) return;
    window.open(
      whatsappLink(
        `Hi ${store.name}! I'd like to book a free eye test on ${days[day].full} at ${slot}.\nName: ${name}\nPhone: ${phone}`,
      ),
      "_blank",
      "noopener",
    );
  };

  return (
    <form onSubmit={submit} className="glass rounded-[2rem] p-5 md:p-7">
      <h2 className="text-xl">Book a free eye test</h2>
      <p className="mt-1 text-sm text-muted">15 minutes with our optometrist. No purchase needed.</p>

      <div className="eyebrow mt-5 mb-2">Day</div>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:-mx-7 md:px-7">
        {days.map((d, i) => (
          <button
            key={d.key}
            type="button"
            className="chip glass liquid"
            aria-pressed={day === i}
            onClick={() => setDay(i)}
            suppressHydrationWarning
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="eyebrow mt-5 mb-2">Time</div>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((s) => (
          <button
            key={s}
            type="button"
            className="chip glass liquid justify-center"
            aria-pressed={slot === s}
            onClick={() => setSlot(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input required className="field" placeholder="Your name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        <input
          required
          className="field"
          type="tel"
          inputMode="numeric"
          pattern="[6-9][0-9]{9}"
          title="10-digit Indian mobile number"
          placeholder="Mobile number"
          autoComplete="tel-national"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <button type="submit" disabled={!slot} className="btn btn-primary mt-5 w-full">
        <CalendarCheck className="h-4 w-4" /> {slot ? `Book ${days[day].label.toLowerCase()} at ${slot}` : "Pick a time"}
      </button>
      <p className="mt-2 text-center text-xs text-muted">Confirms on WhatsApp</p>
    </form>
  );
}
