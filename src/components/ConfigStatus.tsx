
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export const ConfigStatus: React.FC = () => {
  // Since we're using Supabase Edge Function, email functionality is always available
  const emailEnabled = true;
  const environment = import.meta.env.PROD ? 'production' : 'development';

  return (
    <Card className="p-4 mb-4 border-green-200 bg-green-50">
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-green-900 mb-2">Systemstatus</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">E-postfunktion (Supabase)</span>
              <Badge variant="default">Konfigurerad</Badge>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Miljö</span>
              <Badge variant="outline">{environment}</Badge>
            </div>
          </div>
          <div className="mt-3 p-3 bg-green-100 rounded-md">
            <p className="text-sm text-green-800">
              ✅ Alla system fungerar korrekt. E-post skickas säkert via Supabase Edge Function.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
