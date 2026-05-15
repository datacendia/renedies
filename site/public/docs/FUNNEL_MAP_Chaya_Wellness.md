# 🎣 Chaya Wellness Funnel Map — Reverse-Engineered

> **Source:** `The_30_Day_Total_Reset.pdf` + inferred standard wellness-creator funnel mechanics
> **Date:** May 14, 2026
> **Purpose:** Map every stage of the customer journey so Remedia can build a superior version

---

## 🗺️ The Complete Funnel — Bird's Eye View

```
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 0 — ATTENTION                                            │
│  Instagram Reels + TikTok                                        │
│  "I felt fine but my labs were normal" hook content              │
└──────────────────────────┬──────────────────────────────────────┘
                           │ swipe up / bio link
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 1 — CAPTURE                                              │
│  chayawellness.com landing page                                  │
│  "Get the free chapter" or "Free Quiz" email gate                │
└──────────────────────────┬──────────────────────────────────────┘
                           │ email captured
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 2 — NURTURE                                              │
│  5–7 day email sequence: pain → story → free value → CTA         │
└──────────────────────────┬──────────────────────────────────────┘
                           │ trust + curiosity built
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 3 — LOW-TICKET CONVERSION                                │
│  $9–$27 PDF book "The 30 Day Total Reset"                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │ buyer becomes customer
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 4 — MID-TICKET UPSELL                                    │
│  $47–$97 "Recipe & Ritual Companion Guide"                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │ deeper commitment
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 5 — RECURRING BACK-END                                   │
│  Oravida supplement affiliate ($60–$120/mo recurring)            │
└──────────────────────────┬──────────────────────────────────────┘
                           │ long-term LTV
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 6 — COMMUNITY / LOOP                                     │
│  Instagram engagement → testimonials → fuels Stage 0 content     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📍 Stage-by-Stage Breakdown

### **STAGE 0 — Attention** (Top of Funnel)

**Channel:** Instagram (@chayawellness) — confirmed in PDF page 60 + 67

**Content patterns observed (inferred from book voice):**
- Symptom-first hooks: "If you're bloated after every meal, your gut isn't broken — it's overloaded."
- Validation hooks: "Your doctor said you're fine. You're not."
- Tradition-curiosity hooks: "Why does ginger work? The Talmud told us 2,000 years ago."
- Ritual demonstrations: morning lemon water, mikvah bath, Shabbat candle
- Recipe reels: bone broth, golden milk, fermented foods

**Inferred posting cadence:** 4–7×/week (typical for wellness creators at this tier)

**Goal of this stage:** Build identity attachment ("I'm a Chaya Wellness woman") and drive bio-link clicks.

**Remedia equivalent:** Already in motion via the 5 localized TikTok/Reels videos in the production guide. **Advantage: you can produce 5 cultural variants per piece of content; she can produce one.**

---

### **STAGE 1 — Capture** (Landing Page)

**Destination:** chayawellness.com

**Inferred mechanics** (standard wellness-creator pattern):
- Hero: "Take back your energy. The free first chapter is yours."
- Above the fold: book cover image + email field + single CTA
- Below: 3–5 testimonials with before/after framing
- Free magnet options likely include:
  - **First chapter PDF download** (extracted from the 67-page book)
  - **Symptom quiz** ("Which of the 4 systems is breaking down for you?")
  - **5-day mini reset email course**

**Tools she likely uses:**
- Email: ConvertKit / Kit / Flodesk / Mailchimp
- Landing: Carrd / Showit / Squarespace / Kajabi
- Quiz (if any): Interact / Typeform

**Conversion rate benchmark:** 25–40% for warm Instagram traffic; 8–15% for cold ads.

**Remedia counter-move:**
- Your `/reset` landing page can offer a **symptom-based interactive quiz** (you already have a quiz route in `site/app/quiz/`)
- Multi-language email capture (she can't match)
- Body-map interactive lead magnet (technical moat)

---

### **STAGE 2 — Nurture** (Email Sequence)

**Inferred sequence** (industry-standard 5–7 day welcome flow):

| Day | Subject Line Pattern | Goal |
|-----|---------------------|------|
| 0 | "Here's your free chapter (and a note from me)" | Deliver lead magnet + set tone |
| 1 | "The morning I stopped being told I was fine" | Origin story emotion |
| 2 | "The 4 systems that break down first" | Educational value |
| 3 | "Why ancient women didn't feel like this" | Authority + tradition hook |
| 4 | "What changed for me on Day 7" | Social proof / transformation tease |
| 5 | "The full Reset — limited bonus inside" | First buy CTA |
| 6 | "Last chance: bonus disappears tonight" | Urgency close |
| 7 | (post-purchase) "Welcome — here's how to start" or (non-buyer) "Free reset checklist" | Branch logic |

**Tone signals from PDF:**
- Personal ("I was 33...")
- Authoritative but not preachy
- Spiritual but not exclusionary ("you don't have to be Jewish or religious")
- Validating ("your body isn't broken")

**Remedia counter-move:** Same sequence architecture, but the differentiation is in step 3 — instead of "ancient Jewish women," offer the **reader's choice** of tradition. Day 3 email could be: "Which tradition speaks to you? Indian, Chinese, Japanese, Andean, or Mediterranean? Reply with one word." That **segmentation question alone** unlocks personalized downstream content she can't match.

---

### **STAGE 3 — Low-Ticket Conversion** ($9–$27)

**Product:** The 30 Day Total Reset PDF (67 pages)

**Pricing strategy (inferred):**
- Likely $9–$17 standalone
- $27 with bonus (companion preview / checklist / video module)
- Possibly free in exchange for upsell aggressiveness

**Why this stage matters:** A customer who has paid you $9 is **10× more likely** to buy your $97 product than a non-buyer. This is the classic Russell Brunson / Frank Kern "trip-wire" buyer-identification step.

**What the PDF is engineered to do internally:**
1. Establish her as the expert
2. Tease specific protocols without delivering full execution detail
3. Reference the companion guide ~8 times throughout (I counted from extract)
4. Reference Oravida supplement on page 60 with strong personal endorsement
5. Drive Instagram follow (page 60 explicit CTA)

**The "Companion Guide" tease is the key mechanism.** From page 9:
> "This book tells you what to do and why. The companion 30 Day Total Reset: Recipe & Ritual Guide tells you exactly how—with complete meal plans, shopping lists, tea and tonic recipes, and step-by-step daily rituals for each week."

This is a **deliberate completeness gap**. The book makes you want execution; the companion sells it.

**Remedia counter-move:** Be generous-first instead. Give away the full execution in the free PDF. Monetize elsewhere (personalization, products, practitioner directory, premium video courses). **Generosity is itself a competitive moat** in a market full of paywalled half-truths.

---

### **STAGE 4 — Mid-Ticket Upsell** ($47–$97)

**Product:** The 30 Day Total Reset: Recipe & Ritual Guide (companion)

**Delivery mechanisms (likely combo):**
- Order bump on book checkout ("Add the companion for $27 more")
- Day-of-purchase upsell page ("One-time offer: 50% off")
- Post-purchase email day 7 ("How are you doing? The companion makes Week 2 easy")
- Inside the book, ~8 explicit mentions ("see the companion guide for...")

**Inferred contents:**
- Full meal plans per week
- Shopping lists per week
- Tea & tonic recipes referenced in the book
- Step-by-step ritual instructions
- Possibly a printable calendar / habit tracker

**Conversion rate benchmark:** 15–25% of book buyers also buy the companion.

**Why this works:** The book creates a problem ("I want to do this but I don't know exactly how"); the companion solves it. Classic create-curiosity-then-resolve loop.

**Remedia counter-move:** Two paths:
1. **Beat her on price:** Give the companion-equivalent content away in the free PDF. Monetize via deeper tiers.
2. **Beat her on format:** A web-app companion (existing `site/`) is more useful than a PDF companion. Real interactivity, habit tracking, body-map symptom routing.

---

### **STAGE 5 — Recurring Back-End** (The Real Business)

**Product:** Oravida 30 Day Total Reset supplement

**From PDF page 60 verbatim** (transcribed for analysis, not for copying):
> "I use and recommend the Oravida 30 Day Total Reset—a supplement formulated with berberine, nicotinamide riboside, and gut-supporting compounds designed to work alongside this program."

**What this is:** An affiliate / partnership relationship. Oravida is a real supplement brand. Chaya's PDF is essentially a **content-marketing vehicle for Oravida**.

**Likely commission structure:**
- 20–40% recurring affiliate cut on monthly supplement subscriptions
- $60–$120/month retail price → $12–$48/customer/month to Chaya
- 100 customers retained 12 months = $14,400–$57,600/year recurring

**Why this is her real business model:**
- The book is $9–$27 (one-time)
- The companion is $47–$97 (one-time)
- The supplement is **$60–$120/month, recurring**

Lifetime value math:
- Book buyer only: ~$15
- Book + companion: ~$80
- Book + companion + 6-month supplement: ~$480
- **Book + companion + 24-month supplement: $1,640**

The supplement is **20× the LTV** of the book alone. The book is bait.

**Remedia counter-move (ethical):**
- Be transparent: "We do not sell supplements. We have no affiliate relationships." This becomes a trust positioning advantage.
- Or be honest about commercial relationships if you do partner: full disclosure, picked-for-quality not for-commission.
- Or monetize differently entirely: practitioner directory commissions, premium video courses, sponsored content with full disclosure, group programs, retreats.

**Strategic insight:** Chaya is essentially an affiliate marketer wrapped in a wellness-educator brand. You can either replicate this model with cleaner ethics, or differentiate by being the "no-affiliate" trustworthy second opinion.

---

### **STAGE 6 — Community / Content Loop**

**Mechanism:**
1. Customer completes the reset
2. Posts about results on Instagram, tags @chayawellness
3. Chaya reposts → social proof for Stage 0
4. New visitors see real testimonials → enter the funnel
5. Loop continues

**Why this works:** Wellness purchases are identity purchases. Customers want to be seen as "the kind of woman who does this." Tagging creates that identity broadcast.

**Remedia counter-move:** Multilingual UGC. A testimonial in Hindi from a Mumbai woman, a Spanish one from a Lima woman, a Mandarin one from a Shanghai woman — each unlocks a TAM Chaya can't touch. Build a `#myremediareset` hashtag from day one and repost across all 5 markets.

