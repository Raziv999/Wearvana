# Wearvana — Project Status & Context

> **Purpose:** This file is the single source of truth for the Wearvana project.
> Any AI model or developer picking up this project should read this file first.
> Last updated: May 2026

---

## 1. What Is Wearvana

Wearvana is Nepal's pre-order streetwear platform. Customers browse sneakers and caps, place a pre-order by paying 50% advance via eSewa or Khalti, and receive authentic products delivered to their door in Nepal within 14–21 days. There are no physical products in stock — everything is sourced after the order is placed.

**Live URL:** https://getwearvana.com
**Admin Panel:** https://getwearvana.com/admin
**GitHub:** https://github.com/Raziv999/Wearvana
**Backend API:** https://[render-url].onrender.com (Render free tier)

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 14 (App Router) | Deployed on Vercel |
| Backend | Express.js + Node.js | Deployed on Render free tier |
| Database | MongoDB Atlas | Cloud-hosted |
| Image hosting | Cloudinary | Unsigned uploads from browser |
| Payments (display only) | eSewa / Khalti | Customer pays manually, sends screenshot |
| WhatsApp alerts | CallMeBot API | Free, fires on every new order |
| Email confirmation | EmailJS REST API | Browser-side, no server needed |
| Analytics | Google Analytics 4 | `trackEvent()` wrapper in GoogleAnalytics.jsx |
| Fonts | Google Fonts | Barlow Condensed, Space Grotesk, Inter |
| CSS | Tailwind CSS | All colors hardcoded as hex utilities |
| Icons | lucide-react | Used throughout |

---

## 3. Repository Structure

