
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { getConfigStatus } from '@/utils/config';

export const ConfigStatus: React.FC = () => {
  const status = getConfigStatus();

  if (status.isValid) {
    return null; // Don't show anything if everything is configured
  }

  return (
    <Card className="p-4 mb-4 border-orange-200 bg-orange-50">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-orange-900 mb-2">Konfigurationsvarning</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {status.emailEnabled ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <span className="text-sm">E-postfunktion</span>
              <Badge variant={status.emailEnabled ? "default" : "destructive"}>
                {status.emailEnabled ? 'Konfigurerad' : 'Ej konfigurerad'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Miljö</span>
              <Badge variant="outline">{status.environment}</Badge>
            </div>
          </div>
          {status.errors.length > 0 && (
            <div className="mt-3 p-3 bg-orange-100 rounded-md">
              <p className="text-sm font-medium text-orange-900 mb-1">Konfigurationsproblem:</p>
              <ul className="text-sm text-orange-800 list-disc list-inside space-y-1">
                {status.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
