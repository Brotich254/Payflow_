# PayFlow - Quick Start Guide (5 Minutes)

Get PayFlow running locally in 5 minutes.

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org)
- **PostgreSQL** - [Download](https://www.postgresql.org/download/) or use Docker
- **Git** - [Download](https://git-scm.com)
- **Stripe Account** - [Sign up free](https://stripe.com)

## Step 1: Start PostgreSQL (1 minute)

### Option A: Local Installation
```bash
# macOS (Homebrew)
brew services start postgresql

# Linux (Ubuntu/Debian)
sudo service postgresql start

# Windows
# Use PostgreSQL installer
```

### Option B: Docker
```bash
docker run --name payflow-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=payflow \
  -p 5432:5432 \
  -d postgres:15
```

## Step 2: Clone & Install (1 minute)

```bash
# Clone
git clone <repo-url>
cd payflow

# Install dependencies
npm install

# Should take ~30 seconds
```

## Step 3: Setup Environment (1 minute)

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local
nano .env.local
# or code .env.local (VS Code)
```

Add these values:

```env
# Database (adjust if needed)
DATABASE_URL="postgresql://postgres:password@localhost:5432/payflow"

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-random-secret-here-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (use test keys for development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_key_here"
STRIPE_SECRET_KEY="sk_test_your_key_here"
STRIPE_WEBHOOK_SECRET="whsec_test_your_secret_here"
```

**Get Stripe Keys:**
1. Visit [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to Developers → API Keys
3. Copy the test keys (NOT live keys)

## Step 4: Database Setup (1 minute)

```bash
# Setup database and run migrations
npx prisma migrate dev --name init

# This will:
# ✓ Create database tables
# ✓ Generate Prisma client
# ✓ Open Prisma Studio (optional)
```

## Step 5: Run Development Server (1 minute)

```bash
npm run dev

# Output should show:
# ▲ Next.js 14.0.0
# - Local:        http://localhost:3000
# Ready in 2.5s
```

## You're Done! 🎉

### Access the Application

| Page | URL | Use |
|------|-----|-----|
| Landing | http://localhost:3000 | Explore features |
| Register | http://localhost:3000/register | Create account |
| Login | http://localhost:3000/login | Sign in |
| Dashboard | http://localhost:3000/dashboard | View metrics |
| Invoices | http://localhost:3000/invoices | Create invoices |
| Customers | http://localhost:3000/customers | Manage customers |
| Analytics | http://localhost:3000/analytics | View reports |

## Demo Walkthrough (2 minutes)

### 1. Create Account
```
Go to /register
Email: test@example.com
Password: Test@123456 (min 8 chars)
Name: Test User
Business: Test Business (optional)
```

### 2. Create Customer
```
Dashboard → Customers → Add Customer
Name: Acme Corp
Email: contact@acme.com
Phone: (555) 123-4567
Address: 123 Business St
```

### 3. Create Invoice
```
Dashboard → Invoices → Create Invoice
Select Customer: Acme Corp
Due Date: Pick a date
Add Item: "Consulting Services", Qty: 1, Price: $1,000
Click "Create Invoice"
```

### 4. View Analytics
```
Dashboard → Analytics
See revenue, pending, and overdue metrics
```

## Useful Commands

```bash
# Development
npm run dev          # Start dev server

# Database
npm run db:migrate   # Run migrations
npx prisma studio   # Open database GUI

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## Testing the API

### Using Thunder Client (VS Code)

1. Install extension: Thunder Client
2. Open Thunder Client
3. Make requests to test endpoints:

```http
### Register User
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test@123456",
  "name": "Test User"
}

### Get Invoices
GET http://localhost:3000/api/invoices

### Create Invoice
POST http://localhost:3000/api/invoices
Content-Type: application/json

{
  "customerId": "customer-id",
  "amount": 1000,
  "items": [
    {
      "description": "Services",
      "quantity": 1,
      "unitPrice": 1000
    }
  ]
}
```

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process
kill -9 $(lsof -t -i:3000)

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Error
```bash
# Check connection string in .env.local
# Verify PostgreSQL is running
psql $DATABASE_URL

# If error, check:
# - PostgreSQL installed and running
# - Connection string format correct
# - Database exists
```

### Prisma Client Error
```bash
# Regenerate client
npx prisma generate

# If still error:
rm -rf node_modules/.prisma
npx prisma generate
```

### Stripe Keys Not Working
```bash
# Verify keys in Stripe Dashboard:
# 1. Go to Developers → API Keys
# 2. Ensure you're using TEST keys (pk_test_*, sk_test_*)
# 3. NOT live keys (pk_live_*, sk_live_*)
# 4. Keys include underscores but no spaces
```

## Environment Variable Quick Reference

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# NextAuth (JWT Secret - min 32 chars)
NEXTAUTH_SECRET=openssl-rand-base64-32-output-here
NEXTAUTH_URL=http://localhost:3000

# Stripe (Get from dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Optional
NODE_ENV=development
```

## What's Running

```
Frontend:  http://localhost:3000         (Next.js)
Backend:   http://localhost:3000/api     (Next.js API Routes)
Database:  localhost:5432                (PostgreSQL)
```

## Next: Deployment

Ready to deploy? Check these guides:

- **Vercel** (Recommended): [Vercel Deployment](https://vercel.com/docs)
- **Docker**: `docker build -t payflow .`
- **AWS**: Use Vercel, EC2, or Lambda
- **Heroku**: `git push heroku main`

## Need Help?

1. Check browser console for errors (F12)
2. Check terminal for server errors
3. Check `.env.local` for missing variables
4. Read README.md for detailed docs
5. Check API routes in `app/api/`

---

**You're all set! Start building with PayFlow 🚀**

Need production help? See SETUP.md for advanced configuration.
