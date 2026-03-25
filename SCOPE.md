# Costra — Track spending. Expose fees. Take control.

## One-Liner
Text what you spent. Know where your money goes. No app download.

## Why This Works

### Market Gap
- **22seven/Vault22**: App-based, requires bank linking (privacy concerns), Old Mutual owned
- **Goodbudget**: Envelope system, not SA-specific, requires app
- **Banking apps**: Basic categorisation, clunky, no proactive coaching
- **Nothing exists on WhatsApp** for budgeting in SA

### Our Advantage (proven by FitSorted)
- No app download (WhatsApp already installed on 96% of SA smartphones)
- Zero data usage concerns
- User-initiated messaging = free under WhatsApp Business API
- Daily logging habit = high retention
- SA-specific (Woolworths, Checkers, petrol prices, loadshedding costs)

### Why Freemium + Affiliates > Pure Subscription
- Free tier builds massive user base (10x more users than paid-only)
- Investment affiliate links convert from engaged users who are already thinking about money
- Ad revenue from financial services (insurance, banking, credit)
- Paid tier for power users who want more

---

## Revenue Model

### 1. Investment Affiliate Links (Primary)
| Partner | Commission | Trigger |
|---------|-----------|---------|
| EasyEquities | R50-100/signup | User asks about investing or has savings |
| Satrix | TBC | TFSA/ETF recommendations |
| VALR/Luno | R300-500/funded | Crypto savings suggestions |
| Old Mutual | R200-500/lead | Retirement/RA recommendations |
| Sanlam | R200-500/lead | Insurance products |
| Capitec/TymeBank | R50-100/account | Banking recommendations |

**How it works**: Bot notices patterns → makes contextual suggestions
- "You've saved R2,400 this month. Want to put R500 into a TFSA? EasyEquities lets you start with R1 →"
- "You spent R890 on data this month. TymeBank gives you free data when you save →"
- "Your emergency fund is growing! Here's how to invest it tax-free →"

### 2. Financial Services Ads (Secondary)
- Weekly "Money Tip" messages with sponsor mention
- Insurance comparison prompts ("You spend R1,200/mo on medical. Getting the best deal?")
- Loan/credit offers to users with good spending habits (ethical — only to those who can afford it)

### 3. Premium Tier — R49/mo
- Detailed spending reports (weekly/monthly)
- Budget coaching (AI suggestions to cut spending)
- Bill reminders & recurring expense tracking
- Savings goals with progress tracking
- Export to spreadsheet
- No ads

### Revenue Projections (Conservative)
| Milestone | Users | Free | Paid | Affiliate Rev | Sub Rev | Total |
|-----------|-------|------|------|---------------|---------|-------|
| Month 3 | 500 | 450 | 50 | R2,500 | R2,450 | R4,950 |
| Month 6 | 2,000 | 1,700 | 300 | R15,000 | R14,700 | R29,700 |
| Month 12 | 5,000 | 4,250 | 750 | R40,000 | R36,750 | R76,750 |

*Assumes 2% affiliate conversion/month on free users, 15% paid conversion*

---

## User Flow

### Onboarding (< 2 minutes)
```
User: Hi
Bot: 👋 Welcome to Costra! I help you track spending on WhatsApp.

Quick setup — what's your monthly take-home pay?
User: R25000
Bot: Got it. Want me to suggest a budget split? (50/30/20 rule)
User: Yes
Bot: Here's your plan:
  🏠 Needs (50%): R12,500/mo
  🎯 Wants (30%): R7,500/mo  
  💰 Savings (20%): R5,000/mo

That's R413/day for spending. I'll track everything you send me.

Just text what you spent, like: "R85 Woolworths groceries"
```

### Daily Usage
```
User: R65 petrol
Bot: ✅ R65 — Transport 🚗
     Today: R165 spent | R248 left

User: R180 Woolworths
Bot: ✅ R180 — Groceries 🛒
     Today: R345 spent | R68 left
     ⚠️ Close to daily limit

User: R45 Nando's
Bot: ✅ R45 — Eating Out 🍗
     Today: R390 spent | R23 left
     📊 You've spent R890 on eating out this month (12% of income)
```

### Morning Check-in (7:00 AM)
```
Bot: ☀️ Morning! Here's your Tuesday budget:

💰 Daily budget: R413
📊 Yesterday: R390 (under budget ✅)
📅 This week: R1,850 / R2,891
💳 Month so far: R8,200 / R25,000

Tip: You've spent R2,100 on eating out this month.
Cooking 3 meals at home could save R600+ 🍳
```

