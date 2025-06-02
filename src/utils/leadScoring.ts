
export interface LeadScore {
  score: number;
  quality: 'Premium' | 'Standard' | 'Basic';
  factors: string[];
}

function calculateDaysUntilMove(dateStr: string): number {
  const today = new Date();
  const moveDate = new Date(dateStr);
  return Math.floor((moveDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export const calculateLeadQuality = (quoteData: any): LeadScore => {
  let score = 0;
  const factors: string[] = [];

  // Volume scoring
  if (quoteData.volume && quoteData.volume > 80) {
    score += 30;
    factors.push('Stor flytt (>80m³)');
  } else if (quoteData.volume && quoteData.volume > 40) {
    score += 20;
    factors.push('Mellan flytt (40-80m³)');
  }

  // Distance scoring
  if (quoteData.distanceData?.movingDistance && quoteData.distanceData.movingDistance > 100) {
    score += 25;
    factors.push('Långdistans (>100km)');
  }

  // Urgency scoring
  if (calculateDaysUntilMove(quoteData.date) <= 14) {
    score += 20;
    factors.push('Akut (inom 2 veckor)');
  }

  // Value scoring
  if (quoteData.priceCalculation?.totalPrice && quoteData.priceCalculation.totalPrice > 15000) {
    score += 25;
    factors.push('Högt värde (>15k)');
  }

  // Determine quality tier
  let quality: 'Premium' | 'Standard' | 'Basic';
  if (score >= 70) {
    quality = 'Premium';
  } else if (score >= 40) {
    quality = 'Standard';
  } else {
    quality = 'Basic';
  }

  return { score, quality, factors };
};
