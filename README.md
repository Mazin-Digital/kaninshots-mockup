# Kanin homepage mockups

Working HTML mockups of two proposed changes to the kaninshot.com homepage, for client review.

| Page | What it shows |
| --- | --- |
| `index.html` | Landing page linking to both mockups |
| `flavor-section.html` | "Pick Your Favorite Flavor" with all three bottles visible; each bottle (and list row) links to its product page |
| `bundle-builder.html` | The header-popup "Build Your Custom Bundle" builder placed inline on the homepage, so customers can mix flavors (e.g. 1 Napa Blast + 1 Cherry On Top) |

All images are stored in `images/`, so the pages don't depend on the live store's CDN. Only the Google Fonts load from the web.

## Viewing

- **Live:** published with GitHub Pages from the `main` branch, root folder.
- **Locally:** open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Notes for the Shopify build

- The bundle builder reuses the popup's markup, styles and logic with a `_bundleinline` class suffix and section-scoped selectors, so it can sit on the same page as the existing popup.
- In the mockup, "Add Bundle To cart" is simulated. When `window.Shopify` exists, it posts each flavor as its own line item to `/cart/add.js`, the same way the popup does. The 20% / 30% shown is calculated on the page only, so confirm the store's automatic discount also applies to mixed-flavor carts.
- The live site references the "Nunito Sans" and "Bricolage Grotesque" fonts but never loads them. The mockups load Nunito Sans from Google Fonts, and the theme should load it too.
- Pages carry `noindex` so search engines don't list a copy of the client's site.