---

## 🧮 Estimated Funnel Economics (Conservative)

Assuming a wellness creator at her apparent tier (~50–100k Instagram followers, ~2-yr operation):

| Metric | Estimate |
|--------|---------|
| Monthly Instagram impressions | 500k–2M |
| Monthly landing page visits | 8k–25k |
| Email opt-in rate | 25–35% |
| Monthly new email subs | 2k–8k |
| Free → book conversion | 5–12% |
| Monthly book buyers | 100–950 |
| Book → companion attach | 15–25% |
| Monthly companion buyers | 15–240 |
| Book buyer → supplement | 10–20% |
| Monthly new supplement subs | 10–190 |
| Supplement retention (6mo avg) | 50–70% |
| Monthly recurring revenue (supplement affiliate) | $3k–$45k |
| Annual revenue (all streams, conservative midpoint) | **$80k–$400k** |

*Note: These are rough industry-benchmark estimates, not insider information.*

---

## 🎯 The Three Highest-Leverage Counter-Moves

### 1. **Symptom-First Acquisition (Beats Her Identity-First)**
She wins women who self-identify as "interested in Jewish wisdom." You can win **every woman with bloating** regardless of her cultural identity. Make symptoms the entry point, not tradition.

### 2. **Generosity-First Lead Magnet (Beats Her Tease-First)**
Give away the complete 30-day reset. Recipes, rituals, meal plans, everything. Monetize via the next layer: personalization, practitioners, retreats, premium media. People who are sick of being teased will choose you.

