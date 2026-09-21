import { LeadTimePoint } from '../types';

export const LEAD_TIME_ELASTICITY: LeadTimePoint[] = [
  {
    window: 'T+1',
    days: 1,
    avgFare: 11450,
    indigoFare: 10800,
    airIndiaFare: 13200,
    akasaFare: 9950,
    spiceJetFare: 10200,
    surgeMultiplier: 2.97
  },
  {
    window: 'T+7',
    days: 7,
    avgFare: 7650,
    indigoFare: 7200,
    airIndiaFare: 8600,
    akasaFare: 6850,
    spiceJetFare: 7100,
    surgeMultiplier: 1.98
  },
  {
    window: 'T+15',
    days: 15,
    avgFare: 5400,
    indigoFare: 5150,
    airIndiaFare: 6100,
    akasaFare: 4800,
    spiceJetFare: 5050,
    surgeMultiplier: 1.40
  },
  {
    window: 'T+30',
    days: 30,
    avgFare: 4200,
    indigoFare: 4050,
    airIndiaFare: 4750,
    akasaFare: 3850,
    spiceJetFare: 3950,
    surgeMultiplier: 1.09
  },
  {
    window: 'T+45',
    days: 45,
    avgFare: 3850,
    indigoFare: 3700,
    airIndiaFare: 4300,
    akasaFare: 3500,
    spiceJetFare: 3650,
    surgeMultiplier: 1.00 // Baseline advance fare
  }
];

export const ROUTE_ELASTICITY_MAP: Record<string, LeadTimePoint[]> = {
  'DEL-BOM': [
    { window: 'T+1', days: 1, avgFare: 12400, indigoFare: 11800, airIndiaFare: 14500, akasaFare: 10800, spiceJetFare: 11200, surgeMultiplier: 3.12 },
    { window: 'T+7', days: 7, avgFare: 8100, indigoFare: 7700, airIndiaFare: 9100, akasaFare: 7200, spiceJetFare: 7500, surgeMultiplier: 2.04 },
    { window: 'T+15', days: 15, avgFare: 5750, indigoFare: 5500, airIndiaFare: 6400, akasaFare: 5100, spiceJetFare: 5350, surgeMultiplier: 1.44 },
    { window: 'T+30', days: 30, avgFare: 4350, indigoFare: 4200, airIndiaFare: 4900, akasaFare: 3950, spiceJetFare: 4100, surgeMultiplier: 1.09 },
    { window: 'T+45', days: 45, avgFare: 3980, indigoFare: 3800, airIndiaFare: 4500, akasaFare: 3600, spiceJetFare: 3750, surgeMultiplier: 1.00 }
  ],
  'BLR-HYD': [
    { window: 'T+1', days: 1, avgFare: 6800, indigoFare: 6500, airIndiaFare: 7400, akasaFare: 5900, spiceJetFare: 6200, surgeMultiplier: 2.72 },
    { window: 'T+7', days: 7, avgFare: 4500, indigoFare: 4300, airIndiaFare: 5100, akasaFare: 3900, spiceJetFare: 4100, surgeMultiplier: 1.80 },
    { window: 'T+15', days: 15, avgFare: 3300, indigoFare: 3200, airIndiaFare: 3700, akasaFare: 2950, spiceJetFare: 3100, surgeMultiplier: 1.32 },
    { window: 'T+30', days: 30, avgFare: 2750, indigoFare: 2650, airIndiaFare: 3100, akasaFare: 2500, spiceJetFare: 2600, surgeMultiplier: 1.10 },
    { window: 'T+45', days: 45, avgFare: 2500, indigoFare: 2400, airIndiaFare: 2850, akasaFare: 2300, spiceJetFare: 2400, surgeMultiplier: 1.00 }
  ],
  'CCU-GAU': [
    { window: 'T+1', days: 1, avgFare: 7900, indigoFare: 7600, airIndiaFare: 8600, akasaFare: 7100, spiceJetFare: 7400, surgeMultiplier: 2.47 },
    { window: 'T+7', days: 7, avgFare: 5600, indigoFare: 5400, airIndiaFare: 6200, akasaFare: 4900, spiceJetFare: 5200, surgeMultiplier: 1.75 },
    { window: 'T+15', days: 15, avgFare: 4200, indigoFare: 4050, airIndiaFare: 4600, akasaFare: 3800, spiceJetFare: 3950, surgeMultiplier: 1.31 },
    { window: 'T+30', days: 30, avgFare: 3450, indigoFare: 3350, airIndiaFare: 3800, akasaFare: 3200, spiceJetFare: 3300, surgeMultiplier: 1.08 },
    { window: 'T+45', days: 45, avgFare: 3200, indigoFare: 3100, airIndiaFare: 3500, akasaFare: 2950, spiceJetFare: 3050, surgeMultiplier: 1.00 }
  ]
};