### Evening Summary (8:00 PM)
```
Bot: 📊 Today's spending:

🛒 Groceries: R180
🚗 Transport: R65  
🍗 Eating Out: R45
📱 Airtime: R29

Total: R319 (R94 under budget ✅)
Month progress: ████████░░ 78% spent, 8 days left
```

### Weekly Report (Sunday 9 AM)
```
Bot: 📋 Week in Review

Total spent: R2,450 / R2,891 budget ✅

Top categories:
1. 🛒 Groceries: R890 (36%)
2. 🍗 Eating Out: R520 (21%)  
3. 🚗 Transport: R380 (16%)
4. 📱 Data/Airtime: R200 (8%)
5. 🎉 Entertainment: R460 (19%)

💡 Eating out is 21% of your weekly spend.
   Even cutting 2 meals out saves R200/week = R800/month.

💰 At this rate, you'll save R3,200 this month.
   Want to put it in a TFSA? Start with R50 → [EasyEquities link]
```

---

## SA-Specific Categories
- 🛒 Groceries (Woolworths, Checkers, Pick n Pay, Shoprite, Spar)
- 🍗 Eating Out (Nando's, KFC, Steers, Spur, McDonald's, Uber Eats)
- 🚗 Transport (petrol, Uber, taxi, e-toll, car wash)
- 📱 Data & Airtime (Vodacom, MTN, Cell C, Telkom)
- 🏠 Housing (rent, bond, rates, levy)
- ⚡ Utilities (electricity, water, fibre, DSTV)
- 🎉 Entertainment (movies, drinks, nights out, streaming)
- 👕 Shopping (clothes, shoes, Mr Price, Zara)
- 💊 Health (medical aid, pharmacy, doctor)
- 📚 Education (school fees, courses, books)
- 🍺 Alcohol (separate from eating out — important for SA market)
- 🔌 Load shedding (generator fuel, inverter, candles)

**Auto-detection**: "R85 Woolworths" → Groceries, "R65 Shell" → Transport, "R180 Nando's" → Eating Out

---

## Technical Scope

### Architecture (fork of FitSorted)
```
WhatsApp Business API (existing setup)
    ↓
Node.js bot (adapted from FitSorted bot.js)
    ↓
Supabase (new tables: expenses, budgets, categories, goals)
    ↓
GitHub Pages (landing page + dashboard PWA)
```

### What We Reuse from FitSorted
- WhatsApp Business API connection & message handling
- User management & onboarding flow
- Morning/evening check-in cron system
- Supabase integration pattern
- PM2 process management
- Landing page template
- PWA dashboard template

### What's New
- Expense parsing (amount + merchant + category)
- Budget calculation engine
- Category auto-detection (SA merchants database)
- Recurring expense tracking
- Savings goal tracking
- Affiliate link insertion logic
- Ad/sponsor message system

### Database Schema (Supabase)
```sql
-- Users
users (id, phone, name, monthly_income, budget_split, tier, created_at)

-- Expenses  
expenses (id, user_id, amount, description, category, merchant, created_at)

-- Budgets
budgets (id, user_id, category, monthly_limit, created_at)

-- Recurring
recurring (id, user_id, description, amount, category, frequency, next_due)

-- Goals
goals (id, user_id, name, target_amount, current_amount, deadline)
```

### Build Estimate
| Task | Time |
|------|------|
| Fork FitSorted bot, strip food logic | 1 hour |
| Expense parser (amount + merchant + category) | 2 hours |
| SA merchant database (auto-categorisation) | 1 hour |
| Budget engine (daily/weekly/monthly limits) | 2 hours |
| Morning check-in + evening summary | 1 hour |
| Supabase schema + user management | 1 hour |
| Onboarding flow | 1 hour |
| Landing page (costra.co.za) | 1 hour |
| Affiliate link integration | 1 hour |
| Testing & polish | 2 hours |
| **Total** | **~13 hours** |

Weekend build. MVP ready in 2 days.

---

## Domain & Branding
- **Name**: Costra
- **Domain**: costra.co.za (check availability)
- **WhatsApp**: New number on existing Meta Business account
- **Tagline**: "Know where your money goes. No app needed."
- **Colour**: Green (money) — #22c55e

