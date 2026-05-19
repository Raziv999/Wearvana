# Wearvana — Project Status & Context

> **Purpose:** Single source of truth for the Wearvana project.
> Any AI model or developer picking up this project should read this file first.
> Last updated: May 2026

---

## 1. What Is Wearvana

Nepal's pre-order streetwear platform. Customers browse sneakers and caps, pay 50% advance via eSewa or Khalti, and receive authentic products delivered in Nepal within 14–21 days. No physical stock — everything is sourced after order.

**Live URL:** https://getwearvana.com  
**Admin Panel:** https://getwearvana.com/admin  
**GitHub:** https://github.com/Raziv999/Wearvana  
**Backend API:** https://[render-url].onrender.com (Render free tier)

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 14 (App Router) | Deployed on Vercel, auto-deploys on push to main |
| Backend | Express.js + Node.js | Deployed on Render free tier (sleeps after 15 min idle) |
| Database | MongoDB Atlas | Cloud-hosted |
| Images | Cloudinary | Unsigned uploads from browser via ImageUploader |
| Payments | eSewa / Khalti | Display only — customer pays manually, sends screenshot |
| WhatsApp | CallMeBot API | New orders → admin alert; product live → waitlist notify |
| Email | EmailJS REST API | Browser-side order confirmation to customer |
| Analytics | Google Analytics 4 | trackEvent() wrapper in GoogleAnalytics.jsx |
| Instagram | Behold.so | Widget with feed ID `5ccpzdQD4A20h1qCJ0QY` |
| Fonts | Google Fonts | Barlow Condensed, Space Grotesk, Inter |
| CSS | Tailwind CSS | All colors hardcoded as hex utilities |
| Icons | lucide-react | Used throughout |

---

## 3. Repository Structure

