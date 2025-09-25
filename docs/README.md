# Smartflytt - Production-Grade Moving Quote Chatbot

A secure, scalable chatbot application for Smartflytt that generates moving quotes through an intelligent conversation flow. Built with React, TypeScript, Supabase, and modern web technologies.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- SendGrid account (for emails)
- Google Maps API key

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd smartflytt
npm install
```

2. **Environment setup:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database setup:**
```bash
# Apply database schema and policies
# Run these in your Supabase SQL Editor:
cat db/schema.sql | # Copy and execute in Supabase
cat db/policies.sql | # Copy and execute in Supabase
cat db/seed.sql | # Copy and execute in Supabase (optional test data)
```

4. **Configure Supabase Secrets:**
Go to your Supabase Dashboard → Settings → Functions and add:
- `SEND_GRID_API_KEY`
- `MAPS_API_KEY` 
- `ADMIN_EMAIL_RECIPIENT`
- `CUSTOMER_SUPPORT_EMAIL`
- `ALLOWED_ORIGINS`

5. **Start development server:**
```bash
npm run dev
```

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** + shadcn/ui for styling
- **React Hook Form** + Zod for form validation
- **React Query** for server state management

### Backend Stack
- **Supabase** for database, auth, and edge functions
- **PostgreSQL** with Row Level Security (RLS)
- **SendGrid** for email delivery
- **Google Maps API** for distance calculations

### Security Features
- JWT authentication for edge functions
- CORS allowlist (no wildcards)
- Input validation client and server-side
- RLS policies for data access control
- Structured logging for audit trails

## 🔧 Configuration

### Required Manual Steps

1. **Supabase Setup:**
   - Enable JWT verification: Set `verify_jwt = true` in config.toml
   - Configure allowed origins in CORS settings
   - Add secrets in Functions settings

2. **SendGrid Configuration:**
   - Verify sender domain
   - Configure webhooks (optional)
   - Set up email templates

3. **Google Maps API:**
   - Enable Distance Matrix API
   - Set quotas and billing
   - Restrict API key to your domains

4. **Domain Configuration:**
   - Add production domain to Supabase Auth redirects
   - Configure DNS if using custom domain

## 🧪 Testing

Run the complete test suite:
```bash
npm test
```

### Smoke Test Checklist

- [ ] Home page loads without errors
- [ ] Chatbot opens and responds to input
- [ ] Form validation works correctly
- [ ] Price calculation returns results
- [ ] Admin login requires authentication
- [ ] Edge functions reject unauthenticated requests
- [ ] Email sending works in development

## 🚀 Deployment

The application auto-deploys through Lovable. For external deployment:

1. **Build for production:**
```bash
npm run build
```

2. **Deploy edge functions:**
```bash
supabase functions deploy --project-ref your-project-id
```

3. **Run database migrations:**
Execute SQL files in order: schema.sql → policies.sql → seed.sql

## 📊 Monitoring

### Logs Access
- **Edge Functions:** Supabase Dashboard → Functions → Logs
- **Database:** Supabase Dashboard → Logs
- **Frontend:** Browser DevTools

### Key Metrics
- Lead conversion rate
- Form abandonment points
- API response times
- Error rates by function

## 🔒 Security

### Data Protection
- All PII encrypted in transit and at rest
- RLS policies prevent unauthorized access
- Input validation prevents injection attacks
- Rate limiting on API endpoints

### Authentication Flow
1. Anonymous users can submit chatbot forms
2. Admin access requires Supabase Auth login
3. Edge functions verify JWT tokens
4. Role-based permissions in database

## 📝 API Documentation

### Edge Functions

**POST /functions/v1/send-email**
- Purpose: Send notification emails
- Auth: Required (JWT)
- Rate limit: 100/minute
- [Full API spec](docs/api/edge-send-email.schema.json)

**POST /functions/v1/calculate-distances**
- Purpose: Calculate moving distances
- Auth: Required (JWT) 
- Rate limit: 100/minute
- [Full API spec](docs/api/edge-calculate-distances.schema.json)

## 🛠️ Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── chatbot/        # Chatbot-specific components
│   ├── admin/          # Admin dashboard components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── services/           # API clients and integrations
├── types/              # TypeScript type definitions
├── utils/              # Business logic utilities
└── data/               # Constants and configurations
```

### Database Schema
- `leads`: Customer inquiries and quotes
- `user_roles`: Role-based access control
- `lead_sales_audit`: Financial tracking

See [db/schema.sql](db/schema.sql) for complete schema.

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Use semantic commit messages
3. Add tests for new features
4. Update documentation

## 📄 License

Proprietary - Smartflytt AB