```
D:\Wearvana\
│
├── backend/                          ← Express API (deployed on Render)
│   ├── server.js                     ← App entry, CORS config, route mounting
│   ├── config/
│   │   └── db.js                     ← MongoDB Atlas connection
│   ├── models/
│   │   ├── Product.js                ← Main product schema (see Section 6)
│   │   ├── Order.js                  ← Order schema
│   │   └── Waitlist.js               ← Waitlist schema for sold-out products
│   ├── routes/
│   │   ├── products.js               ← GET all, GET by slug, GET by ID, POST, PATCH, DELETE
│   │   ├── orders.js                 ← POST new order + fires WhatsApp alert
│   │   ├── upload.js                 ← Cloudinary upload proxy
│   │   └── waitlist.js               ← POST join, GET by product, GET count, DELETE
│   └── controllers/
│       └── orderController.js        ← Order logic + notifyAdmin() WhatsApp function
│
└── src/                              ← Next.js frontend
    ├── app/
    │   ├── layout.jsx                ← Root layout, fonts, JSON-LD org schema, anti-FOUC script
    │   ├── globals.css               ← Tailwind base + dark/light mode CSS overrides
    │   ├── page.jsx                  ← Homepage (Header, HeroBanner, ProductGrid with Suspense)
    │   ├── product/[slug]/page.jsx   ← Product page: SSR fetch, metadata, JSON-LD, RecentlyViewed
    │   ├── blog/
    │   │   ├── page.jsx              ← Blog index: featured + grid layout
    │   │   └── [slug]/page.jsx       ← Article page: JSON-LD, related posts, CTA
    │   ├── api/
    │   │   └── story/[slug]/route.js ← Edge: generates 1080x1920 Instagram story image
    │   ├── admin/page.jsx            ← Admin panel entry (protected by basic check)
    │   ├── about/page.jsx
    │   ├── faq/page.jsx
    │   ├── track/page.jsx            ← Order tracking page (UI only, no real lookup yet)
    │   ├── sitemap.js                ← Dynamic: fetches products from API + static pages
    │   └── robots.js
    │
    ├── components/
    │   ├── Header.jsx                ← Sticky nav, grail counter, ThemeToggle, mobile drawer
    │   ├── Footer.jsx                ← How It Works steps, CTA band, footer links grid
    │   ├── HeroBanner.jsx            ← Hero section
    │   ├── CountdownTimer.jsx        ← Drop countdown (config in src/config/drop.js)
    │   ├── ProductGrid.jsx           ← Async server component, fetches from API
    │   ├── ProductCard.jsx           ← Card: clImage optimization, WaitlistModal on sold-out
    │   ├── ProductCardSkeleton.jsx   ← Pulse animation skeleton (single + grid variant)
    │   ├── FilterableGrid.jsx        ← Mega dropdown menu, price chips, search + autocomplete
    │   ├── ProductPageClient.jsx     ← Full product detail UI (client component)
    │   ├── ProductGallery.jsx        ← Lightbox, thumbnails, swipe, video player, clImage
    │   ├── OrderFormModal.jsx        ← Pre-order form: validation, EmailJS, retry logic
    │   ├── WaitlistModal.jsx         ← Join waitlist form for sold-out products
    │   ├── SizeGuideModal.jsx        ← Size chart modal
    │   ├── ViewingCounter.jsx        ← "X people viewing" — seeded per product ID
    │   ├── RecentlyViewed.jsx        ← Strip of last 3 viewed products (product page only)
    │   ├── Testimonials.jsx          ← Review placeholder + animated count-up stats
    │   ├── InstagramSection.jsx      ← Instagram feed placeholder
    │   ├── CustomSource.jsx          ← "Source" section (WhatsApp CTA)
    │   ├── AnnouncementBanner.jsx    ← Top-of-page announcement strip
    │   ├── WhatsAppFloat.jsx         ← Floating WhatsApp button (bottom right)
    │   ├── GoogleAnalytics.jsx       ← GA4 script + trackEvent() export
    │   ├── ThemeToggle.jsx           ← Sun/Moon button, hydration-safe
    │   ├── GrailButton.jsx           ← Heart toggle on product card
    │   ├── GrailDrawer.jsx           ← Slide-out wishlist panel
    │   └── admin/
    │       ├── AdminDashboard.jsx    ← Product table, server status banner, CRUD triggers
    │       ├── ProductFormModal.jsx  ← Add/edit form: images, soldSizes, videoUrl, all fields
    │       └── ImageUploader.jsx     ← Single Cloudinary upload with preview
    │
    ├── hooks/
    │   ├── useRecentlyViewed.js      ← localStorage, max 4 items, deduped, SSR-safe
    │   ├── useGrailList.js           ← localStorage wishlist
    │   └── useTheme.js               ← dark/light toggle, localStorage, data-theme on <html>
    │
    ├── lib/
    │   └── cloudinary.js             ← clImage(url, width) helper — adds f_auto,q_auto,w_N
    │
    ├── data/
    │   └── blogPosts.js              ← 4 static SEO articles (drops, sizing, culture, Dunk vs AF1)
    │
    └── config/
        └── drop.js                   ← DROP_CONFIG: { targetDate, isLive }
```

---

## 4. Environment Variables

### Vercel (Frontend — set in Vercel dashboard)

```env
NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_PRESET=your_unsigned_preset
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Render (Backend — set in Render dashboard)

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/wearvana
CLIENT_URL=https://getwearvana.com
CALLMEBOT_PHONE=977XXXXXXXXXX
CALLMEBOT_APIKEY=xxxxxxx
PORT=5000
```

---

## 5. Deployment Notes

- **Frontend (Vercel):** Auto-deploys on every push to `main`. Build time ~45 seconds.
- **Backend (Render):** Free tier — **sleeps after 15 minutes of inactivity**. First request after sleep takes ~30 seconds. Admin panel has a server status banner that detects this and shows a "Wake Server" button.
- **Render redeploy:** Any backend change (models, routes, server.js) requires a manual redeploy on the Render dashboard OR a new push that Render auto-detects. Changes do NOT go live until redeployed.
- **CORS:** `backend/server.js` allows `getwearvana.com`, `www.getwearvana.com`, `wearvana.com`, `www.wearvana.com`, `localhost:3000`, and all `*.vercel.app` preview URLs.

---

## 6. Database Schemas

