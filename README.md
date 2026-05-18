# Wingdy Static Preview Publish Guide

This directory is the public-shareable static version of the Wingdy ticketing concept site.

## Deploy Target

Deploy this entire folder as the site root:

- `index.html`
- `assets/`
- `pages/`

Do not upload only `index.html`.

## Local Preview

If Node is available:

```bash
npm install
npm run preview
```

Then open:

```text
http://127.0.0.1:4173/index.html
```

If you prefer Python:

```bash
python -m http.server 4173
```

## Vercel

1. Create a new project in Vercel.
2. Point the project to this `static-preview` folder.
3. Framework preset: `Other`.
4. Output directory: leave empty.
5. Deploy.

Included file:
- `vercel.json`

## Netlify

1. Create a new site from drag-and-drop or repo.
2. Upload this `static-preview` folder, or set publish directory to this folder.
3. Deploy.

Included file:
- `netlify.toml`

## GitHub Pages

1. Put the contents of this folder in a repository branch.
2. Enable GitHub Pages from that branch.
3. If using a subpath, verify links still resolve from the selected Pages root.

## Share Link

After deployment, share the generated HTTPS URL.

## Notes

- This is a static showcase, not a real WooCommerce or Stripe checkout.
- Language switching, currency switching, FAQ chat, and cookie prompt are client-side only.
- Product pages are static detail pages for demonstration.
