
-- Lägg till company_id kolumn till leads-tabellen
ALTER TABLE public.leads ADD COLUMN company_id UUID;

-- Skapa index för bättre prestanda på company_id
CREATE INDEX IF NOT EXISTS idx_leads_company_id ON public.leads(company_id);

-- Skapa index för bättre prestanda på lead_quality och status för admin dashboard
CREATE INDEX IF NOT EXISTS idx_leads_lead_quality ON public.leads(lead_quality);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

-- Lägg till RLS policy för admin-åtkomst (alla autentiserade användare kan läsa leads för nu)
-- I produktion skulle detta behöva mer specifik admin-kontroll
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read leads" ON public.leads
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update lead status" ON public.leads
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);
