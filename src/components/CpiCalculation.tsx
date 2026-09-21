import React, { useState } from 'react';
import { Calculator, Scale, Sliders, RefreshCcw } from 'lucide-react';
import { ROUTES_DATA } from '../data/routesData';
import { calculateLaspeyresIndex } from '../services/indexCalculation';

export const CpiCalculation: React.FC = () => {
  const [basePriceFactor, setBasePriceFactor] = useState<number>(1.0);
  const [metroWeightMultiplier, setMetroWeightMultiplier] = useState<number>(1.0);

  // Apply weight multiplier
  const adjustedRoutes = ROUTES_DATA.map(r => {
    if (r.bucket === 'metro') {
      return { ...r, dgcaTrafficWeight: r.dgcaTrafficWeight * metroWeightMultiplier };
    }
    return r;
  });

  const result = calculateLaspeyresIndex(adjustedRoutes, basePriceFactor);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title Card */}
      <div className="fp-card">
        <div className="fp-card-header">
          <div>
            <h2 className="fp-card-title">
              <Calculator size={18} color="var(--accent-navy)" />
              CPI Calculation Engine & Laspeyres Index Formulation
            </h2>
            <p className="fp-card-subtitle">
              Interactive mathematical breakdown of how high-frequency scraped price quotes are aggregated into the official Consumer Price Index framework
            </p>
          </div>
          <span className="status-badge live">
            <Scale size={13} /> MoSPI Laspeyres Standard
          </span>
        </div>

        {/* Laspeyres Mathematical Formula Presentation */}
        <div style={{
          background: 'var(--accent-navy)',
          color: '#FFFFFF',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          marginTop: '0.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-saffron-light)', fontWeight: 700 }}>
            Official Aggregation Formula (Ministry of Statistics & Programme Implementation)
          </div>

          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.4rem',
            margin: '0.75rem 0',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <span>APIx<sub>t</sub> =</span>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ borderBottom: '2px solid #FFFFFF', paddingBottom: 2 }}>
                &sum; ( (P<sub>i, t</sub> / P<sub>i, 0</sub>) &times; W<sub>i</sub> )
              </span>
              <span style={{ fontSize: '0.95rem', paddingTop: 2 }}>
                &sum; W<sub>i</sub>
              </span>
            </div>
            <span>&times; 100</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem', fontSize: '0.78rem', color: '#E2E8F0', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '0.75rem' }}>
            <div><strong>P<sub>i, t</sub>:</strong> Current cleaned price for sector i across T+1 to T+45 windows</div>
            <div><strong>P<sub>i, 0</sub>:</strong> Base period price (Jan 2024 standardized base)</div>
            <div><strong>W<sub>i</sub>:</strong> DGCA annual passenger-kilometer weight assigned to sector i</div>
          </div>
        </div>
      </div>

      {/* Comparison Grid: Real-Time APIx vs Manual MoSPI CPI Baseline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <div className="fp-card accent-saffron" style={{ borderLeft: '4px solid var(--accent-saffron)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Farepulse Dynamic APIx Index
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-navy)', margin: '0.4rem 0' }}>
            {result.overallIndex.toFixed(2)}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Aggregated from <strong>42,850 online quotations</strong> across top 13 DGCA sectors and advance purchase windows.
          </p>
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Metro Index: <strong>{result.metroIndex.toFixed(2)}</strong></span>
            <span>Tier-2 Index: <strong>{result.tier2Index.toFixed(2)}</strong></span>
            <span>Regional: <strong>{result.regionalIndex.toFixed(2)}</strong></span>
          </div>
        </div>

        <div className="fp-card" style={{ borderLeft: '4px solid var(--accent-navy)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Official MoSPI CPI Transport Sub-Index
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-navy)', margin: '0.4rem 0' }}>
            114.20
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Captured via <strong>manual physical price surveys</strong> at ticketing counters and offline retail outlets.
          </p>
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Frequency: Quarterly update &bull; Lacks dynamic algorithm surge capture
          </div>
        </div>

        <div className="fp-card" style={{ borderLeft: '4px solid var(--status-danger)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Measurement Divergence Gap
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--status-danger)', margin: '0.4rem 0' }}>
            +{result.divergenceFromManualCpi.toFixed(2)}
            <span style={{ fontSize: '1rem', fontWeight: 600, marginLeft: 4 }}>pts</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Dynamic online inflation premium that manual sampling currently fails to record in retail CPI.
          </p>
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--status-danger)', fontWeight: 600 }}>
            ▲ Manual CPI under-reports air travel inflation by ~{((result.divergenceFromManualCpi / 114.2) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <div className="fp-card">
        <div className="fp-card-header">
          <div>
            <h3 className="fp-card-title">
              <Sliders size={18} color="var(--accent-navy)" />
              Simulation Playground: Sensitivity Analysis for RBI Policy Team
            </h3>
            <p className="fp-card-subtitle">
              Adjust baseline assumptions to observe real-time recalculation of the national basket index
            </p>
          </div>
          <button
            className="fp-btn fp-btn-outline fp-btn-sm"
            onClick={() => {
              setBasePriceFactor(1.0);
              setMetroWeightMultiplier(1.0);
            }}
          >
            <RefreshCcw size={12} /> Reset Parameters
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', background: 'var(--bg-surface-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Base Period Normalization (P<sub>0</sub> Factor)</label>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{basePriceFactor.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.2"
              step="0.02"
              value={basePriceFactor}
              onChange={e => setBasePriceFactor(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-navy)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
              <span>0.80x (Lower base)</span>
              <span>1.00x (Standard Base Jan 2024)</span>
              <span>1.20x (Higher base)</span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Metro Corridors Traffic Weight Multiplier</label>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{metroWeightMultiplier.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.05"
              value={metroWeightMultiplier}
              onChange={e => setMetroWeightMultiplier(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-saffron)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
              <span>0.70x (Less Metro bias)</span>
              <span>1.00x (DGCA Standard)</span>
              <span>1.30x (Heavy Metro bias)</span>
            </div>
          </div>
        </div>

        {/* Breakdown by Route Category */}
        <div style={{ marginTop: '1.25rem' }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--accent-navy)' }}>
            Sector Basket Contribution Breakdown
          </h4>
          <div className="fp-table-wrapper">
            <table className="fp-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Traffic Weight Share</th>
                  <th>Category Index (APIx)</th>
                  <th>MoSPI CPI Divergence</th>
                  <th>Inflationary Pressure</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Bucket 1: High-Volume Metro Corridors</strong></td>
                  <td>{(42.6 * metroWeightMultiplier).toFixed(1)}%</td>
                  <td><strong style={{ color: 'var(--accent-navy)' }}>{result.metroIndex.toFixed(2)}</strong></td>
                  <td style={{ color: 'var(--status-danger)', fontWeight: 700 }}>+{(result.metroIndex - 114.2).toFixed(2)} pts</td>
                  <td><span className="status-badge live" style={{ background: '#FEF2F2', color: '#DC2626', border: 'none' }}>High Pressure</span></td>
                </tr>
                <tr>
                  <td><strong>Bucket 2: Tier-2 Growth & Tech Sectors</strong></td>
                  <td>34.8%</td>
                  <td><strong style={{ color: 'var(--accent-navy)' }}>{result.tier2Index.toFixed(2)}</strong></td>
                  <td style={{ color: 'var(--status-danger)', fontWeight: 700 }}>+{(result.tier2Index - 114.2).toFixed(2)} pts</td>
                  <td><span className="status-badge live" style={{ background: '#FFFBEB', color: '#D97706', border: 'none' }}>Moderate Pressure</span></td>
                </tr>
                <tr>
                  <td><strong>Bucket 3: Regional & UDAN Connectivity</strong></td>
                  <td>22.6%</td>
                  <td><strong style={{ color: 'var(--accent-navy)' }}>{result.regionalIndex.toFixed(2)}</strong></td>
                  <td style={{ color: 'var(--status-success)', fontWeight: 700 }}>+{(result.regionalIndex - 114.2).toFixed(2)} pts</td>
                  <td><span className="status-badge live" style={{ background: '#ECFDF5', color: '#059669', border: 'none' }}>Stable / UDAN Cap</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
