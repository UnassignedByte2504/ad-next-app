# Ayla Designs - Architecture & Product Design

> **Status**: Approved Design
> **Date**: 2025-12-17
> **Domain**: ayladesigns.me

---

## Executive Summary

Ayla Designs is a full-featured e-commerce platform for selling digital design products (planners, templates, branding kits, social media assets). The platform includes a customer-facing storefront and an admin panel for complete business management.

---

## 1. Product Vision

### What is Ayla Designs?

A bohemian-aesthetic digital design shop offering:
- Digital planners & calendars
- Business card templates
- Social media kits
- Wedding stationery suites
- Branding kits
- Thank you cards & more

### Target Audience

- Entrepreneurs & small business owners
- Wedding planners & event coordinators
- Content creators & influencers
- Coaches & wellness professionals
- Anyone seeking professional yet bohemian branding

### Brand Essence

- **Aesthetic**: Bohemian, celestial, earthy, professional
- **Colors**: Amber/gold, soft purples, stone neutrals, rose accents
- **Tone**: Warm, magical, professional, approachable

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        AYLA DESIGNS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐    ┌──────────────────────┐          │
│  │   ayladesigns.me     │    │ admin.ayladesigns.me │          │
│  │     (Storefront)     │    │    (Admin Panel)     │          │
│  │                      │    │                      │          │
│  │  • Landing/Home      │    │  • Dashboard         │          │
│  │  • Product catalog   │    │  • Products CRUD     │          │
│  │  • Product detail    │    │  • Orders management │          │
│  │  • Cart/Checkout     │    │  • Customer segments │          │
│  │  • Customer account  │    │  • Content/Texts CMS │          │
│  │  • Order history     │    │  • Promotions/Deals  │          │
│  │  • Downloads center  │    │  • Analytics         │          │
│  └──────────┬───────────┘    └──────────┬───────────┘          │
│             │      SAME NEXT.JS APP      │                     │
│             └────────────┬───────────────┘                     │
│                          │                                     │
│  ┌───────────────────────▼───────────────────────────┐         │
│  │              FastAPI Backend                       │         │
│  │  • Auth (JWT + RBAC + OAuth + TOTP)               │         │
│  │  • Products/Variants/Bundles API                  │         │
│  │  • Orders/Payments (Stripe + PayPal)              │         │
│  │  • Customers/Segments                             │         │
│  │  • File delivery (signed URLs)                    │         │
│  │  • Automations engine (Kafka-driven)              │         │
│  └───────────────────────┬───────────────────────────┘         │
│                          │                                     │
│  ┌───────────────────────▼───────────────────────────┐         │
│  │           Infrastructure Layer                     │         │
│  │  Neo4j │ Redis │ Kafka │ Meilisearch │ S3/R2     │         │
│  └───────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16, React 19, TypeScript | SSR, RSC, routing |
| **Styling** | Material UI 7, Tailwind CSS 4 | Components + utilities |
| **State** | Zustand 5 | Global state management |
| **i18n** | next-intl 4 | Spanish + English |
| **Backend** | FastAPI, Python | REST API + WebSockets |
| **Database** | Neo4j | Graph DB (products, customers, segments) |
| **Cache** | Redis | Sessions, cache, rate limiting |
| **Events** | Kafka | Async processing, automations |
| **Search** | Meilisearch | Product search, filters |
| **Storage** | S3/R2 | Product files, images |
| **Payments** | Stripe + PayPal | Payment processing |

---

## 3. User Roles & Permissions

### Role Hierarchy

| Role | Scope | Access |
|------|-------|--------|
| **Super Admin** | System-wide | Everything: app config, API keys, devops, system settings, infrastructure |
| **Admin** | Business ops | Products, orders, customers, content, promotions, analytics - NO system config |
| **Customer** | Self-service | Browse, cart, purchase, view own orders, download files, account settings |

### RBAC Implementation

- JWT tokens include role claims
- Middleware validates role for protected routes
- Backend enforces at API level (existing RBAC in FastAPI)

---

## 4. Domain Model

