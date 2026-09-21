import React, { useState } from 'react';
import { Activity, Clock, Compass, Info } from 'lucide-react';
import { ROUTE_ELASTICITY_MAP, LEAD_TIME_ELASTICITY } from '../data/elasticityData';

export const LeadTimeElasticity: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<string>('DEL-BOM');
  const [activeCarrier, setActiveCarrier] = useState<'all' | 'indigo' | 'airIndia' | 'akasa' | 'spiceJet'>('all');

  const elasticityData = ROUTE_ELASTICITY_MAP[selectedSector] || LEAD_TIME_ELASTICITY;

  const width = 840;
  const height = 300;
  const padding = { top: 25, right: 30, bottom: 45, left: 55 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const allFares = elasticityData.flatMap(d => [d.indigoFare, d.airIndiaFare, d.akasaFare, d.spiceJetFare]);
  const minFare = Math.floor(Math.min(...allFares) * 0.85);
  const maxFare = Math.ceil(Math.max(...allFares) * 1.1);

  const getX = (idx: number) => padding.left + (idx / (elasticityData.length - 1)) * chartWidth;
  const getY = (fare: number) => padding.top + chartHeight - ((fare - minFare) / (maxFare - minFare)) * chartHeight;

  const makePath = (key: 'avgFare' | 'indigoFare' | 'airIndiaFare' | 'akasaFare' | 'spiceJetFare') => {
    return elasticityData.reduce((acc, d, idx) => {
      const x = getX(idx);
      const y = getY(d[key]);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  const avgPath = makePath('avgFare');
  const indigoPath = makePath('indigoFare');
  const airIndiaPath = makePath('airIndiaFare');
  const akasaPath = makePath('akasaFare');
  const spiceJetPath = makePath('spiceJetFare');

  const gridTicks = 5;
  const gridValues = Array.from({ length: gridTicks }, (_, i) => minFare + (i * (maxFare - minFare)) / (gridTicks - 1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="fp-card">
        <div className="fp-card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="fp-card-title">
              <Activity size={18} color="var(--accent-navy)" />
              Lead-Time Elasticity Curves (T+1 to T+45 Advance Purchase Windows)
            </h2>
            <p className="fp-card-subtitle">
              Quantifying dynamic surge multipliers as the departure window narrows across leading Indian domestic carriers
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={14} color="var(--text-muted)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Sector:</span>
              <select
                className="fp-select fp-btn-sm"
                value={selectedSector}
                onChange={e => setSelectedSector(e.target.value)}
                style={{ fontWeight: 700 }}
              >
                <option value="DEL-BOM">DEL-BOM (Delhi ⇄ Mumbai)</option>
                <option value="BLR-HYD">BLR-HYD (Bengaluru ⇄ Hyderabad)</option>
                <option value="CCU-GAU">CCU-GAU (Kolkata ⇄ Guwahati)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Carrier:</span>
              <select
                className="fp-select fp-btn-sm"
                value={activeCarrier}
                onChange={e => setActiveCarrier(e.target.value as any)}
              >
                <option value="all">All Carriers (Comparison)</option>
                <option value="indigo">IndiGo Only</option>
                <option value="airIndia">Air India Only</option>
                <option value="akasa">Akasa Air Only</option>
                <option value="spiceJet">SpiceJet Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lead Time Metrics Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}>
          {elasticityData.map((d) => (
            <div
              key={d.window}
              style={{
                background: d.window === 'T+1' ? 'var(--status-danger-bg)' : 'var(--bg-surface-subtle)',
                border: d.window === 'T+1' ? '1px solid #FECACA' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                textAlign: 'center'
              }}
            >
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: d.window === 'T+1' ? 'var(--status-danger)' : 'var(--accent-navy)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3
              }}>
                <Clock size={11} /> {d.window} ({d.days} Day{d.days > 1 ? 's' : ''})
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-navy)', margin: '0.2rem 0' }}>
                ₹{d.avgFare.toLocaleString('en-IN')}
              </div>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: d.surgeMultiplier > 2.0 ? 'var(--status-danger)' : d.surgeMultiplier > 1.2 ? 'var(--accent-saffron)' : 'var(--status-success)'
              }}>
                {d.surgeMultiplier}x Surge
              </div>
            </div>
          ))}
        </div>

        {/* SVG Elasticity Chart */}
        <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* Grid lines */}
            {gridValues.map((val, i) => {
              const y = getY(val);
              return (
                <g key={`grid-${i}`}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="var(--border-color)"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    fill="var(--text-muted)"
                    fontSize="11"
                    fontFamily="var(--font-mono)"
                  >
                    ₹{val.toLocaleString('en-IN')}
                  </text>
                </g>
              );
            })}

            {/* Carrier Lines */}
            {(activeCarrier === 'all' || activeCarrier === 'airIndia') && (
              <path
                d={airIndiaPath}
                fill="none"
                stroke="#DC2626"
                strokeWidth={activeCarrier === 'airIndia' ? 3.5 : 2}
                opacity={activeCarrier === 'all' ? 0.75 : 1}
              />
            )}

            {(activeCarrier === 'all' || activeCarrier === 'indigo') && (
              <path
                d={indigoPath}
                fill="none"
                stroke="#2563EB"
                strokeWidth={activeCarrier === 'indigo' ? 3.5 : 2}
                opacity={activeCarrier === 'all' ? 0.75 : 1}
              />
            )}

            {(activeCarrier === 'all' || activeCarrier === 'akasa') && (
              <path
                d={akasaPath}
                fill="none"
                stroke="#EA580C"
                strokeWidth={activeCarrier === 'akasa' ? 3.5 : 2}
                opacity={activeCarrier === 'all' ? 0.75 : 1}
              />
            )}

            {(activeCarrier === 'all' || activeCarrier === 'spiceJet') && (
              <path
                d={spiceJetPath}
                fill="none"
                stroke="#9333EA"
                strokeWidth={activeCarrier === 'spiceJet' ? 3.5 : 2}
                opacity={activeCarrier === 'all' ? 0.75 : 1}
              />
            )}

            {/* Sector Average Curve (Bold Navy) */}
            {activeCarrier === 'all' && (
              <path
                d={avgPath}
                fill="none"
                stroke="var(--accent-navy)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            )}

            {/* Point Markers and Labels */}
            {elasticityData.map((d, idx) => {
              const x = getX(idx);
              const y = getY(d.avgFare);
              return (
                <g key={`pt-${idx}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill="var(--accent-navy)"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={height - 12}
                    textAnchor="middle"
                    fill="var(--accent-navy)"
                    fontWeight="700"
                    fontSize="12"
                  >
                    {d.window}
                  </text>
                  <text
                    x={x}
                    y={height - 26}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="10"
                  >
                    ({d.days}d out)
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div style={{
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.78rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 4, background: 'var(--accent-navy)', borderRadius: 2 }}></span>
              <strong>Sector Weighted Mean</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 3, background: '#2563EB', borderRadius: 2 }}></span>
              <span>IndiGo</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 3, background: '#DC2626', borderRadius: 2 }}></span>
              <span>Air India</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 3, background: '#EA580C', borderRadius: 2 }}></span>
              <span>Akasa Air</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 3, background: '#9333EA', borderRadius: 2 }}></span>
              <span>SpiceJet</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
            <Info size={12} />
            <span>Demonstrates that manual counter queries (typically captured at T+30) underestimate short-notice inflation by ~2.97x</span>
          </div>
        </div>
      </div>
    </div>
  );
};