## Launch Strategy
1. **Week 1**: Build MVP, test with Brandon + 5 friends
2. **Week 2**: Landing page live, soft launch to FitSorted users ("Same team, new bot")
3. **Week 3**: Reddit r/southafrica, r/PersonalFinanceZA posts
4. **Week 4**: TikTok content (same playbook as FitSorted — "I tracked my spending for 30 days")

## Cross-Sell Opportunities
- FitSorted users → "Track your food AND your wallet"
- Costra users → "Spending too much on takeout? Track calories too"
- Bundle: R59/mo for both (vs R85 separate)

---

---

## Phase 2: Bank-Linked PWA Dashboard

### The Vision
Users link their bank account once → transactions auto-import → PWA shows full spending dashboard. WhatsApp stays the daily interface, PWA is the "open when you want the big picture" view.

### SA Open Banking Landscape (March 2026)

| Provider | What They Offer | Access | Best For |
|----------|----------------|--------|----------|
| **Investec Programmable Banking** | Full transaction API, balances, card controls | Free for Investec clients, developer portal open | Investec clients (higher income demo) |
| **Capitec Pay / Open Banking** | Transaction data via consent API | Via partners (Vault22 has it), piloting 3rd party access | Mass market (16M+ clients) |
| **Stitch (stitch.money)** | Payment gateway + financial data aggregation | Enterprise API, apply for access | Multi-bank aggregation |
| **Vault22 (ex-22seven)** | Already aggregates FNB, Nedbank, Capitec, Investec, Standard Bank | They're the competitor, not a partner | N/A (competitor) |

### Realistic Integration Path

**Phase 2a — Investec (quick win)**
- Only SA bank with truly open developer APIs
- Free access for any Investec account holder
- Transaction history, balances, account info via REST API
- OAuth2 flow → user authorises → we pull transactions
- **Limitation**: Only ~1.7M Investec clients (higher income segment)
- **Build time**: 1-2 days (well-documented API)

**Phase 2b — Stitch Financial Data API**
- Stitch started as a financial data aggregation company (like Plaid for SA)
- Supports multiple banks via single API
- Need to apply for access (enterprise-focused)
- Would cover: FNB, Nedbank, Capitec, Standard Bank, Absa
- **Cost**: Per-API-call pricing (need to negotiate)
- **Build time**: 1 week (once approved)

**Phase 2c — Statement Upload (universal fallback)**
- Users upload bank statement PDF/CSV via PWA
- We parse it (most SA banks have standard formats)
- Works for ALL banks with zero API dependency
- Less sexy but 100% reliable
- **Build time**: 2-3 days

### Recommended Rollout Order
1. **Launch**: Manual logging via WhatsApp (MVP)
2. **Month 1**: Statement upload on PWA (covers everyone)
3. **Month 2**: Investec API integration (quick win, higher-value users)
4. **Month 3+**: Apply to Stitch for multi-bank API access

### PWA Dashboard Features
```
costra.co.za/app (or app.costra.co.za)

├── Dashboard (overview)
│   ├── Monthly spending vs budget (donut chart)
│   ├── Daily spending trend (line graph)
│   ├── Category breakdown (bar chart)
│   └── Savings rate %
│
├── Transactions (feed)
│   ├── Auto-imported from bank API
│   ├── Manual entries from WhatsApp
│   ├── Category tags (editable)
│   └── Search & filter
│
├── Budget (set limits)
│   ├── Category budgets
│   ├── Progress bars
│   └── Alerts when close to limit
│
├── Insights (AI-powered)
│   ├── "You spend 23% more on Fridays"
│   ├── "Uber Eats is your fastest growing expense"
│   ├── "You could save R1,200/mo by switching to..."
│   └── Affiliate recommendations (contextual)
│
├── Goals
│   ├── Emergency fund progress
│   ├── Holiday savings
│   ├── Debt payoff tracker
│   └── Investment milestones
│
└── Settings
    ├── Link bank account
    ├── Upload statement
    ├── Notification preferences
    └── Export data
```

### Tech Stack for PWA
- **Frontend**: React/Next.js (same pattern as FitSorted PWA)
- **Backend**: Supabase (existing)
- **Auth**: WhatsApp number as primary key (link via OTP)
- **Bank API**: Investec SDK → Stitch SDK → PDF parser fallback
- **Charts**: Chart.js or Recharts
- **Hosting**: GitHub Pages (static) or Vercel (if SSR needed)

