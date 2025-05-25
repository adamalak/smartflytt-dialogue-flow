
import { MoveQuoteData, PriceCalculation, DistanceData } from '@/types/chatbot';

interface PriceCalculationInput {
  volume: number; // V in m³
  distanceData: DistanceData;
  elevatorInfo: string; // 'båda' | 'från' | 'till' | 'ingen'
}

export const calculatePrice = (input: PriceCalculationInput): PriceCalculation => {
  const { volume, distanceData, elevatorInfo } = input;
  const { movingDistance, baseToStartDistance, baseToEndDistance } = distanceData;

  // Constants
  const START_FEE = 1200; // kr
  const ELEVATOR_FEE_PER_ADDRESS = 500; // kr
  const VOLUME_COST_PER_M3 = 75; // kr/m³
  const DISTANCE_COST_PER_KM = 10; // kr/km
  const REMOTE_START_SURCHARGE_PER_100KM = 500; // kr
  const LONG_DISTANCE_SURCHARGE_PER_100KM = 400; // kr

  // Calculate H (number of addresses without elevator)
  let H = 0;
  switch (elevatorInfo) {
    case 'båda':
      H = 0;
      break;
    case 'från':
      H = 1; // Only to-address lacks elevator
      break;
    case 'till':
      H = 1; // Only from-address lacks elevator
      break;
    case 'ingen':
      H = 2;
      break;
  }

  // Base calculations
  const startFee = START_FEE;
  const elevatorFee = H * ELEVATOR_FEE_PER_ADDRESS;
  const volumeCost = volume * VOLUME_COST_PER_M3;
  const distanceCost = movingDistance * DISTANCE_COST_PER_KM;

  // Remote start surcharge (only if both addresses are > 100km from base)
  let remoteStartSurcharge = 0;
  if (baseToStartDistance > 100 && baseToEndDistance > 100) {
    remoteStartSurcharge = Math.ceil(baseToStartDistance / 100) * REMOTE_START_SURCHARGE_PER_100KM;
  }

  // Long distance surcharge (only if moving distance > 100km)
  let longDistanceSurcharge = 0;
  if (movingDistance > 100) {
    longDistanceSurcharge = Math.ceil((movingDistance - 100) / 100) * LONG_DISTANCE_SURCHARGE_PER_100KM;
  }

  const totalPrice = startFee + elevatorFee + volumeCost + distanceCost + remoteStartSurcharge + longDistanceSurcharge;

  return {
    startFee,
    elevatorFee,
    volumeCost,
    distanceCost,
    remoteStartSurcharge,
    longDistanceSurcharge,
    totalPrice: Math.round(totalPrice)
  };
};

export const formatPriceBreakdown = (calculation: PriceCalculation): string => {
  let breakdown = `Prisberäkning:\n`;
  breakdown += `• Startavgift: ${calculation.startFee} kr\n`;
  breakdown += `• Hissavgift: ${calculation.elevatorFee} kr\n`;
  breakdown += `• Volymkostnad: ${calculation.volumeCost} kr\n`;
  breakdown += `• Sträckkostnad: ${calculation.distanceCost} kr\n`;
  
  if (calculation.remoteStartSurcharge > 0) {
    breakdown += `• Tillägg för avlägsen startort: ${calculation.remoteStartSurcharge} kr\n`;
  }
  
  if (calculation.longDistanceSurcharge > 0) {
    breakdown += `• Tillägg för lång flyttsträcka: ${calculation.longDistanceSurcharge} kr\n`;
  }
  
  breakdown += `\n**Total preliminär kostnad: ${calculation.totalPrice} kr** (inkl. RUT-avdrag)`;
  
  return breakdown;
};