### Core Entities

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRODUCT DOMAIN                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Product ──────┬──────── Variant                               │
│  • name        │         • name (Basic/Premium)                │
│  • slug        │         • price                               │
│  • description │         • features[]                          │
│  • category    │         • files[]                             │
│  • images[]    │         • downloads_limit                     │
│  • status      │                                               │
│  • metadata    │                                               │
│                │                                               │
│  Bundle ───────┴──────── BundleItem                            │
│  • name                  • product_id                          │
│  • products[]            • variant_id                          │
│  • discount_type         • quantity                            │
│  • discount_value                                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                        ORDER DOMAIN                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Order ────────┬──────── OrderItem                             │
│  • customer_id │         • product/variant/bundle              │
│  • status      │         • price_at_purchase                   │
│  • total       │         • download_token                      │
│  • payment_id  │         • downloads_remaining                 │
│  • created_at  │         • version_access                      │
│                │                                               │
│  Download ─────┘                                               │
│  • order_item_id                                               │
│  • file_version                                                │
│  • signed_url                                                  │
│  • expires_at                                                  │
│  • downloaded_at                                               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                       CUSTOMER DOMAIN                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Customer ─────┬──────── CustomerSegment                       │
│  • email       │         • name                                │
│  • name        │         • rules (Neo4j query)                 │
│  • role        │         • customers[]                         │
│  • orders[]    │                                               │
│  • favorites[] │                                               │
│  • segments[]  │                                               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                      PROMOTION DOMAIN                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Promotion                                                      │
│  • code                                                        │
│  • type (percentage/fixed/shipping)                            │
│  • value                                                       │
│  • conditions (min_purchase, products, segments)               │
│  • valid_from / valid_to                                       │
│  • usage_limit                                                 │
│  • enabled                                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Neo4j Graph Model

```cypher
// Nodes
(:Product {id, name, slug, description, status})
(:Variant {id, name, price, features})
(:Bundle {id, name, discount_type, discount_value})
(:Category {id, name, slug})
(:Customer {id, email, name, role})
(:Order {id, status, total, created_at})
(:File {id, name, version, s3_key, size})
(:Segment {id, name, description})

// Relationships
(Product)-[:HAS_VARIANT]->(Variant)
(Product)-[:IN_CATEGORY]->(Category)
(Bundle)-[:CONTAINS {quantity, discount}]->(Product)
(Customer)-[:PLACED]->(Order)
(Order)-[:INCLUDES {price, quantity}]->(Variant)
(Variant)-[:HAS_FILE]->(File)
(Customer)-[:IN_SEGMENT]->(Segment)
(Customer)-[:FAVORITED]->(Product)
(Customer)-[:PURCHASED]->(Product)  // Derived from orders
```

---

## 5. Digital Product Delivery

### Download Flow

1. **Purchase completed** → Order created with `download_token` per item
2. **Customer accesses Downloads** → Shows purchased products with versions
3. **Generate signed URL** → Time-limited (7 days), usage-limited (5 downloads)
4. **Track downloads** → Log each download with timestamp
5. **Version updates** → Customer can regenerate URLs for latest version

### File Storage Structure

```
s3://ayla-designs-files/
├── products/
│   ├── {product_id}/
│   │   ├── {variant_id}/
│   │   │   ├── v1.0.0/
│   │   │   │   ├── planner-2025-basic.zip
│   │   │   │   └── manifest.json
│   │   │   ├── v1.0.1/
│   │   │   │   └── ...
│   │   │   └── latest -> v1.0.1/
│   │   └── images/
│   │       ├── cover.webp
│   │       ├── preview-1.webp
│   │       └── ...
└── temp/
    └── signed-downloads/  // Temporary signed URL cache
```

---

## 6. Payment Integration

### Stripe

- **Primary processor** for cards
- Checkout Sessions for secure payment
- Webhooks for order fulfillment
- Customer portal for subscription management (future)

### PayPal

- **Alternative processor** for users without cards
- PayPal Checkout integration
- Webhooks for order confirmation

### Flow

