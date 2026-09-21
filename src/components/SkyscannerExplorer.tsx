import React, { useState } from 'react';
import { Compass, ArrowRight, Plane, ShieldCheck } from 'lucide-react';
import { FlightQuote } from '../types';
import { FLIGHT_QUOTES } from '../data/rawQuotesData';
import { calculateFareDisaggregation } from '../services/fareService';

export const SkyscannerExplorer: React.FC = () => {
  const [origin, setOrigin] = useState<string>('DEL');
  const [destination, setDestination] = useState<string>('BOM');
  const [advanceWindow, setAdvanceWindow] = useState<string>('ALL');
  const [airlineFilter, setAirlineFilter] = useState<string>('ALL');
  const [selectedQuote, setSelectedQuote] = useState<FlightQuote | null>(null);

  // Filter quotes based on selection
  const filteredQuotes = FLIGHT_QUOTES.filter(q => {
    if (origin !== 'ALL' && q.origin !== origin) return false;
    if (destination !== 'ALL' && q.destination !== destination) return false;
    if (advanceWindow !== 'ALL' && q.advanceWindow !== advanceWindow) return false;
    if (airlineFilter !== 'ALL' && q.airline !== airlineFilter) return false;
    return true;
  });

  const airportOptions = [
    { code: 'ALL', name: 'All Airports' },
    { code: 'DEL', name: 'DEL - Delhi (IGI)' },
    { code: 'BOM', name: 'BOM - Mumbai (CSMIA)' },
    { code: 'BLR', name: 'BLR - Bengaluru (KIA)' },
    { code: 'HYD', name: 'HYD - Hyderabad (RGIA)' },
    { code: 'CCU', name: 'CCU - Kolkata (NSCBI)' },
    { code: 'MAA', name: 'MAA - Chennai (MAA)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Search Header */}
      <div className="fp-card">
        <div className="fp-card-header">
          <div>
            <h2 className="fp-card-title">
              <Compass size={18} color="var(--accent-navy)" />
              Skyscanner-Style Route-Level Index Explorer & Live Quotes
            </h2>
            <p className="fp-card-subtitle">
              Inspect granular flight quotations, OTA fees, and isolate statutory UDF & GST levies from carrier base yield
            </p>
          </div>
          <span className="status-badge live">
            <ShieldCheck size={13} /> GDS & Direct Scrape Stream
          </span>
        </div>

        {/* Skyscanner Search Bar */}
        <div style={{
          background: 'var(--bg-surface-subtle)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              ORIGIN AIRPORT
            </label>
            <select
              className="fp-select"
              style={{ width: '100%', fontWeight: 600 }}
              value={origin}
              onChange={e => setOrigin(e.target.value)}
            >
              {airportOptions.map(opt => (
                <option key={opt.code} value={opt.code}>{opt.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              DESTINATION AIRPORT
            </label>
            <select
              className="fp-select"
              style={{ width: '100%', fontWeight: 600 }}
              value={destination}
              onChange={e => setDestination(e.target.value)}
            >
              {airportOptions.map(opt => (
                <option key={opt.code} value={opt.code}>{opt.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              ADVANCE WINDOW
            </label>
            <select
              className="fp-select"
              style={{ width: '100%', fontWeight: 600 }}
              value={advanceWindow}
              onChange={e => setAdvanceWindow(e.target.value)}
            >
              <option value="ALL">All Windows</option>
              <option value="T+1">T+1 (Tomorrow - Dynamic Surge)</option>
              <option value="T+7">T+7 (1 Week Out)</option>
              <option value="T+15">T+15 (2 Weeks Out)</option>
              <option value="T+30">T+30 (1 Month Out)</option>
              <option value="T+45">T+45 (Early Bird Base)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              AIR CARRIER
            </label>
            <select
              className="fp-select"
              style={{ width: '100%', fontWeight: 600 }}
              value={airlineFilter}
              onChange={e => setAirlineFilter(e.target.value)}
            >
              <option value="ALL">All Airlines</option>
              <option value="IndiGo">IndiGo</option>
              <option value="Air India">Air India</option>
              <option value="Akasa Air">Akasa Air</option>
              <option value="SpiceJet">SpiceJet</option>
            </select>
          </div>

          <div>
            <button
              className="fp-btn fp-btn-primary"
              style={{ width: '100%', height: '38px' }}
              onClick={() => {
                // If no results for specific pair, reset to show all for demo ease
                if (filteredQuotes.length === 0) {
                  setOrigin('ALL');
                  setDestination('ALL');
                }
              }}
            >
              Query Quotes ({filteredQuotes.length})
            </button>
          </div>
        </div>

        {/* Results summary */}
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
          <span>
            Showing <strong>{filteredQuotes.length}</strong> matching live quotes from verified OTA & airline portals
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            Quotes refreshed at high frequency via Playwright JSON interceptors
          </span>
        </div>
      </div>

      {/* Flight Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredQuotes.length === 0 ? (
          <div className="fp-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Plane size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem', display: 'block' }} />
            <h3 style={{ color: 'var(--accent-navy)', marginBottom: '0.5rem' }}>No Quotes Found for this Sector Pair</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Try setting Origin or Destination to "All Airports" or resetting filters.
            </p>
            <button
              className="fp-btn fp-btn-outline"
              onClick={() => {
                setOrigin('ALL');
                setDestination('ALL');
                setAdvanceWindow('ALL');
                setAirlineFilter('ALL');
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredQuotes.map(quote => {
            const disagg = calculateFareDisaggregation(quote);
            return (
              <div
                key={quote.id}
                className="fp-card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  padding: '1.25rem'
                }}
              >
                {/* Airline & Flight Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    background: quote.airline === 'IndiGo' ? '#1E40AF' : quote.airline === 'Air India' ? '#DC2626' : quote.airline === 'Akasa Air' ? '#EA580C' : '#9333EA',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.78rem'
                  }}>
                    {quote.airline.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-navy)', fontSize: '1rem' }}>
                      {quote.airline}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>Flight {quote.flightNumber}</span>
                      <span>&bull;</span>
                      <span style={{
                        background: 'var(--accent-saffron-bg)',
                        color: 'var(--accent-saffron)',
                        padding: '1px 5px',
                        borderRadius: 3,
                        fontWeight: 700
                      }}>
                        {quote.advanceWindow}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timing & Route */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-navy)' }}>
                      {quote.departureTime}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {quote.origin}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '90px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{quote.duration}</span>
                    <div style={{ width: '100%', height: 2, background: 'var(--border-color)', position: 'relative', margin: '4px 0' }}>
                      <ArrowRight size={12} color="var(--text-muted)" style={{ position: 'absolute', right: 0, top: -5 }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--status-success)', fontWeight: 600 }}>{quote.stops}</span>
                  </div>

                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-navy)' }}>
                      {quote.arrivalTime}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {quote.destination}
                    </div>
                  </div>
                </div>

                {/* Fare & Source */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', textAlign: 'right' }}>
                  <div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-navy)', fontFamily: 'var(--font-heading)' }}>
                      ₹{quote.totalFare.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Base: ₹{quote.baseFare.toLocaleString('en-IN')} ({disagg.basePct}%)
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--status-info)', marginTop: 2 }}>
                      via {quote.sourcePortal}
                    </div>
                  </div>

                  <button
                    className="fp-btn fp-btn-outline fp-btn-sm"
                    onClick={() => setSelectedQuote(quote)}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    View Breakdown
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Fare Disaggregation Modal */}
      {selectedQuote && (
        <div className="modal-backdrop" onClick={() => setSelectedQuote(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0, color: 'var(--accent-navy)' }}>
                  Fare Component Disaggregation: {selectedQuote.flightNumber} ({selectedQuote.airline})
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Sector: {selectedQuote.origin} → {selectedQuote.destination} &bull; Window: {selectedQuote.advanceWindow} &bull; Source: {selectedQuote.sourcePortal}
                </span>
              </div>
              <button
                className="fp-btn fp-btn-outline fp-btn-sm"
                onClick={() => setSelectedQuote(null)}
              >
                ✕ Close
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                background: 'var(--bg-surface-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Consumer Outlay</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-navy)' }}>
                    ₹{selectedQuote.totalFare.toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={{
                  background: 'var(--accent-saffron-bg)',
                  border: '1px solid var(--accent-saffron-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--accent-saffron)'
                }}>
                  {selectedQuote.advanceWindow} Advance Pricing
                </div>
              </div>

              {/* Progress Bar of Component Share */}
              <div>
                <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 8 }}>
                  <div
                    style={{ width: `${calculateFareDisaggregation(selectedQuote).basePct}%`, background: 'var(--accent-navy)' }}
                    title={`Base Fare: ${calculateFareDisaggregation(selectedQuote).basePct}%`}
                  />
                  <div
                    style={{ width: `${calculateFareDisaggregation(selectedQuote).udfPct}%`, background: 'var(--accent-saffron)' }}
                    title={`UDF: ${calculateFareDisaggregation(selectedQuote).udfPct}%`}
                  />
                  <div
                    style={{ width: `${calculateFareDisaggregation(selectedQuote).taxPct}%`, background: 'var(--status-info)' }}
                    title={`Taxes & GST: ${calculateFareDisaggregation(selectedQuote).taxPct}%`}
                  />
                  <div
                    style={{ width: `${calculateFareDisaggregation(selectedQuote).feePct}%`, background: '#94A3B8' }}
                    title={`Convenience Fee: ${calculateFareDisaggregation(selectedQuote).feePct}%`}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>■ Base Fare ({calculateFareDisaggregation(selectedQuote).basePct}%)</span>
                  <span>■ UDF Airport ({calculateFareDisaggregation(selectedQuote).udfPct}%)</span>
                  <span>■ Taxes/GST ({calculateFareDisaggregation(selectedQuote).taxPct}%)</span>
                  <span>■ Platform Fee ({calculateFareDisaggregation(selectedQuote).feePct}%)</span>
                </div>
              </div>

              {/* Detailed Line Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Air Carrier Base Fare (BF)</span>
                  <strong>₹{selectedQuote.baseFare.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>User Development Fee (UDF - AAI/Private Airport)</span>
                  <strong>₹{selectedQuote.udf.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Passenger Service Fee (PSF - CISF Security)</span>
                  <strong>₹{selectedQuote.psf.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Aviation GST (K3 Tariff - 5% Economy)</span>
                  <strong>₹{selectedQuote.gst.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>OTA / Airline Convenience Fee</span>
                  <strong>₹{selectedQuote.convenienceFee.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1rem',
                  fontWeight: 800,
                  borderTop: '2px solid var(--border-color)',
                  paddingTop: '0.6rem',
                  color: 'var(--accent-navy)'
                }}>
                  <span>Total Scraped Quotation</span>
                  <span style={{ color: 'var(--accent-saffron)' }}>
                    ₹{selectedQuote.totalFare.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                background: '#F0F9FF',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #BAE6FD'
              }}>
                ℹ️ <strong>CPI Measurement Insight:</strong> Manual physical price collection typically queries full counter walk-in fares or static brochures. Farepulse unbundles the pure airline pricing yield from fixed statutory airport infrastructure charges (UDF/PSF) so that monetary policy models observe true core price pressure.
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="fp-btn fp-btn-primary"
                onClick={() => setSelectedQuote(null)}
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