### Product
```js
{
  brand:          String,    // 'NIKE' | 'JORDAN' | 'ADIDAS' | 'NEW BALANCE' | 'NEW ERA' | 'ON RUNNING'
  name:           String,    // e.g. "Air Jordan 1 Retro High OG"
  colorway:       String,    // e.g. "Chicago — White/Black/Varsity Red"
  price:          Number,    // NPR, full retail price
  category:       String,    // 'sneakers' | 'running' | 'caps'
  subcategory:    String,    // e.g. "Jordan 1 High", "Air Jordan 4" — used for filtering
  image:          String,    // Cloudinary URL (primary image)
  images:         [String],  // Up to 4 additional gallery images (Cloudinary URLs)
  badge:          String,    // 'HOT' | 'NEW' | 'SELLING FAST' | 'ICONIC' | null
  limited:        Boolean,
  available:      Boolean,   // false = sold out, shows waitlist CTA
  slotsRemaining: Number,    // null = unlimited; shows "Only N slots left" if ≤ 5
  slug:           String,    // URL slug, unique — used for /product/[slug]
  soldSizes:      [String],  // e.g. ['US 8', 'US 9'] — greyed out on product page
  videoUrl:       String,    // YouTube URL or direct .mp4 — shown as video tab in gallery
  createdAt:      Date,
  updatedAt:      Date,
}
```

### Order
```js
{
  orderId:         String,   // e.g. "WV-20250512-XXXX"
  customerName:    String,
  customerPhone:   String,   // Nepal format: 98/97XXXXXXXX
  customerEmail:   String,   // optional — used for EmailJS confirmation
  productId:       ObjectId,
  productName:     String,
  productBrand:    String,
  size:            String,
  advanceAmount:   Number,   // 50% of product price
  paymentMethod:   String,   // 'eSewa' | 'Khalti'
  paymentReference:String,   // transaction ID screenshot ref
  createdAt:       Date,
}
```

### Waitlist
```js
{
  product:      ObjectId,  // ref: Product
  productName:  String,
  productBrand: String,
  name:         String,
  phone:        String,    // Nepal format: 98/97XXXXXXXX
  notified:     Boolean,   // default false — flip to true after notifying
  createdAt:    Date,
}
// Unique index on { product, phone } — no duplicate entries
```

---

## 7. Key Design Decisions & Patterns

### Color System (Dark Mode — default)
```
#0A0A0A  — primary background (page)
#111111  — card / surface background
#1C1C1C  — subtle / input background
#242424  — borders
#383838  — very muted text / dim borders
#525252  — secondary / muted text
#909090  — tertiary text
#F4F4F4  — primary text
#C0231E  — brand red (accent, CTAs, badges)
#34D399  — success green
#FBBF24  — warning yellow
```

### Light Mode
- Toggled via `data-theme="light"` on `<html>`
- CSS overrides in `globals.css` target each Tailwind hex class with `!important`
- Preference saved to `localStorage` key `wearvana_theme`
- Anti-FOUC inline script in `layout.jsx` applies theme before first paint

### Image Optimization
- All Cloudinary URLs go through `clImage(url, width)` in `src/lib/cloudinary.js`
- Inserts `f_auto,q_auto,w_{width}` after `/upload/` in the URL
- Serves WebP on modern browsers, compressed JPEG on older ones
- Default widths: ProductCard=600, ProductGallery=1200, RecentlyViewed=400

### Waitlist Flow
1. Product marked `available: false` in admin → CTA changes to "Notify Me When Back"
2. Customer opens `WaitlistModal`, enters name + Nepal phone number
3. POST to `/api/waitlist` — stored in MongoDB with unique constraint (product+phone)
4. **Admin must manually notify** — no auto-notification built yet
5. When product is made available again, admin should notify waitlist manually via WhatsApp

### Recently Viewed
- Hook: `useRecentlyViewed` — reads/writes `localStorage` key `wearvana_recently_viewed`
- Stores max 4 products (full product objects), newest first, deduped
- `RecentlyViewed` component renders on every `/product/[slug]` page, filters out current product
- SSR-safe: `mounted` flag prevents hydration mismatch