```
Cart → Checkout Page → Select Payment Method
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
      Stripe Checkout               PayPal Checkout
            │                               │
            └───────────────┬───────────────┘
                            ▼
                  Webhook: payment.success
                            │
                            ▼
                    Create Order
                    Generate Download Tokens
                    Send Confirmation Email
                    Emit Kafka Event
```

---

## 7. Automation System (Phased)

### Phase 1 (V1) - Foundation

- **Transactional emails**: Purchase confirmation, download links
- **Tracking pixels**: Meta Pixel, Google Analytics 4
- **Customer segments**: Neo4j-based queries, manual assignment
- **Events**: Kafka topics for all actions

### Phase 1.5 - Basic Automations

- **Abandoned cart recovery**: 1h, 24h, 72h email sequence
- **Post-purchase upsell**: Related products email after purchase
- **Win-back campaigns**: Inactive customer detection

### Phase 2 (V2) - Full Marketing Suite

- **Campaign builder**: Visual email sequence designer
- **A/B testing**: Subject lines, content, timing
- **Advanced segments**: Behavioral + purchase history
- **Analytics dashboard**: Campaign performance, ROI

### Kafka Topics

```
ayla.orders.created
ayla.orders.completed
ayla.orders.refunded
ayla.cart.abandoned
ayla.customer.registered
ayla.customer.segment.entered
ayla.customer.segment.exited
ayla.download.completed
ayla.email.sent
ayla.email.opened
ayla.email.clicked
```

---

## 8. Frontend Architecture

### Route Structure

```
app/
├── [locale]/
│   ├── page.tsx                    # Landing/Home
│   ├── products/
│   │   ├── page.tsx                # Product catalog
│   │   └── [slug]/
│   │       └── page.tsx            # Product detail
│   ├── cart/
│   │   └── page.tsx                # Shopping cart
│   ├── checkout/
│   │   ├── page.tsx                # Checkout flow
│   │   └── success/
│   │       └── page.tsx            # Order confirmation
│   ├── account/
│   │   ├── page.tsx                # Account overview
│   │   ├── orders/
│   │   │   └── page.tsx            # Order history
│   │   ├── downloads/
│   │   │   └── page.tsx            # Downloads center
│   │   └── settings/
│   │       └── page.tsx            # Account settings
│   └── auth/
│       ├── login/
│       │   └── page.tsx
│       ├── register/
│       │   └── page.tsx
│       └── forgot-password/
│           └── page.tsx
│
├── admin/                          # admin.ayladesigns.me
│   └── [locale]/
│       ├── page.tsx                # Dashboard
│       ├── products/
│       │   ├── page.tsx            # Products list
│       │   ├── new/
│       │   │   └── page.tsx        # Create product
│       │   └── [id]/
│       │       └── page.tsx        # Edit product
│       ├── orders/
│       │   ├── page.tsx            # Orders list
│       │   └── [id]/
│       │       └── page.tsx        # Order detail
│       ├── customers/
│       │   ├── page.tsx            # Customers list
│       │   └── [id]/
│       │       └── page.tsx        # Customer detail
│       ├── content/
│       │   └── page.tsx            # CMS for texts
│       ├── promotions/
│       │   └── page.tsx            # Promotions/deals
│       ├── analytics/
│       │   └── page.tsx            # Analytics dashboard
│       └── settings/               # Super Admin only
│           └── page.tsx            # App configuration
```

### Atomic Design Components

```
components/
├── atoms/
│   ├── Button/
│   ├── Input/
│   ├── Avatar/
│   ├── Chip/
│   ├── Badge/
│   ├── Icon/
│   ├── Price/
│   ├── Rating/
│   └── Spinner/
│
├── molecules/
│   ├── ProductPrice/         # Price + discount display
│   ├── SearchBar/
│   ├── FormField/
│   ├── CartItem/
│   ├── ReviewStars/
│   ├── QuantitySelector/
│   ├── CategoryTag/
│   └── DownloadButton/
│
├── organisms/
│   ├── Navbar/
│   ├── Footer/
│   ├── ProductCard/
│   ├── ProductModal/
│   ├── CartDrawer/
│   ├── ReviewCard/
│   ├── CheckoutForm/
│   ├── OrderSummary/
│   ├── CustomerSegmentBuilder/   # Admin
│   ├── ProductForm/              # Admin
│   └── DataTable/                # Admin
│
└── templates/
    ├── StorefrontLayout/
    ├── AdminLayout/
    ├── AuthLayout/
    └── AccountLayout/
```