```
D:\Wearvana\
│
├── backend/
│   ├── server.js                     ← Entry, CORS config, route mounting
│   ├── config/db.js                  ← MongoDB Atlas connection
│   ├── models/
│   │   ├── Product.js                ← Main product schema
│   │   ├── Order.js                  ← Order schema
│   │   ├── Waitlist.js               ← Waitlist entries per product
│   │   └── Review.js                 ← Customer reviews (admin-managed)
│   ├── routes/
│   │   ├── products.js               ← CRUD + PATCH triggers auto-notify
│   │   ├── orders.js                 ← POST new order + WhatsApp alert
│   │   ├── upload.js                 ← Cloudinary upload proxy
│   │   ├── waitlist.js               ← Join, list, count, patch notified, delete
│   │   └── reviews.js                ← CRUD reviews (public GET, admin POST/PATCH/DELETE)
│   └── controllers/
│       ├── orderController.js        ← Order logic + notifyAdmin() WhatsApp
│       └── productController.js      ← updateProduct detects live transition → auto-notify waitlist
│
└── src/
    ├── app/
    │   ├── layout.jsx                ← Root layout, fonts, JSON-LD org, anti-FOUC script
    │   ├── globals.css               ← Tailwind base + dark/light mode overrides
    │   ├── page.jsx                  ← Homepage
    │   ├── product/[slug]/page.jsx   ← SSR product page, metadata, JSON-LD
    │   ├── blog/page.jsx             ← Blog index
    │   ├── blog/[slug]/page.jsx      ← Article page
    │   ├── track/page.jsx            ← Order tracking page (fully functional)
    │   ├── about/page.jsx
    │   ├── faq/page.jsx
    │   ├── api/story/[slug]/route.js ← Edge: 1080x1920 Instagram story image
    │   ├── api/admin/login/route.js  ← Admin auth
    │   ├── admin/page.jsx            ← Admin panel entry
    │   ├── sitemap.js                ← Dynamic: products + static pages + blog
    │   └── robots.js
    │
    ├── components/
    │   ├── Header.jsx                ← Sticky nav, grail counter, ThemeToggle
    │   ├── Footer.jsx
    │   ├── HeroBanner.jsx
    │   ├── CountdownTimer.jsx        ← Drop countdown (config/drop.js)
    │   ├── ProductGrid.jsx           ← Async server component
    │   ├── ProductCard.jsx           ← clImage, WaitlistModal, select_item GA event
    │   ├── ProductCardSkeleton.jsx
    │   ├── FilterableGrid.jsx        ← Brand filter, price chips, search + autocomplete, search GA event
    │   ├── ProductPageClient.jsx     ← Full product detail (view_item + begin_checkout GA)
    │   ├── ProductGallery.jsx        ← Lightbox, swipe, video, clImage
    │   ├── OrderFormModal.jsx        ← Pre-order form, EmailJS, purchase GA event
    │   ├── OrderTracker.jsx          ← /track live lookup by order ID
    │   ├── WaitlistModal.jsx         ← Join waitlist for sold-out products
    │   ├── SizeGuideModal.jsx
    │   ├── ViewingCounter.jsx        ← "X people viewing" — seeded per product ID
    │   ├── RecentlyViewed.jsx        ← Last 3 viewed (product pages only)
    │   ├── Testimonials.jsx          ← Fetches real reviews from API + animated stats
    │   ├── InstagramSection.jsx      ← Behold.so widget (real feed)
    │   ├── CustomSource.jsx
    │   ├── AnnouncementBanner.jsx
    │   ├── WhatsAppFloat.jsx
    │   ├── GoogleAnalytics.jsx       ← GA4 + trackEvent() export
    │   ├── ThemeToggle.jsx           ← Hydration-safe sun/moon button
    │   ├── GrailButton.jsx           ← Heart toggle + add_to_wishlist GA event
    │   ├── GrailDrawer.jsx           ← Slide-out wishlist panel, clImage
    │   └── admin/
    │       ├── AdminDashboard.jsx    ← Orders + Products tabs + Reviews button
    │       ├── OrderTable.jsx
    │       ├── NewOrderForm.jsx
    │       ├── ProductTable.jsx      ← Waitlist badge per card, clImage
    │       ├── ProductFormModal.jsx
    │       ├── ProductDetailPanel.jsx← clImage on all gallery images
    │       ├── ImageUploader.jsx
    │       ├── WaitlistPanel.jsx     ← Slide-in: entries, copy numbers, mark notified
    │       └── ReviewManager.jsx     ← Slide-in: add/toggle/delete reviews
    │
    ├── hooks/
    │   ├── useRecentlyViewed.js      ← localStorage, max 4, SSR-safe
    │   ├── useGrailList.js           ← localStorage wishlist
    │   └── useTheme.js               ← dark/light, localStorage, data-theme on <html>
    │
    ├── lib/cloudinary.js             ← clImage(url, width) — f_auto,q_auto,w_N
    ├── data/blogPosts.js             ← 8 static SEO articles
    └── config/drop.js                ← DROP_CONFIG: { targetDate, isLive }
```

---

## 4. Environment Variables

