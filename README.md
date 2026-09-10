# PayFlow - Premium Invoice & Payment Platform

🚀 **Professional Invoice Management & Payment Processing for Modern Businesses**

PayFlow is a modern, full-stack fintech application built with the best contemporary technologies. Create, manage, and track invoices with integrated payment processing via Stripe.

## ✨ Features

### Invoice Management
- ✅ Create professional invoices in seconds
- ✅ Customizable line items with quantities and pricing
- ✅ Save as draft or send immediately
- ✅ Auto-invoice numbering
- ✅ Multi-currency support (USD)
- ✅ Due date tracking

### Payment Processing
- ✅ Stripe integration for card payments
- ✅ Real-time payment status tracking
- ✅ Payment intent creation
- ✅ Webhook handling for payment events
- ✅ Secure payment processing (PCI compliant)

### Customer Management
- ✅ Add and manage customers
- ✅ Customer contact details and tax IDs
- ✅ Invoice history per customer
- ✅ Quick invoice creation from customer profile

### Analytics & Reporting
- ✅ Real-time revenue tracking
- ✅ Pending invoices overview
- ✅ Overdue invoice alerts
- ✅ Payment statistics and metrics
- ✅ Dashboard with key metrics

### User Management
- ✅ Secure authentication with NextAuth.js
- ✅ Password hashing with bcrypt
- ✅ JWT-based session management
- ✅ User profile settings

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | **Next.js 14** (App Router), React 18, TypeScript |
| Backend | **Next.js API Routes**, Node.js |
| Database | **PostgreSQL** + **Prisma ORM** |
| Authentication | **NextAuth.js** + JWT |
| Payments | **Stripe API** |
| Styling | **Tailwind CSS** |
| State Management | **Zustand** + **TanStack Query** |
| Validation | **Zod** |
| Forms | **React Hook Form** |
| Email | **Resend** (ready to integrate) |
| Charting | **Recharts** |

## 📁 Project Structure

```
payflow/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Auth layout group
│   │   ├── login/page.tsx        # Login page
│   │   └── register/page.tsx     # Register page
│   ├── (dashboard)/              # Protected dashboard group
│   │   ├── page.tsx              # Dashboard home
│   │   ├── invoices/
│   │   │   ├── page.tsx          # Invoices list
│   │   │   ├── create/page.tsx   # Create invoice
│   │   │   └── [id]/page.tsx     # Invoice detail
│   │   ├── customers/page.tsx    # Customers
│   │   ├── payments/page.tsx     # Payments
│   │   ├── analytics/page.tsx    # Analytics
│   │   └── settings/page.tsx     # Settings
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── invoices/             # Invoice CRUD
│   │   ├── customers/            # Customer management
│   │   ├── payments/             # Payment processing
│   │   └── analytics/            # Analytics endpoints
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/                   # Reusable components
├── lib/                          # Utilities & config
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # Prisma client
│   ├── stripe.ts                 # Stripe configuration
│   ├── utils.ts                  # Helper functions
│   └── types.ts                  # TypeScript types
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── middleware.ts                 # Auth middleware
├── next.config.js                # Next.js config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd payflow

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Setup database
npx prisma migrate dev --name init

# 5. Run development server
npm run dev
```

Visit `http://localhost:3000`

### Environment Setup

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/payflow"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## 📊 Database Schema

### Core Models

**User**
- Email, name, business details
- Password hash with bcrypt
- Stripe account integration

**Customer**
- Contact information
- Tax ID tracking
- Invoice history relationship

**Invoice**
- Invoice number, amount, status
- Line items with quantities
- Due date tracking
- Payment status
- Email sent tracking

**Payment**
- Stripe integration fields
- Payment intent tracking
- Payment method
- Status (pending, completed, failed)