### State Management (Zustand)

```typescript
// store/slices/
├── authSlice.ts        // User, tokens, roles
├── cartSlice.ts        // Cart items, totals, promo codes
├── uiSlice.ts          // Theme, modals, notifications
├── productSlice.ts     // Product cache, filters, search
└── adminSlice.ts       // Admin-specific state
```

---

## 9. Internationalization

### Supported Locales

- **es** (Spanish) - Primary
- **en** (English) - Secondary

### Message Structure

```
messages/
├── en/
│   ├── common.json         # Shared UI strings
│   ├── home.json           # Landing page
│   ├── products.json       # Product catalog
│   ├── cart.json           # Cart & checkout
│   ├── account.json        # Customer account
│   ├── auth.json           # Authentication
│   ├── admin.json          # Admin panel
│   └── metadata.json       # SEO metadata
└── es/
    └── ... (same structure)
```

---

## 10. Security Considerations

### Storefront (ayladesigns.me)

- Standard auth flow (JWT in httpOnly cookies)
- CSRF protection
- Rate limiting on auth endpoints
- Input validation & sanitization

### Admin Panel (admin.ayladesigns.me)

- **Phase 1**: Same auth as storefront + role check
- **Phase 2** (Hardening):
  - Mandatory TOTP 2FA for all admin users
  - IP whitelist option
  - Session timeout (shorter than customer)
  - Audit logging for all actions
  - Separate refresh token rotation

---

## 11. Implementation Phases

### Phase 1: MVP Storefront

- [ ] Restructure monolithic page into Atomic components
- [ ] Product catalog with categories & filters
- [ ] Product detail with variants
- [ ] Shopping cart (Zustand)
- [ ] Checkout with Stripe
- [ ] Customer registration & login
- [ ] Order confirmation & download links
- [ ] Basic transactional emails

### Phase 2: Admin Panel Foundation

- [ ] Admin routes & layout
- [ ] Products CRUD (with variants)
- [ ] Orders list & detail view
- [ ] Customer list
- [ ] Basic analytics

### Phase 3: Enhanced Features

- [ ] PayPal integration
- [ ] Bundles
- [ ] Promotions/discount codes
- [ ] Customer segments (Neo4j)
- [ ] Downloads center with versioning
- [ ] Content CMS

### Phase 4: Automations

- [ ] Abandoned cart emails
- [ ] Post-purchase sequences
- [ ] Segment-based automations

### Phase 5: Polish & Scale

- [ ] Advanced analytics
- [ ] A/B testing
- [ ] Full marketing suite
- [ ] Admin security hardening

---

## 12. Open Questions

1. **Email provider**: SendGrid vs Resend vs AWS SES?
2. **File storage**: AWS S3 vs Cloudflare R2 vs other?
3. **CDN for product images**: Cloudflare vs CloudFront?
4. **Hosting**: Vercel vs self-hosted vs other?

---

## Appendix: Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Admin architecture | Same app, subdomain | Single codebase, shared components, simpler deployment |
| Product variants | Yes | Enables Basic/Premium tiers, upsell opportunities |
| Bundles | Yes | Cross-sell, higher AOV |
| Payment processors | Stripe + PayPal | Maximum customer coverage |
| Digital delivery | Signed URLs + versioning | Security + customer satisfaction |
| Languages | ES + EN | Dual market, i18n already configured |
| Automations | Phased rollout | Ship MVP fast, add marketing later |
| Graph database | Neo4j (keep) | Perfect for segments, recommendations |

---

*Document created: 2025-12-17*
*Last updated: 2025-12-17*
