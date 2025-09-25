/**
 * Price calculation service for Smartflytt moving quotes
 * Handles all pricing logic, rates, and cost breakdowns
 */

import type { DistanceData, PriceCalculation } from '@/types';

// Base rates and fees (exported for testing)
export const BASE_RATES = {
  START_FEE: 2500,
  VOLUME_RATE: 300, // kr per m³
  REMOTE_THRESHOLD: 50, // km
  REMOTE_RATE: 15, // kr per km above threshold
  LONG_DISTANCE_THRESHOLD: 300, // km
  LONG_DISTANCE_RATE: 25, // kr per km above threshold
} as const;

export const ELEVATOR_FEE = {
  BOTH: 0,
  FROM_ONLY: 800,
  TO_ONLY: 800,
  NONE: 1500,
} as const;

export const RATE_DISTANCE_START = 30; // kr per km

type ElevatorOption = 'båda' | 'från' | 'till' | 'ingen';

/**
 * Calculate moving price based on volume, distance, and elevator availability
 * Returns breakdown of all costs and total price
 */
export const calculatePrice = (
  volume: number,
  distanceData: DistanceData,
  elevator: ElevatorOption,
): PriceCalculation => {
  const { movingDistance, baseToStartDistance, baseToEndDistance } = distanceData;

  // Base costs
  const startFee = BASE_RATES.START_FEE;
  const volumeCost = Math.round(volume * BASE_RATES.VOLUME_RATE);
  const distanceCost = Math.round(movingDistance * RATE_DISTANCE_START);

  // Elevator fee based on availability
  let elevatorFee = 0;
  switch (elevator) {
    case 'båda':
      elevatorFee = ELEVATOR_FEE.BOTH;
      break;
    case 'från':
      elevatorFee = ELEVATOR_FEE.FROM_ONLY;
      break;
    case 'till':
      elevatorFee = ELEVATOR_FEE.TO_ONLY;
      break;
    case 'ingen':
      elevatorFee = ELEVATOR_FEE.NONE;
      break;
  }

  // Remote start surcharge (if start location is far from base)
  const remoteStartSurcharge =
    baseToStartDistance > BASE_RATES.REMOTE_THRESHOLD
      ? Math.round((baseToStartDistance - BASE_RATES.REMOTE_THRESHOLD) * BASE_RATES.REMOTE_RATE)
      : 0;

  // Long distance surcharge (for very long moves)
  const longDistanceSurcharge =
    movingDistance > BASE_RATES.LONG_DISTANCE_THRESHOLD
      ? Math.round(
          (movingDistance - BASE_RATES.LONG_DISTANCE_THRESHOLD) * BASE_RATES.LONG_DISTANCE_RATE,
        )
      : 0;

  // Calculate total price
  const totalPrice =
    startFee +
    elevatorFee +
    volumeCost +
    distanceCost +
    remoteStartSurcharge +
    longDistanceSurcharge;

  return {
    startFee,
    elevatorFee,
    volumeCost,
    distanceCost,
    remoteStartSurcharge,
    longDistanceSurcharge,
    totalPrice: Math.round(totalPrice),
  };
};

/**
 * Format price calculation into human-readable Swedish breakdown
 */
export const formatPriceBreakdown = (calculation: PriceCalculation): string => {
  let breakdown = `💰 **PRELIMINÄR PRISBERÄKNING**\n\n`;
  breakdown += `📋 Kostnadsuppdelning:\n`;
  breakdown += `• Startavgift: ${calculation.startFee.toLocaleString('sv-SE')} kr\n`;
  
  if (calculation.elevatorFee > 0) {
    breakdown += `• Hisstillägg: ${calculation.elevatorFee.toLocaleString('sv-SE')} kr\n`;
  }
  
  breakdown += `• Volymkostnad: ${calculation.volumeCost.toLocaleString('sv-SE')} kr\n`;
  breakdown += `• Sträckkostnad: ${calculation.distanceCost.toLocaleString('sv-SE')} kr\n`;

  if (calculation.remoteStartSurcharge > 0) {
    breakdown += `• Avlägsenhetstillägg: ${calculation.remoteStartSurcharge.toLocaleString('sv-SE')} kr\n`;
  }

  if (calculation.longDistanceSurcharge > 0) {
    breakdown += `• Långdistanstillägg: ${calculation.longDistanceSurcharge.toLocaleString('sv-SE')} kr\n`;
  }

  breakdown += `\n🔢 **Total preliminär kostnad: ${calculation.totalPrice.toLocaleString('sv-SE')} kr**\n`;
  breakdown += `💡 *Priset inkluderar RUT-avdrag*\n\n`;
  breakdown += `⚠️ **VIKTIGT:** Detta är en preliminär beräkning som inte är bindande. `;
  breakdown += `Slutlig offert bekräftas efter granskning av vårt team och eventuell besiktning.`;

  return breakdown;
};