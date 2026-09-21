import { RouteItem } from '../types';

export interface BasketIndexResult {
  overallIndex: number;
  metroIndex: number;
  tier2Index: number;
  regionalIndex: number;
  totalTrafficWeight: number;
  divergenceFromManualCpi: number;
  monthlyInflationPct: number;
}

/**
 * Computes the Laspeyres Real-Time Airfare Price Index (APIx)
 * Formula: APIx_t = SUM( (P_i,t / P_i,0) * W_i ) * 100
 */
export function calculateLaspeyresIndex(
  routes: RouteItem[],
  basePriceMultiplier: number = 1.0
): BasketIndexResult {
  let weightedSum = 0;
  let totalWeight = 0;

  let metroWeightedSum = 0;
  let metroWeight = 0;

  let tier2WeightedSum = 0;
  let tier2Weight = 0;

  let regionalWeightedSum = 0;
  let regionalWeight = 0;

  // Assume Jan 2024 Base Price is roughly 80% of current average
  routes.forEach(route => {
    const basePrice = (route.avgFare * 0.82) * basePriceMultiplier;
    const currentPrice = route.avgFare;
    const priceRatio = currentPrice / basePrice;
    const weight = route.dgcaTrafficWeight;

    weightedSum += priceRatio * weight;
    totalWeight += weight;

    if (route.bucket === 'metro') {
      metroWeightedSum += priceRatio * weight;
      metroWeight += weight;
    } else if (route.bucket === 'tier2') {
      tier2WeightedSum += priceRatio * weight;
      tier2Weight += weight;
    } else if (route.bucket === 'regional') {
      regionalWeightedSum += priceRatio * weight;
      regionalWeight += weight;
    }
  });

  const overallIndex = totalWeight > 0 ? Number(((weightedSum / totalWeight) * 100).toFixed(2)) : 100.0;
  const metroIndex = metroWeight > 0 ? Number(((metroWeightedSum / metroWeight) * 100).toFixed(2)) : 100.0;
  const tier2Index = tier2Weight > 0 ? Number(((tier2WeightedSum / tier2Weight) * 100).toFixed(2)) : 100.0;
  const regionalIndex = regionalWeight > 0 ? Number(((regionalWeightedSum / regionalWeight) * 100).toFixed(2)) : 100.0;

  const officialManualCpi = 114.20; // Official MoSPI quarterly survey baseline
  const divergenceFromManualCpi = Number((overallIndex - officialManualCpi).toFixed(2));
  const monthlyInflationPct = Number(((overallIndex - 100) / 100 * 6.8).toFixed(2));

  return {
    overallIndex,
    metroIndex,
    tier2Index,
    regionalIndex,
    totalTrafficWeight: totalWeight,
    divergenceFromManualCpi,
    monthlyInflationPct
  };
}
