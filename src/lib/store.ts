// Shop details. Opening hours and the WhatsApp number still need confirming
// with the client before going live.
export const store = {
  name: "Lens Aura",
  tagline: "See better. Look better.",
  address: "Edachira Junction, Kakkanad, Kochi, Kerala",
  mapsQuery: "Edachira Junction Kakkanad Kochi",
  phone: "+91 94962 56378",
  instagram: "lensauraopticals",
  opening: "Grand opening · November 2026",
  // WhatsApp number with country code and no "+" (e.g. "919496256378").
  // Left empty for the demo, so test orders open WhatsApp's own "choose a
  // chat" screen instead of messaging the shop.
  whatsapp: "",
  hours: [
    { days: "Mon – Sat", time: "10:00 am – 9:00 pm" },
    { days: "Sunday", time: "11:00 am – 7:00 pm" },
  ],
};

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Path to a file in /public, including the GitHub Pages base path. */
export const asset = (path: string) => `${basePath}${path}`;

export function whatsappLink(text: string) {
  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** Absolute URL of a page on this site, as seen by the current browser. */
export function siteUrl(path: string) {
  if (typeof window === "undefined") return `${basePath}${path}`;
  return `${window.location.origin}${basePath}${path}`;
}