### Privacy & Security (Critical for Financial Data)
- Bank credentials NEVER stored (OAuth token only, revocable)
- All financial data encrypted at rest in Supabase
- Statement uploads processed and deleted (don't store PDFs)
- Clear privacy policy (POPIA compliant)
- User can delete all data at any time
- No selling of transaction data to third parties

---

---

## Costra ↔ RetirementSorted Funnel

### The Ecosystem
```
Costra (track spending) → discover savings capacity
        ↓
RetirementSorted (invest it) → calculators show compound growth
        ↓
Affiliate conversions → EasyEquities, Allan Gray, Sanlam, Old Mutual
```

### Trigger Points (bot detects → suggests)

| Trigger | Costra Action | RetirementSorted Link |
|---------|--------------------|-----------------------|
| User saves >R1k in a month | "Nice! Want to see what R1k/mo grows to?" | retirementsorted.co.za/compound-calculator |
| Savings rate >15% | "You're saving more than 80% of South Africans" | retirementsorted.co.za/retirement-calculator |
| User mentions "retirement" or "RA" | Direct link to retirement guides | retirementsorted.co.za/blog |
| Two-pot withdrawal question | "Before you withdraw, check your budget" | retirementsorted.co.za/two-pot-calculator |
| User has no savings category | "Where's your savings? Even R500/mo matters" | retirementsorted.co.za/tfsa-guide |
| End of month surplus | "You had R2,800 left over. Here's 3 smart places to put it" | TFSA vs RA comparison + affiliate links |
| Tax season (Feb-Mar) | "Did you know RA contributions reduce your tax?" | retirementsorted.co.za/ra-tax-benefit |

### Weekly Report Integration
```
📋 Costra Week in Review

Total spent: R4,200 / R5,500 budget
Saved this week: R1,300 ✅

💰 Your savings potential:
   Monthly: ~R5,200
   Yearly: ~R62,400
   In 10 years at 10%: R1,067,000

📊 See your full retirement projection →
   retirementsorted.co.za/calculator?monthly=5200

💡 Top tip: A TFSA shelters your first R36k/year from tax.
   Start with R100 → [EasyEquities affiliate link]
```

### RetirementSorted → Costra (reverse funnel)
- RetirementSorted calculator shows "you need to save R4,500/mo"
- CTA: "Not sure where to find R4,500? Track your spending first → costra.co.za"
- Blog posts: "Step 1 of retirement planning: know your numbers" → links to Costra
- Two-pot content: "Before withdrawing, check if you actually need it" → Costra

### Affiliate Revenue Per Funnel Stage

| Stage | Product | Commission | Conversion |
|-------|---------|-----------|------------|
| Awareness (Costra free) | TymeBank, Capitec savings | R50-100/signup | 3-5% |
| Engaged (tracks for 30+ days) | EasyEquities TFSA | R50-100/signup | 5-8% |
| Qualified (saves >R2k/mo) | Allan Gray unit trusts | R200-500/lead | 2-4% |
| High value (saves >R5k/mo) | Sanlam RA, Old Mutual | R300-500/lead | 1-3% |
| Tax season | RA top-up campaigns | R200-500/lead | 5-10% |

### Content Flywheel
1. Costra generates spending data → anonymised insights for blog content
2. "The average SA user spends 23% on eating out" → RetirementSorted blog post
3. "If you redirected half your Uber Eats spend, you'd retire 3 years earlier" → viral TikTok content
4. Content drives traffic to both sites → more users → more data → more content

### Shared Domain Strategy
- costra.co.za → spending tracker
- retirementsorted.co.za → retirement planning
- Both link to each other naturally
- Same "Sorted" brand family (FitSorted, BetSorted, Costra, RetirementSorted)
- Future: **MoneySorted** umbrella brand? (budgeting + retirement + tax + insurance)

---

## Competitive Moat
1. **WhatsApp-native** — no one else is doing this for SA budgeting
2. **SA merchant database** — auto-categorises Woolworths, Checkers, Nando's etc.
3. **Freemium + affiliates** — free users still generate revenue
4. **Cross-sell with FitSorted** — "wallet and waistline" bundle
5. **Low cost to run** — same infrastructure, same Meta Business account
6. **Bank-linked PWA** — auto-import transactions, no manual entry needed
7. **Dual interface** — WhatsApp for quick logging, PWA for the full picture
