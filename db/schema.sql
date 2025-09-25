-- Smartflytt Database Schema
-- Production-grade schema with proper constraints, indexes, and security

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types for better type safety
CREATE TYPE app_role AS ENUM ('admin', 'user');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'quoted', 'sold', 'lost', 'cancelled');
CREATE TYPE submission_type AS ENUM ('offert', 'kontorsflytt', 'volymuppskattning');
CREATE TYPE lead_quality AS ENUM ('high', 'medium', 'low');

-- User roles table for proper authentication
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Enhanced leads table with proper constraints and indexing
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Lead classification
    submission_type submission_type NOT NULL,
    lead_quality lead_quality DEFAULT 'medium',
    lead_score INTEGER CHECK (lead_score >= 0 AND lead_score <= 100),
    status lead_status DEFAULT 'new' NOT NULL,
    
    -- Contact information (required)
    name TEXT NOT NULL CHECK (LENGTH(name) > 0 AND LENGTH(name) <= 100),
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone TEXT NOT NULL CHECK (LENGTH(phone) >= 8 AND LENGTH(phone) <= 20),
    
    -- Move details
    move_date DATE CHECK (move_date >= CURRENT_DATE),
    from_address JSONB NOT NULL,
    to_address JSONB NOT NULL,
    volume NUMERIC(5,2) CHECK (volume > 0 AND volume <= 999.99),
    
    -- Calculated data
    distance_data JSONB,
    price_calculation JSONB,
    
    -- Additional information
    additional_info TEXT CHECK (LENGTH(additional_info) <= 2000),
    chat_transcript JSONB DEFAULT '[]'::JSONB,
    
    -- Internal tracking
    company_id UUID,
    
    -- Ensure required address fields
    CONSTRAINT valid_from_address CHECK (
        from_address ? 'street' AND 
        from_address ? 'postal' AND 
        from_address ? 'city'
    ),
    CONSTRAINT valid_to_address CHECK (
        to_address ? 'street' AND 
        to_address ? 'postal' AND 
        to_address ? 'city'
    )
);

-- Lead sales audit table for financial tracking
CREATE TABLE IF NOT EXISTS public.lead_sales_audit (
    id BIGSERIAL PRIMARY KEY,
    lead_uuid TEXT NOT NULL,
    partner_price INTEGER CHECK (partner_price >= 0),
    platform_commission INTEGER CHECK (platform_commission >= 0),
    sold_at TIMESTAMPTZ DEFAULT NOW(),
    sold_by TEXT CHECK (LENGTH(sold_by) <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Ensure we can link back to leads table
    CONSTRAINT fk_lead_uuid FOREIGN KEY (lead_uuid) REFERENCES public.leads(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_submission_type ON public.leads(submission_type);
CREATE INDEX IF NOT EXISTS idx_leads_lead_quality ON public.leads(lead_quality);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_move_date ON public.leads(move_date);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON public.leads(lead_score DESC);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

CREATE INDEX IF NOT EXISTS idx_lead_sales_audit_lead_uuid ON public.lead_sales_audit(lead_uuid);
CREATE INDEX IF NOT EXISTS idx_lead_sales_audit_sold_at ON public.lead_sales_audit(sold_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS handle_leads_updated_at ON public.leads;
CREATE TRIGGER handle_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_user_roles_updated_at ON public.user_roles;
CREATE TRIGGER handle_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    );
$$;

-- Security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role
    FROM public.user_roles
    WHERE user_id = auth.uid()
    LIMIT 1;
$$;

-- Comments for documentation
COMMENT ON TABLE public.leads IS 'Main leads table storing all customer inquiries and quotes';
COMMENT ON TABLE public.user_roles IS 'User role assignments for authentication and authorization';
COMMENT ON TABLE public.lead_sales_audit IS 'Audit trail for lead sales and financial tracking';

COMMENT ON FUNCTION public.has_role IS 'Security definer function to check if user has specific role - prevents RLS recursion';
COMMENT ON FUNCTION public.get_current_user_role IS 'Security definer function to get current user role - prevents RLS recursion';