import { FlightQuote } from '../types';
import { FLIGHT_QUOTES } from '../data/rawQuotesData';

export interface SearchFilter {
  origin: string;
  destination: string;
  advanceWindow?: string;
  airline?: string;
  maxStops?: string;
}

export function searchFlightQuotes(filter: SearchFilter): FlightQuote[] {
  return FLIGHT_QUOTES.filter(quote => {
    if (filter.origin && filter.origin !== 'ALL' && quote.origin !== filter.origin) {
      return false;
    }
    if (filter.destination && filter.destination !== 'ALL' && quote.destination !== filter.destination) {
      return false;
    }
    if (filter.advanceWindow && filter.advanceWindow !== 'ALL' && quote.advanceWindow !== filter.advanceWindow) {
      return false;
    }
    if (filter.airline && filter.airline !== 'ALL' && quote.airline !== filter.airline) {
      return false;
    }
    return true;
  });
}

export function calculateFareDisaggregation(quote: FlightQuote) {
  const basePct = Number(((quote.baseFare / quote.totalFare) * 100).toFixed(1));
  const udfPct = Number(((quote.udf / quote.totalFare) * 100).toFixed(1));
  const taxPct = Number((((quote.psf + quote.gst) / quote.totalFare) * 100).toFixed(1));
  const feePct = Number(((quote.convenienceFee / quote.totalFare) * 100).toFixed(1));

  return {
    baseFare: quote.baseFare,
    basePct,
    udf: quote.udf,
    udfPct,
    taxes: quote.psf + quote.gst,
    taxPct,
    convenienceFee: quote.convenienceFee,
    feePct,
    totalFare: quote.totalFare
  };
}