### Vercel (frontend)
```env
NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dwd5fxbbz
NEXT_PUBLIC_CLOUDINARY_PRESET=your_unsigned_preset
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Render (backend)
```env
MONGO_URI=mongodb+srv://...
CLIENT_URL=https://getwearvana.com
CALLMEBOT_PHONE=977XXXXXXXXXX      ← admin's WhatsApp (for order alerts)
CALLMEBOT_APIKEY=xxxxxxx           ← admin's CallMeBot key (order alerts)
CALLMEBOT_API_KEY=xxxxxxx          ← same or separate key used for waitlist auto-notify
PORT=5000
CLOUDINARY_CLOUD_NAME=dwd5fxbbz
CLOUDINARY_API_KEY=588783863974929
CLOUDINARY_API_SECRET=AhhHKX-erfQ4BJbqoO8b7ncXtEE
```

---

## 5. Deployment Notes

- **Vercel:** Auto-deploys on push to `main`. Build ~45s.
- **Render:** Free tier — sleeps after 15 min idle. First request after sleep ~30s. Admin panel has "Wake Server" banner.
- **Backend changes** (models, routes, server.js) require a Render redeploy. Push to GitHub triggers it automatically if Render is connected to the repo.
- **CORS:** Allows `getwearvana.com`, `www.getwearvana.com`, `wearvana.com`, `localhost:3000`, all `*.vercel.app`.

---

## 6. Database Schemas

### Product
```js
{
  brand, name, colorway, price,
  category,    // 'sneakers' | 'running' | 'caps'
  subcategory, // e.g. "Jordan 1 High"
  image,       // Cloudinary URL (primary)
  images,      // [String] up to 4 additional
  badge,       // 'HOT' | 'NEW' | 'SELLING FAST' | 'ICONIC' | null
  limited,     // Boolean
  available,   // false = sold out → shows Notify Me CTA
  slotsRemaining, // null = unlimited
  slug,        // unique URL slug
  soldSizes,   // [String] greyed-out on product page
  videoUrl,    // YouTube or .mp4
  createdAt, updatedAt
}
```

### Order
```js
{
  orderId,          // e.g. "WV-20250512-XXXX"
  customerName, customerPhone, customerEmail,
  product,          // ObjectId ref
  productName, productBrand, colorway,
  size,
  totalPrice, advanceAmount,
  paymentMethod,    // 'eSewa' | 'Khalti'
  paymentReference,
  status,           // 'pending'|'confirmed'|'sourcing'|'arrived'|'delivered'|'cancelled'
  advancePaid,      // Boolean
  notes,
  createdAt
}
```

### Waitlist
```js
{
  product,      // ObjectId ref
  productName, productBrand,
  name, phone,  // Nepal: 98/97XXXXXXXX
  notified,     // Boolean default false
  createdAt
}
// Unique index: { product, phone }
```

### Review
```js
{
  name,         // Customer name
  location,     // e.g. "Kathmandu"
  product,      // Optional product name string
  rating,       // 1–5
  text,         // Review body
  approved,     // Boolean — only approved show on site
  createdAt
}
```

---

## 7. API Endpoints

| Method | Path | Notes |
|---|---|---|
| GET | `/api/products` | All products, query: category/brand/available |
| GET | `/api/products/slug/:slug` | By URL slug |
| GET | `/api/products/:id` | By MongoDB ID |
| POST | `/api/products` | Create |
| PATCH | `/api/products/:id` | Update — triggers waitlist auto-notify if going live |
| DELETE | `/api/products/:id` | Delete |
| GET | `/api/orders` | All orders (admin) |
| GET | `/api/orders/stats` | Dashboard counts + advance total |
| GET | `/api/orders/status/:orderId` | Public lookup — safe fields only |
| GET | `/api/orders/:id` | Single order by MongoDB ID |
| POST | `/api/orders` | Create order + WhatsApp alert to admin |
| PATCH | `/api/orders/:id` | Update status/payment |
| POST | `/api/upload` | Cloudinary upload, returns URL |
| GET | `/api/waitlist/count/:productId` | Count only (for badges) |
| GET | `/api/waitlist/:productId` | All entries for product |
| POST | `/api/waitlist` | Join waitlist |
| PATCH | `/api/waitlist/:id` | Mark notified |
| DELETE | `/api/waitlist/:id` | Remove entry |
| GET | `/api/reviews` | Approved reviews (public) |
| GET | `/api/reviews/all` | All reviews (admin) |
| POST | `/api/reviews` | Add review (admin) |
| PATCH | `/api/reviews/:id` | Toggle approved (admin) |
| DELETE | `/api/reviews/:id` | Delete review (admin) |
| GET | `/api/health` | `{ status: 'ok' }` |
| GET | `/api/story/[slug]` | Next.js edge: Instagram story image |

---

## 8. Key Code Patterns & Gotchas

### Cloudinary images — ALWAYS use clImage()
```js
import { clImage } from '@/lib/cloudinary'
<Image src={clImage(product.image, 800)} />
// Safe on non-Cloudinary and already-transformed URLs
// Default widths: Card=600, Gallery=1200, Admin panel=800, Grail drawer=200
```

### OG / story image — don't double-prepend URL
```js
const imgSrc = product.image.startsWith('http')
  ? product.image
  : `${BASE_URL}${product.image}`