### Search Autocomplete
- Lives in `FilterableGrid.jsx`
- Triggers on 2+ characters, shows max 5 suggestions
- Matches against `name`, `brand`, `colorway`
- Closes on outside click, Escape key, or suggestion selection

### Video Support
- Admin sets `videoUrl` (YouTube URL or `.mp4`)
- Gallery shows a video thumbnail (YouTube preview image + play icon) in the strip
- Clicking it replaces main image with YouTube iframe (autoplay) or `<video>` tag
- Arrows/counter hide during video playback

### Animated Counters
- `Testimonials.jsx` uses `IntersectionObserver` (threshold 0.4)
- When stats section enters viewport, triggers ease-out cubic count-up animation
- Duration: 1600ms, fires once then observer disconnects

---

## 8. API Endpoints

### Backend (Express — all at `/api`)

| Method | Path | Description |
|---|---|---|
| GET | `/api/products` | All products |
| GET | `/api/products/:id` | Single product by MongoDB ID |
| GET | `/api/products/slug/:slug` | Single product by URL slug |
| POST | `/api/products` | Create product |
| PATCH | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| POST | `/api/orders` | Create order + WhatsApp alert to admin |
| GET | `/api/orders` | All orders (admin) |
| POST | `/api/upload` | Upload image to Cloudinary, returns URL |
| POST | `/api/waitlist` | Join waitlist (name + phone + productId) |
| GET | `/api/waitlist/:productId` | All waitlist entries for a product |
| GET | `/api/waitlist/count/:productId` | Count of waitlist entries |
| DELETE | `/api/waitlist/:id` | Remove a waitlist entry |
| GET | `/api/health` | Health check — returns `{ status: 'ok' }` |

### Frontend API Routes (Next.js Edge)

| Method | Path | Description |
|---|---|---|
| GET | `/api/story/[slug]` | Generate 1080x1920 Instagram story image for a product |

---

## 9. Brands & Categories Supported

### Brands
`NIKE`, `JORDAN`, `ADIDAS`, `NEW BALANCE`, `NEW ERA`, `ON RUNNING`

### Categories
`sneakers`, `running`, `caps`

### Sizes
- Sneakers/Running: US 6, US 6.5, US 7, US 7.5, US 8, US 8.5, US 9, US 9.5, US 10, US 10.5, US 11, US 11.5, US 12, US 13
- Caps: S/M, L/XL, One Size

---

## 10. Completed Features — Full List

### Infrastructure & Fixes
- [x] CORS fix — `getwearvana.com` added to `ALLOWED_ORIGINS` in `backend/server.js`
- [x] Admin server wake-up banner — detects offline, shows "Wake Server" button
- [x] Render cold-start retry — 30s auto-retry with countdown in `OrderFormModal`
- [x] "Only 0 slots left" bug fixed — added `> 0` check in both `ProductCard` and `ProductGallery`
- [x] Nepal phone validation — regex `/^(98|97)\d{8}$/` in `OrderFormModal` and `WaitlistModal`
- [x] Dynamic copyright year in `Footer`

### SEO
- [x] Per-product `generateMetadata` (title, description, keywords, OG, Twitter Card)
- [x] JSON-LD Product schema on every product page
- [x] JSON-LD Organization schema in root `layout.jsx`
- [x] JSON-LD Article schema on blog posts
- [x] Dynamic `sitemap.js` (fetches live products + all static pages + blog articles)
- [x] `robots.js`
- [x] Blog `/blog` + 4 SEO articles (`/blog/[slug]`) with generateStaticParams

### Performance
- [x] Skeleton loaders — `ProductCardSkeleton` + `ProductGridSkeleton` with Suspense
- [x] Cloudinary auto-optimization — `clImage()` applies `f_auto,q_auto,w_N` to all image URLs
- [x] Next.js Image component with correct `sizes` on all image renders

