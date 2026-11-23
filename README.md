# suyaexclusive.com

Simple static site for Suya Exclusive — order by phone (individual + catering), orders taken Saturday–Tuesday.
No build step: plain HTML/CSS/JS, hosted on Cloudflare Pages.

## Edit the basics
- **Phone number / order days:** top of `assets/main.js` (`SITE` object). Every call/text button updates from there.
- **Menu & prices:** the `#menu` section in `index.html`.
- **Catering text:** the `#catering` section in `index.html`.

## Deploy (Cloudflare Pages)
1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick this repo.
2. Framework preset: **None**. Build command: *(empty)*. Output directory: `/`.
3. Every push to `main` redeploys automatically.

## Domain (Namecheap → Cloudflare)
1. Cloudflare → Add a domain → `suyaexclusive.com` (Free plan).
2. Namecheap → Domain List → Manage → Nameservers → Custom DNS → paste Cloudflare's two nameservers.
3. Pages project → Custom domains → add `www.suyaexclusive.com` and `suyaexclusive.com`.
4. Optional: Rules → Redirect Rules → redirect `suyaexclusive.com/*` → `https://www.suyaexclusive.com/${1}` (301).

## Shipping notifications
- **/ship** — owner helper (not linked, noindex). Enter customer name, phone, tracking number → sends the "your order shipped" message via WhatsApp or SMS. Add it to your phone's home screen.
- **/track?n=TRACKING&c=ups|usps|fedex** — customer-facing tracking page. Auto-detects the carrier if `c` is omitted. Nothing is stored.
