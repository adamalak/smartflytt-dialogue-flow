-- Smartflytt Row Level Security Policies
-- Production-grade security policies for all tables

-- Enable RLS on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sales_audit ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Allow authenticated users to read leads" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated users to update lead status" ON public.leads;
DROP POLICY IF EXISTS "Service role can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can manage leads" ON public.leads;

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Service role can manage roles" ON public.user_roles;

DROP POLICY IF EXISTS "Admins can view audit trail" ON public.lead_sales_audit;
DROP POLICY IF EXISTS "Service role can insert audit records" ON public.lead_sales_audit;

-- =============================================================================
-- LEADS TABLE POLICIES
-- =============================================================================

-- Allow service role to insert new leads (from edge functions)
CREATE POLICY "Service role can insert leads"
    ON public.leads
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Allow anonymous users to insert leads (for public form submissions)
-- This enables the chatbot to work without authentication
CREATE POLICY "Anonymous can insert leads"
    ON public.leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Admins can view all leads
CREATE POLICY "Admins can view all leads"
    ON public.leads
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update lead status and information
CREATE POLICY "Admins can update leads"
    ON public.leads
    FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete leads if necessary
CREATE POLICY "Admins can delete leads"
    ON public.leads
    FOR DELETE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- =============================================================================
-- USER_ROLES TABLE POLICIES
-- =============================================================================

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Admins can view all user roles
CREATE POLICY "Admins can view all roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Service role can manage user roles (for initial setup)
CREATE POLICY "Service role can manage roles"
    ON public.user_roles
    FOR ALL
    TO service_role
    WITH CHECK (true);

-- Admins can assign/remove roles (except their own admin role)
CREATE POLICY "Admins can manage other roles"
    ON public.user_roles
    FOR ALL
    TO authenticated
    USING (
        public.has_role(auth.uid(), 'admin') AND 
        (user_id != auth.uid() OR role != 'admin')
    )
    WITH CHECK (
        public.has_role(auth.uid(), 'admin') AND 
        (user_id != auth.uid() OR role != 'admin')
    );

-- =============================================================================
-- LEAD_SALES_AUDIT TABLE POLICIES
-- =============================================================================

-- Admins can view all audit records
CREATE POLICY "Admins can view audit trail"
    ON public.lead_sales_audit
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Service role can insert audit records
CREATE POLICY "Service role can insert audit records"
    ON public.lead_sales_audit
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Admins can update audit records (for corrections)
CREATE POLICY "Admins can update audit records"
    ON public.lead_sales_audit
    FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================================================
-- STORAGE POLICIES (if using Supabase Storage)
-- =============================================================================

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, allowed_mime_types)
VALUES 
    ('documents', 'documents', false, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']::text[]),
    ('avatars', 'avatars', true, ARRAY['image/jpeg', 'image/png', 'image/webp']::text[])
ON CONFLICT (id) DO NOTHING;

-- Document storage policies
CREATE POLICY "Admins can view all documents"
    ON storage.objects
    FOR SELECT
    USING (
        bucket_id = 'documents' AND 
        auth.role() = 'authenticated' AND 
        public.has_role(auth.uid(), 'admin')
    );

CREATE POLICY "Admins can upload documents"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'documents' AND 
        auth.role() = 'authenticated' AND 
        public.has_role(auth.uid(), 'admin')
    );

-- Avatar storage policies
CREATE POLICY "Avatars are publicly viewable"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' AND 
        auth.role() = 'authenticated' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar"
    ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'avatars' AND 
        auth.role() = 'authenticated' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- =============================================================================
-- SECURITY VALIDATIONS
-- =============================================================================

-- Function to validate Swedish phone numbers
CREATE OR REPLACE FUNCTION public.is_valid_swedish_phone(phone TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    -- Remove all non-digits
    phone := regexp_replace(phone, '[^0-9]', '', 'g');
    
    -- Check if it's a valid Swedish phone number format
    RETURN phone ~ '^(07[0-9]{8}|08[0-9]{7,8}|0[1-9][0-9]{7,8}|46[0-9]{8,9})$';
END;
$$;

-- Function to validate Swedish postal codes
CREATE OR REPLACE FUNCTION public.is_valid_swedish_postal(postal TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    -- Remove spaces and check format
    postal := regexp_replace(postal, '\s', '', 'g');
    RETURN postal ~ '^[0-9]{5}$' AND postal::INTEGER BETWEEN 10000 AND 99999;
END;
$$;

-- Add check constraints with proper validation
ALTER TABLE public.leads
    ADD CONSTRAINT valid_phone_format 
    CHECK (public.is_valid_swedish_phone(phone));

-- Comments for documentation
COMMENT ON POLICY "Service role can insert leads" ON public.leads IS 'Allows edge functions to create new leads';
COMMENT ON POLICY "Anonymous can insert leads" ON public.leads IS 'Allows public chatbot submissions';
COMMENT ON POLICY "Admins can view all leads" ON public.leads IS 'Admin dashboard access to all leads';
COMMENT ON POLICY "Admins can update leads" ON public.leads IS 'Admin can update lead status and information';

COMMENT ON FUNCTION public.is_valid_swedish_phone IS 'Validates Swedish phone number formats';
COMMENT ON FUNCTION public.is_valid_swedish_postal IS 'Validates Swedish postal code format';