### UX / Features
- [x] Image zoom lightbox — click to zoom, Escape to close, prev/next in lightbox
- [x] Swipe support on product gallery (mobile touch events)
- [x] WhatsApp admin alerts on new orders via CallMeBot
- [x] Email confirmation to customer after order via EmailJS
- [x] Live viewing counter per product (`ViewingCounter.jsx`)
- [x] Price filter chips — Under 10K / 10K–20K / 20K+
- [x] Search with autocomplete dropdown in `FilterableGrid`
- [x] Mega dropdown brand/silhouette filter menu
- [x] Grail list (wishlist) — heart button on cards, slide-out drawer
- [x] Recently Viewed strip on product pages
- [x] soldSizes — admin checkbox grid, greyed-out sizes on product page
- [x] Video support — YouTube embed or .mp4 in product gallery
- [x] Waitlist modal for sold-out products (stored in MongoDB)
- [x] Animated count-up stats in `Testimonials` (IntersectionObserver)
- [x] Dark / Light mode toggle in header (persisted in localStorage)
- [x] Anti-FOUC inline script in layout head
- [x] Instagram Story image generation at `/api/story/[slug]`
- [x] "Download Instagram Story" button on product pages

### Admin Panel
- [x] Product CRUD table with add/edit/delete
- [x] `ProductFormModal` with all fields including soldSizes and videoUrl
- [x] Cloudinary image upload (main + up to 4 gallery images)
- [x] Bulk gallery upload (multi-file select, Promise.all)
- [x] Server status banner (online/offline detection)
- [x] Auto-slug generation from brand + name

### Blog
- [x] `/blog` index page with featured article + grid
- [x] `/blog/[slug]` article pages with related posts + CTA
- [x] 4 articles: Best Sneakers Nepal 2025 / Dunk vs AF1 / Size Guide / Streetwear Culture
- [x] Blog in sitemap + Footer navigation

---

## 11. NOT YET BUILT — Pending Features

### High Priority

#### Admin Waitlist Viewer
- **What:** Show waitlist count badge per product in `AdminDashboard`. Clicking it should open a panel listing all waitlist entries (name, phone, date) with a "Copy All Numbers" button.
- **Files to edit:** `src/components/admin/AdminDashboard.jsx`
- **API available:** `GET /api/waitlist/:productId` and `GET /api/waitlist/count/:productId` already exist in backend.
- **Notes:** Consider adding a "Mark as Notified" button that sets `notified: true` per entry.

#### Auto-Notify Waitlist When Product Goes Live
- **What:** When admin flips `available` from `false` → `true` and saves, the backend should automatically fetch all waitlist entries for that product and send each a WhatsApp message via CallMeBot.
- **Files to edit:** `backend/routes/products.js` (PATCH handler) or `backend/controllers/productController.js`
- **Notes:** CallMeBot is rate-limited — queue messages 1 second apart using `setTimeout`.

#### Order Tracking (`/track`)
- **What:** `/track` exists as a static page but has no real lookup. Customer should enter their order ID or phone number and see their order status.
- **Files to edit:** `src/app/track/page.jsx` (make it client), add `GET /api/orders/track?phone=...` or `GET /api/orders/:orderId` to backend.

### Medium Priority

#### Real Instagram Feed
- **What:** `InstagramSection.jsx` is a placeholder. Replace with actual recent posts pulled from Instagram Basic Display API or a third-party embed service.
- **Files to edit:** `src/components/InstagramSection.jsx`
- **Notes:** Instagram Basic Display API requires app review. Easier option: use a service like Behold.so or EmbedSocial.

#### Real Customer Reviews
- **What:** `Testimonials.jsx` has placeholder copy. Need a way for customers to submit reviews (via admin or a form) and display them in cards with star ratings.
- **Options:** (A) Admin manually enters reviews in a MongoDB `Review` model, (B) Collect via Google Forms and display static JSON, (C) Full review submission form with moderation.

#### More Blog Articles
- **What:** Add more SEO-targeted articles to `src/data/blogPosts.js`.
- **Suggested topics:** "Best New Era Caps in Nepal", "On Running Cloud 6 Review", "How to Authenticate Nike Sneakers", "Adidas Samba vs Gazelle".
- **Files to edit:** `src/data/blogPosts.js` (add entries), no other file changes needed.

