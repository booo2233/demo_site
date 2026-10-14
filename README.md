# Lens Aura — website demo

Eyewear boutique site for Lens Aura, Edachira Jn, Kakkanad. Phone-first, "Liquid Glass" design,
fully static (no backend) so it runs on GitHub Pages.

## How it works in the shop

- **Store QR** (poster at the counter) → opens the catalogue (`/shop/`).
- **Frame QR** (label next to each frame) → opens that frame's page (`/p/LA-1001/`).
  The code (`LA-1001`) is permanent, so printed labels keep working when prices or photos change.
- Print labels and the poster from **`/admin/qr/`**.
- The cart lives in the customer's browser; orders and eye-test bookings are sent as a pre-filled
  WhatsApp message.

## Editing content

| What | Where |
| --- | --- |
| Frames, prices, colours, photos | `src/data/products.ts` |
| Address, phone, hours, WhatsApp number | `src/lib/store.ts` |
| Lens options and prices | `src/lib/lenses.ts` |
| Photos | `public/images/` (stock photo credits in `public/images/CREDITS.md`) |

Never change or reuse a frame's `sku` once its label is printed. Add a new frame with a new code instead.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

## Deploy (GitHub Pages)

1. Push this folder to a GitHub repository (branch `main`).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` builds and publishes to `https://<user>.github.io/<repo>/`.

## Before going live

- Set `whatsapp` in `src/lib/store.ts` (empty in the demo so test orders don't reach the shop).
- Confirm opening hours.
- Replace the demo stock photos in `public/images/p/` with photos of the shop's own frames.
- Connect a payment gateway (e.g. Razorpay) if online payment is wanted. That needs a small backend
  or a hosted checkout link.
