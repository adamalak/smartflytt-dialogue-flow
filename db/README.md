# Database Setup Guide

This directory contains the database schema, policies, and seed data for the Smartflytt application.

## Files Overview

- **`schema.sql`** - Database tables, types, functions, and triggers
- **`policies.sql`** - Row Level Security (RLS) policies
- **`seed.sql`** - Initial test data for development

## Setup Instructions

### 1. Apply Database Schema

In the Supabase SQL Editor, run the files in this exact order:

```sql
-- 1. First, apply the schema (tables, types, functions)
\i schema.sql

-- 2. Then, apply the RLS policies
\i policies.sql

-- 3. Finally, add seed data (optional, for development only)
\i seed.sql
```

### 2. Manual Steps in Supabase Dashboard

After running the SQL files, complete these steps in the Supabase dashboard:

#### Authentication Settings
1. Go to **Authentication > Settings**
2. Enable **Email confirmations** (recommended for production)
3. Set **Site URL** to your production domain
4. Add redirect URLs for development and production

#### Edge Functions Configuration
1. Go to **Edge Functions**
2. For each function (`send-email`, `calculate-distances`):
   - Ensure `verify_jwt = true` in function settings
   - Add required secrets (see Environment Variables section)

#### Row Level Security
1. Go to **Database > Policies**
2. Verify all tables have RLS enabled:
   - `leads` - ✅ Enabled
   - `user_roles` - ✅ Enabled
   - `lead_sales_audit` - ✅ Enabled

## Environment Variables Required

The following secrets must be configured in Supabase Edge Functions:

### SendGrid (for email functionality)
- `SEND_GRID_API_KEY` - SendGrid API key
- `ADMIN_EMAIL_RECIPIENT` - Email for admin notifications
- `CUSTOMER_SUPPORT_EMAIL` - Support email address

### Google Maps (for distance calculations)
- `MAPS_API_KEY` - Google Maps Distance Matrix API key

### CORS Configuration
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins (e.g., `https://smartflytt.se,https://preview.smartflytt.se`)

### Email Recipients
- `PARTNER_EMAIL_RECIPIENT` - Partner notification email
- `PARTNER_ACCEPT_BASE_URL` - Base URL for partner acceptance links

### Optional
- `DISABLE_EMAIL_SENDING` - Set to `true` to disable email sending in development

## Database Schema Overview

### Core Tables

#### `leads`
Stores customer moving quote requests with all details including:
- Contact information (name, email, phone)
- Move details (addresses, date, volume, elevator info)
- Price calculation results
- Lead scoring and status tracking

#### `user_roles`
Manages user permissions with role-based access:
- Links auth.users to application roles
- Supports 'admin' and 'user' roles
- Used for admin panel access control

#### `lead_sales_audit`
Tracks sales conversions and partner relationships:
- Records when leads are sold to partners
- Tracks pricing and commission data
- Maintains audit trail for business operations

### Security Model

The database uses Row Level Security (RLS) with the following access patterns:

1. **Anonymous Users**: Can only trigger lead creation through edge functions
2. **Authenticated Users**: Can read their own data
3. **Admin Users**: Can read/update all leads and audit data
4. **Service Role**: Full access for edge functions

### Functions and Triggers

- **`update_updated_at_column()`** - Automatically updates timestamps
- **`handle_new_user()`** - Creates user profile on signup
- **Lead scoring triggers** - Calculate lead quality automatically

## Rollback Instructions

If you need to rollback changes:

```sql
-- Remove all policies
DROP POLICY IF EXISTS "Admin users can read all leads" ON leads;
DROP POLICY IF EXISTS "Admin users can update leads" ON leads;
-- ... (add other policies)

-- Remove tables (careful - this deletes data!)
DROP TABLE IF EXISTS lead_sales_audit;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS leads;

-- Remove types
DROP TYPE IF EXISTS app_role;
```

## Common Issues

### RLS Policy Errors
If you see "new row violates row-level security policy":
1. Check that user_id fields are being set correctly
2. Verify JWT tokens contain the right user claims
3. Test policies using the Supabase SQL editor

### Edge Function JWT Errors
If edge functions fail with JWT errors:
1. Ensure `verify_jwt = true` in function configuration
2. Check that requests include proper Authorization headers
3. Verify user has required role (admin) for restricted operations

### Performance Issues
For large datasets:
1. Ensure indexes are in place (created by schema.sql)
2. Monitor query performance in Supabase dashboard
3. Consider pagination for admin views

## Development vs Production

### Development Setup
- Use seed data for testing
- Enable detailed logging
- Allow broader CORS origins
- Consider disabling email sending

### Production Setup
- Remove seed data
- Enable all security policies
- Restrict CORS to production domains
- Monitor performance and security logs
- Regular backups of lead data

## Support

For issues with the database setup:
1. Check Supabase logs for detailed error messages
2. Verify all environment variables are set
3. Test each SQL file individually
4. Contact support with specific error messages and request IDs