### Low Priority

#### Light Mode Polish
- **What:** The light mode CSS in `globals.css` covers most elements but some deeply nested components (admin panel, modals) may still show dark backgrounds.
- **Files to edit:** `src/app/globals.css` — add more `html[data-theme="light"]` overrides.

#### PWA Push Notifications
- **What:** `manifest.json` exists. Could add web push notifications for new drops using a service like OneSignal or native Push API.

#### Google Analytics Events Audit
- **What:** `trackEvent()` is called on `view_item` and `begin_checkout`. Should also track: `purchase` (after order success), `add_to_wishlist` (grail button), `search` (when search is used), `select_item` (product card click).
- **Files to edit:** `ProductCard.jsx`, `GrailButton.jsx`, `FilterableGrid.jsx`, `OrderFormModal.jsx`.

---

## 12. Owner Setup Tasks (not code — manual steps)

| Task | Status | Instructions |
|---|---|---|
| CallMeBot registration | ❓ Unknown | Go to callmebot.com, send WhatsApp message to activate, add `CALLMEBOT_PHONE` and `CALLMEBOT_APIKEY` to Render env vars |
| EmailJS setup | ❓ Unknown | Create account at emailjs.com, create service + template, add 3 `NEXT_PUBLIC_EMAILJS_*` vars to Vercel |
| Upload real product photos | ❓ Unknown | Log into admin panel, edit each product, upload Cloudinary images |
| Google Analytics | ❓ Unknown | Create GA4 property, add `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX` to Vercel |
| Google Search Console | ❓ Unknown | Verify `getwearvana.com`, submit `https://getwearvana.com/sitemap.xml` |
| Render redeploy | ✅ Done | Required after each backend change |

---

## 13. Important Code Patterns & Gotchas

### Cloudinary URL transformation
```js
// Always use clImage() — never use raw Cloudinary URLs in img/Image tags
import { clImage } from '@/lib/cloudinary'
<Image src={clImage(product.image, 800)} />
// Already-optimized and non-Cloudinary URLs pass through safely
```

### Product image in story / OG generation
```js
// Cloudinary URLs are absolute — DON'T prepend BASE_URL to them
const imgSrc = product.image.startsWith('http')
  ? product.image
  : `${BASE_URL}${product.image}`
```

### localStorage hooks (SSR safety)
```js
// All localStorage hooks use a `mounted` state flag
// Always check `if (!mounted) return null` before rendering localStorage-dependent UI
// This prevents React hydration mismatches
```

### Nepal phone validation
```js
// Both OrderFormModal and WaitlistModal use this regex
/^(98|97)\d{8}$/.test(phone.trim())
// Valid: 9812345678, 9705477470
// Invalid: anything else
```

### Render cold start
```js
// OrderFormModal has a 30s auto-retry loop for network errors
// The admin panel has a server status banner that polls /api/health
// Do NOT add more aggressive polling — Render free tier has limits
```

### Theme toggle
```js
// The anti-FOUC script in layout.jsx must stay as a raw inline script (not a module)
// It reads localStorage synchronously before React hydrates
// ThemeToggle renders a blank placeholder on server, real button on client
```

---

## 14. Git History (recent significant commits)

```
7431348  feat: Features 10-14 — Cloudinary optimization, Waitlist, Counters, Story, Dark/Light mode
e7b3536  feat: Features 5-9 — Recently Viewed, soldSizes, Autocomplete, Video, Blog
9ca7f0d  feat: QA fixes, skeleton loaders, lightbox, bulk upload, price filter, WhatsApp alerts
28dd9a3  fix: CORS — add getwearvana.com to allowed origins
```

---

## 15. Contacts & Accounts

- **WhatsApp Business Number:** +977 9705477470
- **Instagram:** @wearvana.kicks (https://www.instagram.com/wearvana.kicks)
- **Deployment:** Vercel (frontend) + Render (backend) + MongoDB Atlas (database) + Cloudinary (images)
