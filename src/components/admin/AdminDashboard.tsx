
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminAuth from './AdminAuth';
import StatisticsCards from './StatisticsCards';
import LeadsTable from './LeadsTable';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowLeft } from 'lucide-react';

interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  lead_quality: string;
  lead_score: number;
  status: string;
  submission_type: string;
  volume: number;
}

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        toast({
          title: 'Fel',
          description: 'Kunde inte hämta leads från databasen',
          variant: 'destructive'
        });
      } else {
        setLeads(data || []);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: 'Fel',
        description: 'Ett fel uppstod vid hämtning av data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated]);

  const handleBackToSite = () => {
    window.location.href = '/';
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Hantera leads och övervaka statistik</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBackToSite}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka till webbplats
            </Button>
            <Button onClick={fetchLeads} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Uppdatera
            </Button>
          </div>
        </div>

        <StatisticsCards leads={leads} />

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Leads</h2>
            <p className="text-gray-600">Totalt {leads.length} leads</p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-600" />
              <span className="ml-2 text-gray-600">Laddar leads...</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Inga leads hittades</p>
            </div>
          ) : (
            <LeadsTable leads={leads} onLeadUpdated={fetchLeads} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
