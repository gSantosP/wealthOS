# WealthOS — Personal Finance Intelligence Platform

> A full-stack SaaS application that gives users complete visibility over their financial life — with AI-powered insights, real-time spending analysis, and goal tracking.

**[Live Demo →](https://wealthos.gabriel-dev.com)** &nbsp;·&nbsp; **[Watch 60s Demo Video →](#)**

![WealthOS Dashboard Preview](./preview.png)

---

## The problem it solves

Most people have money in 3–5 different places (salary, freelance income, investments, savings) but no single view of their financial health. WealthOS aggregates everything, categorizes automatically, and lets an AI advisor surface insights that would take hours to find manually.

**Core features:**

| Feature | What it does |
|---|---|
| Net Worth Dashboard | Live aggregation of assets, cash flow, and investment performance |
| Spending Analytics | AI-categorized transactions with trend detection and budget alerts |
| Income vs Expenses | 6-month area chart showing the gap between earning and spending |
| Budget Tracker | Real-time budget consumption with visual progress bars and overspend alerts |
| Savings Goals | Multi-goal tracker with percentage completion and projected completion dates |
| AI Financial Advisor | Claude-powered analysis that reads your spending patterns and gives specific, numbered recommendations |
| Transaction Management | Add, categorize, and filter transactions in real time |

---

## Tech stack

### Frontend
- **React 18** + **TypeScript** — component architecture
- **Chart.js** — animated area charts, donut charts, sparklines
- **Tailwind CSS** — utility-first styling with custom dark theme
- **Framer Motion** — page transitions and micro-interactions

### Backend
- **Java 17** + **Spring Boot 3.2** — REST API layer
- **Spring Security** + **JWT** — stateless authentication
- **PostgreSQL** — transactional data, user accounts, categories
- **Redis** — session cache, rate limiting

### AI Integration
- **Anthropic Claude API** — financial analysis with context injection
- Prompt engineering: injects live financial snapshot → structured insights
- Streaming response rendering (typewriter effect)

### Infrastructure
- **AWS** (EC2 + RDS + S3 for exports)
- **Docker** + Docker Compose for local dev
- **GitHub Actions** — CI/CD pipeline

---

## Architecture overview

```
React Frontend (TypeScript)
  │
  ├── Chart.js visualization layer
  ├── Real-time budget calculation engine
  └── AI Advisor component → POST /api/ai/analyze
        │
        ▼
Spring Boot REST API
  │
  ├── AuthController      → JWT issuance and refresh
  ├── TransactionController → CRUD + category inference
  ├── AnalyticsController  → aggregations, trend calculation
  ├── BudgetController     → budget rules, overspend detection
  └── AiController         → context builder → Claude API → stream response
        │
        ├── PostgreSQL   (transactions, users, budgets, goals)
        └── Redis        (sessions, rate limits)
```

---

## Run locally

```bash
git clone https://github.com/gabriel-santos-dev/wealthos
cd wealthos

# Backend
cd backend
cp .env.example .env  # add your Claude API key
./mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm run dev

# Or run everything with Docker:
docker compose up
```

Open [http://localhost:5173](http://localhost:5173) — full app with seeded demo data.

---

## Key engineering decisions

**Why AI for financial analysis?**
Rule-based systems ("if food > $700, alert user") miss context. Claude reads the full financial picture and surfaces insights a rules engine would miss — like "your entertainment overspend is $40, but your health budget has $280 left, so you're net $240 under total budget."

**Why JWT over sessions for a finance app?**
Stateless auth scales horizontally, works across mobile and web, and allows fine-grained token expiry without shared session storage.

**Why Chart.js over Recharts/D3?**
Chart.js gives better animation control at the cost of less React-nativeness. For a finance product where the charts are a core feature (not supporting elements), the animation quality justifies the tradeoff.

**Why PostgreSQL over MongoDB for financial data?**
Transactions, budgets, and goals are relational by nature. ACID compliance is non-negotiable for financial data. PostgreSQL handles complex aggregation queries (monthly totals, running balances) far better than a document store.

---

## AI Advisor — how it works

```
1. User clicks "Analyze My Finances"
2. Frontend builds financial context object:
   { netWorth, income, expenses, savingsRate, budgets[], goals[], recentTrends }
3. POST /api/ai/analyze → context injected into Claude prompt
4. Response streams back → typewriter rendering in UI
5. Insights reference specific numbers from user's actual data
```

Sample output:
> "💰 Your savings rate is 37.7% — that's genuinely excellent. Most financial advisors target 20%. You're nearly double that.
> ⚠️ Entertainment ($340 vs $300 budget): you're over by $40, but this is your only overspend. Not a crisis — adjust the budget to $350 or cut one streaming service.
> 🎯 New Car goal at 85%: at current savings rate, you'll hit 100% in ~6 weeks. Consider moving those funds to the Home Down Payment (42%) once the car goal closes."

---

## About

Built by **Gabriel Santos** — Full Stack Developer (Java · Spring Boot · React) with 4+ years delivering production systems for Banco Santander, Tokio Marine, and early-stage startups.

Available for full-time freelance work on Upwork (30–40h/week). English fluent. São Paulo, Brazil (UTC-3, compatible with US/EU time zones).

[![Hire on Upwork](https://img.shields.io/badge/Hire_me_on-Upwork-14a800?style=for-the-badge&logo=upwork&logoColor=white)](https://www.upwork.com/freelancers/~01d2792c47b29659ff)
[![GitHub](https://img.shields.io/badge/GitHub-gabriel--santos--dev-181717?style=for-the-badge&logo=github)](https://github.com/gabriel-santos-dev)
