
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Calendar, Target } from 'lucide-react';

interface Lead {
  id: string;
  created_at: string;
  lead_quality: string;
  status: string;
}

interface StatisticsCardsProps {
  leads: Lead[];
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ leads }) => {
  const totalLeads = leads.length;
  const premiumLeads = leads.filter(lead => lead.lead_quality === 'Premium').length;
  
  const today = new Date().toISOString().split('T')[0];
  const leadsToday = leads.filter(lead => 
    lead.created_at.split('T')[0] === today
  ).length;
  
  const convertedLeads = leads.filter(lead => 
    lead.status === 'converted' || lead.status === 'closed'
  ).length;
  
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';

  const stats = [
    {
      title: 'Totala Leads',
      value: totalLeads.toString(),
      description: 'Alla registrerade leads',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Premium Leads',
      value: premiumLeads.toString(),
      description: `${totalLeads > 0 ? ((premiumLeads / totalLeads) * 100).toFixed(1) : 0}% av totala leads`,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Leads Idag',
      value: leadsToday.toString(),
      description: 'Nya leads idag',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Konverteringsgrad',
      value: `${conversionRate}%`,
      description: 'Andel konverterade leads',
      icon: Target,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <CardDescription className="text-xs text-muted-foreground">
                {stat.description}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatisticsCards;
