
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AdditionalInfoInputProps {
  onSubmit: (info: string) => void;
}

export const AdditionalInfoInput: React.FC<AdditionalInfoInputProps> = ({ onSubmit }) => {
  const [info, setInfo] = useState('');
  const [showTextarea, setShowTextarea] = useState(false);

  const handleYes = () => {
    setShowTextarea(true);
  };

  const handleNo = () => {
    onSubmit('');
  };

  const handleSubmitInfo = () => {
    onSubmit(info);
  };

  if (showTextarea) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-md space-y-4 p-4 bg-green-50/50 rounded-lg border border-green-200">
          <Label className="text-sm font-medium text-gray-700">
            Ytterligare information eller meddelande
          </Label>
          <Textarea
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            placeholder="Skriv här om du har något speciellt att meddela oss..."
            rows={4}
            className="border-green-200"
          />
          <Button onClick={handleSubmitInfo} className="w-full bg-green-600 hover:bg-green-700">
            Skicka meddelande
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md space-y-2">
        <Button onClick={handleYes} className="w-full bg-green-600 hover:bg-green-700">
          Ja, jag vill lägga till information
        </Button>
        <Button onClick={handleNo} variant="outline" className="w-full border-green-200 hover:bg-green-50">
          Nej, gå vidare
        </Button>
      </div>
    </div>
  );
};