### 3. **No-Affiliate Positioning (Beats Her Hidden-Sponsor)**
"We have no supplement affiliates. We recommend whole foods first, and when we suggest a product, you'll see exactly why and any commercial relationship we have." Trust as a moat.

---

## 📦 Tooling Checklist to Build Your Equivalent

| Need | Tool (low-cost) | Tool (mid-tier) |
|------|------------------|-----------------|
| Email + sequences | ConvertKit / Kit (free–$29/mo) | Klaviyo ($45+/mo) |
| Landing page | Existing Next.js `/reset` route | Carrd / Webflow |
| Payment | Stripe checkout link | Stripe + LemonSqueezy / Gumroad |
| PDF delivery | Email attachment / Gumroad | Stripe + automated email |
| Quiz | TypeForm / Interact | Custom in your Next.js app |
| Analytics | Plausible / PostHog | Mixpanel + GA4 |
| Community | Discord / Skool ($89/mo) | Circle / Mighty Networks |

You can run the entire funnel for **<$100/month** at launch.

---

## 📁 References

- Source PDF: `c:\Users\User\Remidies\The_30_Day_Total_Reset.pdf`
- Extract: `c:\Users\User\Remidies\_pdf_temp\reset_extracted.txt`
- Competitive analysis: `c:\Users\User\Remidies\COMPETITIVE_ANALYSIS_Chaya_Wellness.md`
