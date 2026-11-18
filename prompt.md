# Build Prompt: Landing Page for a "Workstation That Follows You" Subscription

You are building a demand-validation landing page for an early-stage startup idea. Read this whole document before writing code. Work in stages, show me the result after each major stage, and ask before making any decision this document leaves open.

---

## 1. The idea (context)

Traveling consultants work from hotel rooms on a single laptop screen. The startup ships a **"workstation in a box"** (rugged rolling case containing two portable/compact monitors, a universal USB‑C/USB dock, full-size keyboard, mouse, cables, power strip) **directly to the subscriber's hotel**, for a **flat monthly fee**. When they check out, they leave the case at the front desk with a prepaid label; the next kit is already headed to their next hotel.

### Competitive landscape (already researched; use it to sharpen positioning, do not name competitors on the page)
- **OutPost (Austin, TX)** rents dual-monitor kits through partner hotels (e.g., ~$25/day at Omni Austin) and ships kits to a destination per trip via a quote form. No subscription, no published pricing, no itinerary automation.
- Event/AV rental firms (Rentacomputer.com, Meeting Tomorrow) serve organizations and events, quote-based, not individuals.
- Base Case sells portable multi-monitor hardware you buy and carry.

### Our differentiation (the page must make these obvious)
1. **One monthly subscription**, not per-trip quotes or daily fees.
2. **It follows your itinerary.** Send your trips once (forward confirmation emails / connect calendar, *future feature*) and kits arrive before you do.
3. **Nothing to carry.** No 15 lb monitor in your carry-on.
4. **Zero setup friction.** One cable to the laptop; Mac and PC.

### Primary audience
**Individual traveling consultants** (management/IT/Big 4 consultants, auditors, sales engineers) who travel Mon–Thu most weeks and often expense equipment. Secondary audiences (firms, hotels) get at most a one-line footer mention ("Travel program manager or hotel? Get in touch.").

### Goal of the page
Validate demand, **not** sell. Success = email signups + willingness-to-pay data. Every section should funnel to the waitlist form.

---

## 2. Technical requirements

- **Stack:** Plain HTML, CSS, and vanilla JavaScript. **No frameworks, no build step, no npm dependencies.** Must work by opening `index.html` locally and when served from GitHub Pages.
- **Hosting:** GitHub Pages from the `main` branch root (or `/docs` — pick one and document it).
- **Responsive:** mobile-first; looks great at 375px, 768px, 1280px+.
- **Performance:** total page weight < 500 KB excluding fonts; no layout shift; images lazy-loaded; Lighthouse ≥ 90 on Performance, Accessibility, Best Practices, SEO.
- **Accessibility:** semantic landmarks, labeled form fields, visible focus states, AA color contrast, `prefers-reduced-motion` respected, works without JS (form still submits).
- **Fonts:** at most one Google Font family (or system font stack). 
- **Images:** no stock photos of real people, no third-party logos/trademarks. Use inline SVG illustrations or simple CSS/SVG product mockups you create (e.g., a stylized rolling case opening to reveal two monitors). Original art only.
- **SEO/social:** title, meta description, Open Graph + Twitter card tags, a generated `og-image.png` (1200×630) made from an SVG you design, favicon (SVG + PNG fallback).
- **Analytics (optional, ask me first):** if I approve, add a privacy-friendly free counter (e.g., GoatCounter) behind a single config value; otherwise omit.

---

## 3. Waitlist capture: Google Form backend

GitHub Pages has no backend, so the page's own styled HTML form will **POST directly to a Google Form**, with responses landing in a linked Google Sheet.

