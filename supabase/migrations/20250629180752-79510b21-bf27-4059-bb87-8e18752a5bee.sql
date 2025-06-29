
-- Refresh the database schema by updating a comment on the leads table
-- This will trigger regeneration of the Supabase types
COMMENT ON TABLE public.leads IS 'Table for storing moving service leads and quotes';

-- Ensure the table has proper structure
ALTER TABLE public.leads ALTER COLUMN status SET DEFAULT 'new';
