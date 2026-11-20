# Kanin homepage mockups

Working HTML mockups of two proposed changes to the kaninshot.com homepage, for client review.

| Page | What it shows |
| --- | --- |
| `index.html` | **The presentation.** The live homepage as a muted grey, non-interactive backdrop (screenshots), with both new sections working in full color in their real spots. Desktop / Mobile switch in the top right; `?view=mobile` opens straight to the phone view |
| `flavor-section.html` | The "Pick Your Favorite Flavor" section on its own: all three bottles visible, each linking to its product page |
| `bundle-builder.html` | The bundle builder on its own: the header-popup builder placed inline, so customers can mix flavors (e.g. 1 Napa Blast + 1 Cherry On Top) |

`homepage.html` only redirects to `index.html`, so older links keep working.

All images are stored in `images/`, so the pages don't depend on the live store's CDN. Only the Google Fonts load from the web.

The widget code is shared: `css/` and `js/` hold one copy of each section, used by both the standalone pages and `index.html`. The homepage backdrop is in `images/site/` (desktop and mobile captures). Social media sections are left out on purpose.

## Viewing

- **Live:** published with GitHub Pages from the `main` branch, root folder.
- **Locally:** run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Notes for the Shopify build

- On phones (under 640px) the bundle builder uses compact product rows so the summary stays close; desktop and tablet match the popup 1:1.
- The bundle builder reuses the popup's markup, styles and logic with a `_bundleinline` class suffix and section-scoped selectors, so it can sit on the same page as the existing popup.
- In the mockup, "Add Bundle To cart" is simulated. When `window.Shopify` exists, it posts each flavor as its own line item to `/cart/add.js`, the same way the popup does. The 20% / 30% shown is calculated on the page only, so confirm the store's automatic discount also applies to mixed-flavor carts.
- The live site references the "Nunito Sans" and "Bricolage Grotesque" fonts but never loads them. The mockups load Nunito Sans from Google Fonts, and the theme should load it too.
- Pages carry `noindex` so search engines don't list a copy of the client's site.