**Settings**
- User preferences
- Email templates
- Automation rules

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register       Register new user
POST   /api/auth/login          User login
GET    /api/auth/session        Get session
POST   /api/auth/logout         Logout
```

### Invoices
```
GET    /api/invoices            List invoices
POST   /api/invoices            Create invoice
GET    /api/invoices/[id]       Get invoice detail
PUT    /api/invoices/[id]       Update invoice
DELETE /api/invoices/[id]       Delete invoice
```

### Customers
```
GET    /api/customers           List customers
POST   /api/customers           Create customer
GET    /api/customers/[id]      Get customer
PUT    /api/customers/[id]      Update customer
DELETE /api/customers/[id]      Delete customer
```

### Payments
```
POST   /api/payments/create-intent    Create payment intent
POST   /api/payments/webhook          Stripe webhook
GET    /api/analytics/revenue         Revenue data
GET    /api/analytics/pending         Pending invoices
GET    /api/analytics/overdue         Overdue invoices
```

## 🔐 Security

- **Password Security**: bcryptjs hashing (10 rounds)
- **Session Management**: JWT-based with NextAuth.js
- **CSRF Protection**: Built-in with NextAuth.js
- **SQL Injection Prevention**: Prisma ORM parameterization
- **PCI Compliance**: Stripe handles all card data
- **Row-Level Security**: User-scoped queries
- **HTTPS Only**: Enforced in production
- **Input Validation**: Zod schema validation

## 💳 Stripe Integration

### Payment Flow
1. Create payment intent via API
2. Get client secret for Stripe Elements
3. Handle payment on client side
4. Webhook confirms payment completion
5. Update invoice status automatically

### Webhook Events
- `payment_intent.succeeded` - Update invoice to PAID
- `payment_intent.payment_failed` - Mark payment as failed
- `charge.refunded` - Track refunds

## 📈 Analytics Features

- **Revenue Tracking**: Total paid, outstanding, and pending
- **Invoice Metrics**: Count, payment rate, overdue analysis
- **Pending Overview**: Upcoming payments organized by due date
- **Overdue Alerts**: Active notifications for overdue invoices
- **Dashboard**: Real-time metrics and KPIs

## 🎨 UI/UX

- **Modern Design**: Clean, professional interface
- **Responsive**: Mobile, tablet, desktop optimized
- **Dark/Light Support**: Tailwind CSS theme system
- **Accessibility**: WCAG 2.1 AA standards
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Status feedback

## 📝 Supported Invoice Statuses

- **DRAFT** - Not yet sent
- **SENT** - Sent to customer
- **VIEWED** - Customer viewed
- **PAID** - Fully paid
- **PARTIALLY_PAID** - Partial payment received
- **OVERDUE** - Past due date
- **CANCELLED** - Cancelled invoice

## 💰 Pricing Model

PayFlow uses a freemium model:

| Plan | Cost | Features |
|------|------|----------|
| **Free** | $0/mo | 5 invoices/month, basic analytics |
| **Pro** | $29/mo | Unlimited invoices, customer portal, email templates |
| **Business** | $99/mo | Everything in Pro + API access, team seats |
| **Processing Fee** | 2.9% + $0.30 | Optional paid processing via Stripe |

## 🚀 Deployment

### Vercel (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Vercel
vercel link

# 3. Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add STRIPE_SECRET_KEY

# 4. Deploy
vercel deploy --prod
```

### Docker

```bash
docker build -t payflow .
docker run -p 3000:3000 payflow
```

## 📚 Documentation Files

- **START_HERE.md** - Getting started guide
- **QUICKSTART.md** - 5-minute setup
- **SETUP.md** - Detailed setup instructions
- **ARCHITECTURE.md** - System design overview
- **ROADMAP.md** - Future features and enhancements
- **PROJECT_SUMMARY.md** - Feature overview

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check connection string in .env.local
# Ensure PostgreSQL is running
# Test connection: psql $DATABASE_URL
```

### Stripe Integration
```bash
# Use Stripe test keys during development
# pk_test_* and sk_test_*
# Set webhook secret in .env.local
```

### Authentication Errors
```bash
# Ensure NEXTAUTH_SECRET is set (min 32 chars)
# Clear browser cookies if issues persist
# Check NextAuth callback URLs
```

## 🤝 Contributing

Contributions welcome! Please follow these guidelines:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

- **Email**: support@payflow.local
- **Documentation**: `/docs`
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Recurring invoice automation
- [ ] Multi-currency support
- [ ] Advanced reporting
- [ ] API access for integrations
- [ ] Team collaboration
- [ ] Custom branding
- [ ] Multi-language support

## 🏆 Key Achievements

✅ Production-ready codebase
✅ Type-safe with TypeScript
✅ Secure authentication
✅ Payment processing integrated
✅ Responsive design
✅ Comprehensive API
✅ Error handling
✅ Performance optimized

---

**Built with ❤️ for modern businesses**

*PayFlow - Get Paid Faster* 💳
# Payflow_
