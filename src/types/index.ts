// Core Types for Farepulse National Airfare Price Index System

export type Frequency = 'daily' | 'weekly' | 'monthly';
export type TimeRange = '7d' | '30d' | '90d' | '1y';

export interface IndexDataPoint {
  date: string;
  apix: number;             // Real-Time Airfare Price Index (Base 2024 = 100)
  cpiBaseline: number;      // Official MoSPI CPI Transport Sub-Index (Manual)
  dgcaAverage: number;      // DGCA Monthly Average Benchmark
  volume: number;           // Daily scraped quotes count
  divergence: number;       // APIx - CPI Baseline gap (in index points)
  baseFareIndex: number;
  taxFeeIndex: number;
}

export type RouteBucketType = 'metro' | 'tier2' | 'regional';

export interface RouteItem {
  id: string;
  sector: string;           // e.g. "DEL-BOM"
  originCity: string;
  originCode: string;
  destCity: string;
  destCode: string;
  bucket: RouteBucketType;
  dgcaTrafficWeight: number; // Percentage share (e.g. 11.4%)
  annualPassengers: string;  // e.g. "3.2M pax"
  avgFare: number;           // e.g. ₹5,850
  dodChange: number;         // Day over day %
  volatilityIndex: number;   // 1 to 10
  topCarriers: string[];
  baseFarePct: number;
  udfFee: number;
  taxPct: number;
}

export interface LeadTimePoint {
  window: 'T+1' | 'T+7' | 'T+15' | 'T+30' | 'T+45';
  days: number;
  avgFare: number;
  indigoFare: number;
  airIndiaFare: number;
  akasaFare: number;
  spiceJetFare: number;
  surgeMultiplier: number;
}

export interface FlightQuote {
  id: string;
  flightNumber: string;
  airline: 'IndiGo' | 'Air India' | 'Akasa Air' | 'SpiceJet' | 'Air India Express';
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  advanceWindow: string; // T+1, T+7, etc.
  baseFare: number;
  udf: number;
  psf: number;
  gst: number;
  convenienceFee: number;
  totalFare: number;
  sourcePortal: string; // MakeMyTrip, EaseMyTrip, Indigo Direct, etc.
  scrapedTimestamp: string;
}

export interface AuditRecord {
  id: string;
  quoteId: string;
  airline: string;
  route: string;
  source: string;
  timestamp: string;
  status: 'valid' | 'outlier_pruned' | 'sold_out_filtered';
  rawPayload: Record<string, unknown>;
  cleanedRecord: {
    baseFare: number;
    taxes: number;
    udf: number;
    convenienceFee: number;
    totalFare: number;
    normalizedAt: string;
  };
  indexWeight: number;
  contributionPoints: number;
}

export interface ApiEndpointDoc {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  title: string;
  description: string;
  params: { name: string; type: string; required: boolean; description: string }[];
  responseExample: Record<string, unknown>;
  pythonCode: string;
  curlCode: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Methodology' | 'Data & Scraping' | 'RBI Policy' | 'Compliance';
}
