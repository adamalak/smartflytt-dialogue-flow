
import { StepHandlerContext } from './stepHandlers';
import { supabase } from '@/integrations/supabase/client';
import { calculatePrice, formatPriceBreakdown } from './priceCalculation';

export const handlePriceCalculationStep = async (formData: any, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, updateFormData } = context;

  try {
    // Get base coordinates from environment or use defaults
    const baseLatitude = 57.708870; // Göteborg centrum
    const baseLongitude = 11.974560;

    const fromAddress = `${formData.from.street}, ${formData.from.postal} ${formData.from.city}`;
    const toAddress = `${formData.to.street}, ${formData.to.postal} ${formData.to.city}`;

    console.log('Calculating distances for addresses:', { fromAddress, toAddress });

    // Call distance calculation edge function
    const { data: distanceData, error } = await supabase.functions.invoke('calculate-distances', {
      body: {
        fromAddress,
        toAddress,
        baseLatitude,
        baseLongitude
      }
    });

    if (error) {
      console.error('Distance calculation error:', error);
      addMessage('Det uppstod ett problem vid beräkning av körsträckor. Kontakta oss direkt på smartflyttlogistik@gmail.com', 'bot');
      return;
    }

    console.log('Distance calculation result:', distanceData);

    // Calculate price
    const priceCalculation = calculatePrice({
      volume: formData.volume,
      distanceData,
      elevatorInfo: formData.elevator
    });

    console.log('Price calculation result:', priceCalculation);

    // Update form data with distance and price information
    updateFormData({ 
      distanceData,
      priceCalculation 
    });

    // Present the preliminary offer to user
    const priceBreakdown = formatPriceBreakdown(priceCalculation);
    addMessage(`Här är din preliminära offert:\n\n${priceBreakdown}\n\n**Observera att detta är en preliminär offert. En slutgiltig offert bekräftas efter att vi personligen har gått igenom detaljerna med dig.**`, 'bot');

    setTimeout(() => {
      addMessage('Slutligen behöver jag dina kontaktuppgifter. Ange namn och e-post:', 'bot');
      setCurrentStep('contact');
    }, 2000);

  } catch (error) {
    console.error('Price calculation error:', error);
    addMessage('Det uppstod ett tekniskt fel vid prisberäkningen. Kontakta oss direkt på smartflyttlogistik@gmail.com', 'bot');
  }
};