### Implementation
1. Build the form in our own HTML/CSS (do **not** iframe-embed the Google Form UI).
2. Form `action` = `https://docs.google.com/forms/d/e/<FORM_ID>/formResponse`, `method="POST"`.
3. Each input's `name` = the Google Form's `entry.<NUMBER>` ID.
4. With JS: intercept submit, `fetch(action, { method: 'POST', mode: 'no-cors', body: new FormData(form) })`, then show an inline success state (the response is opaque — treat a resolved fetch as success; show an error message only on network failure). Without JS: form posts normally (target a hidden iframe or allow redirect to Google's confirmation page).
5. Put `FORM_ID` and every `entry.*` ID in **one config block** at the top of `js/config.js` (and mirror into the HTML `name` attributes, or set them from config at load) so I can swap them in one place.
6. Ship with **placeholder IDs** and a clear `README` section titled "Connecting your Google Form" with step-by-step instructions:
   - Create the Google Form with the exact questions below (same order, types).
   - Link it to a Google Sheet (Responses → Link to Sheets).
   - Get entry IDs via "⋮ → Get pre-filled link", fill dummy answers, copy the URL, read the `entry.XXXX` params.
   - Paste `FORM_ID` and entry IDs into `js/config.js`.
   - Test a submission and confirm it lands in the Sheet.
7. Add a honeypot field (hidden text input; if filled, JS silently drops the submission) for basic spam protection.

### Form fields (keep it short: required fields marked *)
| Field | Type | Notes |
|---|---|---|
| Email * | email | |
| First name | text | |
| Role | select | Management consultant · IT/tech consultant · Audit/accounting · Sales/sales engineering · Other |
| Nights in hotels per month * | select | 1–4 · 5–9 · 10–15 · 16+ |
| Would your employer reimburse this? | select | Yes · Probably · No · I'm self-employed |
| Which plan would you pick? * | radio | the three pricing tiers below + "None at these prices" |
| What would you pay per month? | select | <$50 · $50–99 · $100–149 · $150–199 · $200+ |
| Your setup must-haves | checkboxes | Two monitors · One large/ultrawide monitor · Mechanical/full keyboard · Webcam + light · Laptop stand · Mac-specific dock |
| Anything else? | textarea | optional |
| (UTM source) | hidden | auto-filled from `?utm_source=` / `?ref=` in the URL, so I can tell which channel (LinkedIn post, Reddit, friend) each signup came from |
| (Plan clicked) | hidden | auto-filled when a visitor clicks a pricing card's CTA, which scrolls to the form and preselects that plan |

---

## 4. Brand name: propose first, then use a placeholder

**Before building**, propose **8–10 name candidates** with: a one-line rationale, tone (e.g., premium/playful/utilitarian), and a suggested `.com` / `.co` / `.app` domain pattern (note that I must verify availability myself; do not claim availability). Mix styles: descriptive ("DeskDrop"), evocative ("Basecamp"-style), and invented words. Avoid names that collide with known companies (e.g., "OutPost"). Give your top 3 picks.

Then build the site using the placeholder **`[BRAND]`**, centralized so renaming is one find-and-replace (document how in the README). Also define a short tagline placeholder; propose 3 tagline options alongside the names.

---

## 5. Page structure & copy

Write all copy yourself: confident, concrete, no hype words ("revolutionary," "game-changing"), written for a tired consultant on a Thursday-night flight home. Short sentences. Use "you."

1. **Sticky header:** logo wordmark (SVG text), anchor links (How it works · Pricing · FAQ), "Join the waitlist" button.
2. **Hero:**
   - Headline in the spirit of: *"Your desk setup, waiting at every hotel."*
   - Subhead: one sentence on dual monitors + keyboard + dock shipped to your hotel for one monthly price; nothing to carry.
   - Primary CTA: "Get early access" (scrolls to form). Secondary: "See how it works."
   - Illustration: original SVG of the open case with two monitors and a laptop.
   - Small trust line: "Launching first in [major US consulting hubs]. Founding members get locked-in pricing."
3. **Problem:** 3 short pain points (hunched over a 14" screen for 10 hours; hotel desks; hauling a portable monitor through TSA). Optional stat-free; **do not invent statistics**.
4. **How it works (3–4 steps with icons):** Subscribe → Share your trips → Kit is at the front desk when you check in → Leave it at checkout with the prepaid label; next one's already on its way.
5. **What's in the box:** visual checklist: two monitors, universal USB‑C/USB dock (Mac & PC, one cable incl. laptop charging), full-size keyboard, mouse, power strip, cables, rolling hard case. Note: "Exact hardware finalized with founding members."
6. **Pricing (hypotheses to test, clearly labeled "Founding member pricing (planned)"):**
   - **Occasional**: $79/mo, up to 2 hotel stays/month.
   - **Road Warrior** *(highlighted, "Most popular")*: $149/mo, unlimited stays, priority delivery.
   - **Pay per trip**: $35/stay, no subscription (anchor that makes subscriptions look good).
   - Each card's CTA ("Reserve this plan") preselects that plan in the form. Put prices in `js/config.js` so I can change them without touching markup.
   - Line under cards: "Nothing is charged today. We're gathering interest before launch."
7. **Comparison strip (no competitor names):** small table: *Carry a portable monitor* vs *Rent per day at select hotels* vs *[BRAND]*: rows for screens, setup weight carried, works at any hotel, monthly cost predictability.
8. **Expense-friendly callout:** "Built to be expensed": monthly invoice, receipts by email. (Planned features; phrase as "will.")
9. **FAQ (accordion using `<details>/<summary>`, no JS needed):** What if my hotel won't hold packages? · Mac and Windows? · What if something breaks? · How far ahead do I need to book? · Which cities? · Can my company pay? · Is the equipment cleaned/sanitized between users? · When do you launch? Answers should be honest about being pre-launch.
10. **Waitlist form section** (Section 3 spec). Heading like "Become a founding member." Success state: thank-you message + "Know a fellow road warrior?" with a copy-link-to-clipboard button (link includes `?ref=friend`).
11. **Footer:** © year [BRAND], contact email placeholder `hello@[domain]`, one line for firms/hotels, link to a simple `privacy.html` (plain-language: what we collect via the form, stored in Google Sheets, used only to contact you about launch, email to delete).

---

## 6. Visual design direction

- Feel: **premium travel gear meets clean SaaS**: think durable, calm, trustworthy. Not neon startup.
- Palette (CSS custom properties in `:root`, easily changed): deep navy or charcoal primary, one warm accent (amber/orange like a hard case latch), off-white backgrounds, plus a dark mode via `prefers-color-scheme`.
- Generous whitespace, 8px spacing scale, max content width ~1120px, large readable type (body ≥ 17px).
- Subtle motion only (fade/slide on scroll via IntersectionObserver), disabled under `prefers-reduced-motion`.
- All illustrations are inline SVG using `currentColor` / CSS variables so they theme with dark mode.

---

## 7. File structure

```
/
├── index.html
├── privacy.html
├── 404.html
├── css/
│   └── styles.css
├── js/
│   ├── config.js      # BRAND, prices, Google Form ID + entry IDs, analytics toggle
│   └── main.js        # form submit, plan preselect, UTM capture, copy-link, scroll effects
├── assets/
│   ├── favicon.svg
│   ├── favicon.png
│   ├── og-image.svg
│   └── og-image.png
├── .nojekyll
└── README.md
```

---

## 8. README contents

1. What this is (one paragraph).
2. Run locally (`python3 -m http.server` and open the URL).
3. **Deploy to GitHub Pages:** create repo, push, Settings → Pages → Deploy from branch `main` / root, wait, visit `https://<user>.github.io/<repo>/`. Note on relative paths so it works under a repo subpath.
4. **Custom domain (optional):** `CNAME` file + DNS records.
5. **Connecting your Google Form** (detailed steps from Section 3).
6. **Changing brand name, tagline, prices** (config + find/replace instructions).
7. **Sharing with tracking:** example links like `?utm_source=linkedin`, `?utm_source=reddit`, `?ref=friend`.
8. How to read results in the Sheet (suggest a pivot: plan choice × nights/month × reimbursable).

---

## 9. Process & checkpoints

Work in this order and **pause for my review** at each ⏸:

1. Propose names + taglines (Section 4). ⏸
2. Scaffold files, config, base styles, header/hero with illustration. ⏸ (Show a screenshot or describe how to preview.)
3. Remaining sections + copy. ⏸
4. Form wiring with placeholder IDs, honeypot, UTM/plan hidden fields, success state, no-JS fallback.
5. Privacy page, 404, OG image, favicon, README.
6. QA pass (below), then summarize what I need to do manually (Google Form setup, repo creation, Pages settings). ⏸

Initialize a git repo and commit at each stage with clear messages. Do **not** push or create a GitHub repo without asking me.

---

## 10. QA checklist (must all pass before calling it done)

- [ ] Page opens from the filesystem and via local server with no console errors.
- [ ] All anchor links and CTAs scroll to the correct section; pricing CTAs preselect the right plan.
- [ ] Form: required-field validation works; honeypot blocks; JS path shows success state; no-JS path still submits.
- [ ] UTM/ref params populate the hidden field.
- [ ] Responsive at 375 / 768 / 1280px with no horizontal scroll.
- [ ] Dark mode and reduced-motion both behave.
- [ ] Keyboard-only navigation reaches every interactive element with visible focus.
- [ ] HTML validates (W3C validator or `npx html-validate` if available, without adding it as a project dependency).
- [ ] Lighthouse scores ≥ 90 (run via Chrome or `npx lighthouse` if available; report scores).
- [ ] No invented statistics, testimonials, customer logos, or "as seen in" claims anywhere. (We're pre-launch; fake social proof is off-limits.)
- [ ] All relative paths work under a GitHub Pages repo subpath.

---

## 11. Out of scope (for now)

Payments, user accounts, itinerary/email parsing, calendar integration, a hotel-partner portal, CMS, and any backend. Mention these as "coming later" only where the copy calls for it.