```

### SSR safety — localStorage hooks
```js
// All hooks expose a `mounted` flag
// Render null/placeholder until mounted === true
// Prevents React hydration mismatch
```

### Nepal phone validation
```js
/^(98|97)\d{8}$/.test(phone.trim())
// Used in OrderFormModal and WaitlistModal
```

### Render cold start
```js
// Admin panel polls /api/health, shows Wake Server button
// OrderFormModal has 30s auto-retry on network error
// Do NOT add more aggressive polling — Render free tier has limits
```

### Theme / anti-FOUC
```js
// Inline script in layout.jsx reads localStorage before React hydrates
// Must stay as raw script (not module)
// ThemeToggle returns neutral placeholder on server, real button after mount
```

### Auto-notify waitlist
```js
// productController.js updateProduct():
// 1. Fetch product BEFORE update to check old available value
// 2. After update, if available: false → true:
// 3. Fetch Waitlist.find({ product: id, notified: false })
// 4. setTimeout(fn, i * 1000) per entry — 1 message/sec rate limit
// 5. sendWhatsApp() then Waitlist.findByIdAndUpdate({ notified: true })
// Response sent BEFORE notifications fire (fire-and-forget)
```

### Waitlist route order — CRITICAL
```js
// /count/:productId MUST be declared before /:productId
// Otherwise Express matches "count" as a productId
```

### GA events
```js
trackEvent('view_item', ...)        // ProductPageClient — on mount
trackEvent('begin_checkout', ...)   // ProductPageClient — Pre-Order button click
trackEvent('purchase', ...)         // OrderFormModal — on order success
trackEvent('add_to_wishlist', ...)  // GrailButton — when saving to wishlist
trackEvent('select_item', ...)      // ProductCard — on card image click
trackEvent('search', ...)           // FilterableGrid — on autocomplete selection
```

---

## 9. Completed Features — Full List

### Infrastructure
- [x] CORS config — all production domains + vercel preview URLs
- [x] Admin server wake-up banner (offline detection + polling)
- [x] Render cold-start 30s retry in OrderFormModal
- [x] Nepal phone validation regex in OrderFormModal + WaitlistModal
- [x] Dynamic copyright year in Footer

### SEO
- [x] Per-product generateMetadata (title, description, OG, Twitter Card)
- [x] JSON-LD: Product schema, Organization schema, Article schema
- [x] Dynamic sitemap.js (products + static pages + all blog articles)
- [x] robots.js

### Performance
- [x] Skeleton loaders with Suspense (ProductCardSkeleton, ProductGridSkeleton)
- [x] clImage() — f_auto,q_auto,w_N on all Cloudinary URLs in all components
- [x] Next.js Image with correct `sizes` everywhere

### UX / Product Features
- [x] Image lightbox with zoom, Escape, prev/next
- [x] Swipe support on product gallery (mobile touch)
- [x] WhatsApp admin alerts on new orders
- [x] Email confirmation to customer (EmailJS)
- [x] Live viewing counter per product (seeded from product ID)
- [x] Price filter chips (Under 10K / 10K–20K / 20K+)
- [x] Search with autocomplete (2+ chars, 5 suggestions, brand/name/colorway)
- [x] Mega dropdown brand/silhouette filter
- [x] Grail list (wishlist) — heart button + slide-out drawer
- [x] Recently Viewed strip on product pages (max 4, localStorage)
- [x] soldSizes — admin checkbox grid, greyed-out on product page
- [x] Video support — YouTube embed or .mp4 in gallery
- [x] Waitlist modal for sold-out products
- [x] Auto-notify waitlist via WhatsApp when product goes live
- [x] Animated count-up stats (IntersectionObserver, ease-out cubic)
- [x] Dark / Light mode toggle (persisted in localStorage, anti-FOUC)
- [x] Instagram Story image generation (/api/story/[slug])
- [x] "Download Instagram Story" button on product pages
- [x] Real Instagram feed via Behold.so widget
- [x] Real customer reviews — admin-managed, star ratings, avatar initials
- [x] Order tracking page (/track) — live lookup by order ID with status timeline

### Admin Panel
- [x] Orders tab (CRUD, status filter, stats cards)
- [x] Products tab (grid + detail panel, add/edit/delete)
- [x] ProductFormModal (all fields: images, soldSizes, videoUrl, badge, etc.)
- [x] Cloudinary image upload (main + 4 gallery, multi-select bulk upload)
- [x] Server status banner (wake server button)
- [x] Auto-slug generation
- [x] Waitlist badge per product + WaitlistPanel (entries, copy numbers, mark notified)
- [x] ReviewManager panel (add/toggle live/delete reviews)

### Blog
- [x] /blog index (featured + grid)
- [x] /blog/[slug] article pages with related posts + CTA
- [x] 8 articles: Sneakers Nepal 2025, Dunk vs AF1, Size Guide, Streetwear Culture, New Era Caps, On Cloud 6 Review, Nike Authentication, Samba vs Gazelle
- [x] Blog in sitemap + Footer navigation

### Google Analytics Events
- [x] view_item
- [x] begin_checkout
- [x] purchase
- [x] add_to_wishlist
- [x] select_item
- [x] search

---

## 10. Pending / Optional Improvements

| Item | Priority | Notes |
|---|---|---|
| Light mode polish (admin modals) | Low | globals.css has overrides; edge cases may remain |
| PWA push notifications | Low | manifest.json exists; needs OneSignal or native Push API |
| Phone-based order lookup on /track | Low | Currently order ID only; could add `?phone=` lookup |
| More blog articles | Low | Add to src/data/blogPosts.js — no other changes needed |
| Google Search Console verification | Manual | Submit sitemap.xml at getwearvana.com/sitemap.xml |

---

## 11. Owner Setup Tasks (manual — not code)

| Task | Instructions |
|---|---|
| CallMeBot API key | Save +34 644 44 79 86 on WhatsApp, send "I allow callmebot to send me messages", get key → add to Render env as CALLMEBOT_API_KEY |
| EmailJS | emailjs.com → create service + template → add 3 NEXT_PUBLIC_EMAILJS_* to Vercel |
| Google Analytics | Create GA4 property → add NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX to Vercel |
| Google Search Console | Verify getwearvana.com, submit https://getwearvana.com/sitemap.xml |
| Upload product photos | Admin panel → edit each product → Cloudinary upload |
| Add reviews | Admin panel → Reviews button → add real customer reviews |

---

## 12. Recent Git Commits

```
b740fbd  feat: reviews system, blog articles, waitlist auto-notify, clImage audit
621da50  feat: Features 10-14 — Cloudinary, Waitlist, Counters, Story, Dark/Light
e7b3536  feat: Features 5-9 — Recently Viewed, soldSizes, Autocomplete, Video, Blog
9ca7f0d  feat: QA fixes, skeleton loaders, lightbox, bulk upload, price filter
28dd9a3  fix: CORS — add getwearvana.com to allowed origins
```

---

## 13. Contacts

- **WhatsApp Business:** +977 9705477470
- **Instagram:** @wearvana.kicks
- **Stack:** Vercel + Render + MongoDB Atlas + Cloudinary + Behold.so
