# FoodExpress — Food Delivery Website

A fast, mobile-friendly **food delivery website** built with pure HTML, CSS and JavaScript. Browse a menu of Pakistani and international dishes, filter by category, search cravings, manage a sliding cart, and check out with a delivery form — all in one lightweight page with zero dependencies. A clean, SEO-ready **online food ordering** and **restaurant website template** you can reuse for any food business.

**Live demo:** https://aminashehzadi393.github.io/Food-delivery-project/

## Features

- Sticky responsive navigation with mobile menu
- Hero section with live dish search
- Category filter pills (Desi, Fast Food, BBQ & Grill, Chinese, Desserts & Drinks)
- Menu grid with 14 dishes, prices in PKR and gradient dish cards
- Working cart: add/remove items, quantity controls, live totals
- Slide-in cart drawer with subtotal, delivery fee and free-delivery progress
- Checkout form (name, phone, address) with validation and order confirmation
- Cart persists in the browser via localStorage
- Testimonials, how-it-works and contact footer sections
- Fully responsive, mobile-first design; works offline from `file://`

## Tech Stack

- HTML5 (semantic markup)
- CSS3 (custom properties, flexbox, grid — no frameworks)
- Vanilla JavaScript (no libraries, no build step)

## How to Run

No installation needed — just open the file:

1. Download or clone this repository.
2. Double-click `index.html` (or open it in any browser).

That's it. Everything runs locally; an internet connection is only needed for the optional Google Font, which falls back gracefully to system fonts.

## SEO Included

On-page SEO is baked into `index.html`:

- Descriptive `<title>` and meta description targeting food-delivery keywords
- Meta keywords, `robots` (`index, follow`) and canonical URL
- Open Graph tags and Twitter Card tags for rich social sharing
- Semantic HTML5: `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<address>`
- Accessible labels (`aria-label`, `role="img"`) on all visual elements
- Schema.org JSON-LD `FoodEstablishment` markup with a full `Menu` of 14 `MenuItem`s, prices in PKR
- Lightweight page (no frameworks, no external images) for fast load times

## Project Structure

```
Food-delivery-project/
├── index.html   # Page structure + SEO meta + JSON-LD
├── styles.css   # All styling (mobile-first, responsive)
├── app.js       # Menu data, cart, search, filter, checkout logic
└── README.md    # This file
```
