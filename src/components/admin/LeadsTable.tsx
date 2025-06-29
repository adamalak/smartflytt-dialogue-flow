
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

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

interface LeadsTableProps {
  leads: Lead[];
  onLeadUpdated: () => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onLeadUpdated }) => {
  const [updatingLeads, setUpdatingLeads] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    setUpdatingLeads(prev => new Set(prev).add(leadId));

    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId) as any;

      if (error) {
        console.error('Error updating lead status:', error);
        toast({
          title: 'Fel',
          description: 'Kunde inte uppdatera lead-status',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Uppdaterat',
          description: 'Lead-status har uppdaterats',
        });
        onLeadUpdated();
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: 'Fel',
        description: 'Ett fel uppstod vid uppdatering',
        variant: 'destructive'
      });
    } finally {
      setUpdatingLeads(prev => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Premium':
        return 'bg-green-100 text-green-800';
      case 'Standard':
        return 'bg-blue-100 text-blue-800';
      case 'Basic':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'qualified':
        return 'bg-purple-100 text-purple-800';
      case 'converted':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = [
    { value: 'new', label: 'Ny' },
    { value: 'contacted', label: 'Kontaktad' },
    { value: 'qualified', label: 'Kvalificerad' },
    { value: 'converted', label: 'Konverterad' },
    { value: 'closed', label: 'Stängd' }
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Datum</TableHead>
            <TableHead>Namn</TableHead>
            <TableHead>Kontakt</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Kvalitet</TableHead>
            <TableHead>Poäng</TableHead>
            <TableHead>Volym</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">
                {format(new Date(lead.created_at), 'dd MMM yyyy', { locale: sv })}
              </TableCell>
              <TableCell>{lead.name || 'N/A'}</TableCell>
              <TableCell className="text-sm">
                <div>{lead.email || 'N/A'}</div>
                <div className="text-muted-foreground">{lead.phone || 'N/A'}</div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{lead.submission_type || 'N/A'}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getQualityColor(lead.lead_quality || '')}>
                  {lead.lead_quality || 'N/A'}
                </Badge>
              </TableCell>
              <TableCell>{lead.lead_score || 0}</TableCell>
              <TableCell>{lead.volume ? `${lead.volume}m³` : 'N/A'}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(lead.status || 'new')}>
                  {statusOptions.find(opt => opt.value === lead.status)?.label || lead.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Select 
                  value={lead.status || 'new'} 
                  onValueChange={(value) => updateLeadStatus(lead.id, value)}
                  disabled={updatingLeads.has(lead.id)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadsTable;
