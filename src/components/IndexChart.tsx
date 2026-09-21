import React, { useState } from 'react';
import { Frequency, TimeRange, IndexDataPoint } from '../types';
import { DAILY_INDEX_DATA, WEEKLY_INDEX_DATA, MONTHLY_INDEX_DATA } from '../data/indexData';
import { Calendar, Sliders, Layers } from 'lucide-react';

interface IndexChartProps {
  frequency: Frequency;
  onFrequencyChange: (freq: Frequency) => void;
}

export const IndexChart: React.FC<IndexChartProps> = ({
  frequency,
  onFrequencyChange
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [showDgcaBenchmark, setShowDgcaBenchmark] = useState<boolean>(true);

  // Select appropriate dataset based on frequency
  let rawData: IndexDataPoint[] = DAILY_INDEX_DATA;
  if (frequency === 'weekly') rawData = WEEKLY_INDEX_DATA;
  if (frequency === 'monthly') rawData = MONTHLY_INDEX_DATA;

  // Filter according to time range
  let data = rawData;
  if (frequency === 'daily') {
    if (timeRange === '7d') data = rawData.slice(-7);
    else if (timeRange === '30d') data = rawData.slice(-30);
    else data = rawData;
  }

  // Calculate SVG bounds & scaling
  const width = 880;
  const height = 340;
  const padding = { top: 25, right: 30, bottom: 45, left: 55 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minVal = Math.floor(Math.min(...data.map(d => Math.min(d.apix, d.cpiBaseline, showDgcaBenchmark ? d.dgcaAverage : 999))) - 4);
  const maxVal = Math.ceil(Math.max(...data.map(d => Math.max(d.apix, d.cpiBaseline, showDgcaBenchmark ? d.dgcaAverage : 0))) + 4);

  const getX = (index: number) => padding.left + (index / (data.length - 1 || 1)) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - ((val - minVal) / (maxVal - minVal || 1)) * chartHeight;

  // Generate SVG path for a line
  const makeLinePath = (values: number[]) => {
    return values.reduce((acc, val, idx) => {
      const x = getX(idx);
      const y = getY(val);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  const apixPath = makeLinePath(data.map(d => d.apix));
  const cpiPath = makeLinePath(data.map(d => d.cpiBaseline));
  const dgcaPath = makeLinePath(data.map(d => d.dgcaAverage));

  // Area under APIx curve
  const apixArea = `${apixPath} L ${getX(data.length - 1)} ${getY(minVal)} L ${getX(0)} ${getY(minVal)} Z`;

  // Grid lines
  const gridTicks = 5;
  const gridValues = Array.from({ length: gridTicks }, (_, i) => minVal + (i * (maxVal - minVal)) / (gridTicks - 1));

  const activePoint = hoverIndex !== null && hoverIndex < data.length ? data[hoverIndex] : data[data.length - 1];

  return (
    <div className="fp-card" style={{ marginBottom: '1.5rem' }}>
      <div className="fp-card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="fp-card-title">
            <Layers size={18} color="var(--accent-navy)" />
            Real-Time Airfare Price Index (APIx) vs. MoSPI CPI Baseline
          </h2>
          <p className="fp-card-subtitle">
            Tracking high-frequency dynamic online fares against manual quarterly price collection (Base: Jan 2024 = 100)
          </p>
        </div>

        {/* Controls: Frequency Dropdown & Time Range Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Frequency Dropdown as specified in design.md line 19 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sliders size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Frequency:</span>
            <select
              className="fp-select fp-btn-sm"
              value={frequency}
              onChange={e => onFrequencyChange(e.target.value as Frequency)}
              style={{ fontWeight: 700 }}
              title="Select Index Frequency"
            >
              <option value="daily">Daily High-Frequency</option>
              <option value="weekly">Weekly Aggregated</option>
              <option value="monthly">Monthly Consolidated</option>
            </select>
          </div>

          {/* Time Range Selector */}
          {frequency === 'daily' && (
            <div style={{ display: 'flex', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', padding: 2 }}>
              {(['7d', '30d', '90d'] as TimeRange[]).map(range => (
                <button
                  key={range}
                  className={`fp-btn fp-btn-sm ${timeRange === range ? 'fp-btn-primary' : 'fp-btn-outline'}`}
                  onClick={() => setTimeRange(range)}
                  style={{ padding: '3px 8px', fontSize: '0.72rem', border: 'none' }}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {/* DGCA Benchmark toggle */}
          <button
            className={`fp-btn fp-btn-sm ${showDgcaBenchmark ? 'fp-btn-outline' : 'fp-btn-outline'}`}
            onClick={() => setShowDgcaBenchmark(!showDgcaBenchmark)}
            style={{
              borderColor: showDgcaBenchmark ? 'var(--status-info)' : 'var(--border-color)',
              color: showDgcaBenchmark ? 'var(--status-info)' : 'var(--text-muted)'
            }}
            title="Toggle DGCA Monthly Average Benchmark line"
          >
            {showDgcaBenchmark ? '● DGCA Benchmark Active' : '○ DGCA Benchmark Off'}
          </button>
        </div>
      </div>

      {/* Chart Legend & Live Inspector Value */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.6rem 1rem',
        background: 'var(--bg-surface-subtle)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1rem',
        fontSize: '0.78rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 14, height: 3, background: 'var(--accent-saffron)', borderRadius: 2, display: 'inline-block' }}></span>
            <strong>Farepulse APIx:</strong>
            <span style={{ color: 'var(--accent-saffron)', fontWeight: 800 }}>{activePoint.apix.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 14, height: 3, background: 'var(--accent-navy)', borderTop: '2px dashed #CBD5E1', display: 'inline-block' }}></span>
            <span>MoSPI CPI Baseline:</span>
            <span style={{ color: 'var(--accent-navy)', fontWeight: 700 }}>{activePoint.cpiBaseline.toFixed(2)}</span>
          </div>

          {showDgcaBenchmark && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 14, height: 3, background: 'var(--status-info)', display: 'inline-block' }}></span>
              <span>DGCA Benchmark:</span>
              <span style={{ color: 'var(--status-info)', fontWeight: 700 }}>{activePoint.dgcaAverage.toFixed(2)}</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--status-danger)', fontWeight: 700 }}>
              Divergence: +{activePoint.divergence.toFixed(2)} pts
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
          <Calendar size={13} />
          <span>Point Date: <strong>{activePoint.date}</strong></span>
        </div>
      </div>

      {/* SVG Interactive Time-Series Canvas */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block', userSelect: 'none' }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="apixGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-saffron)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--accent-saffron)" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y-axis labels */}
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
                  {val.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Area Fill under APIx */}
          <path d={apixArea} fill="url(#apixGradient)" />

          {/* MoSPI CPI Baseline Line (Navy, Dashed) */}
          <path
            d={cpiPath}
            fill="none"
            stroke="var(--accent-navy)"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            opacity="0.85"
          />

          {/* DGCA Benchmark Line (Teal, Dotted) */}
          {showDgcaBenchmark && (
            <path
              d={dgcaPath}
              fill="none"
              stroke="var(--status-info)"
              strokeWidth="2"
              strokeDasharray="2 3"
              opacity="0.9"
            />
          )}

          {/* Farepulse APIx Primary Line (Saffron, Solid) */}
          <path
            d={apixPath}
            fill="none"
            stroke="var(--accent-saffron)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X-axis date labels and interactive hover columns */}
          {data.map((point, idx) => {
            const x = getX(idx);
            // Show label every few points to prevent collision
            const step = Math.ceil(data.length / 8);
            const showLabel = idx % step === 0 || idx === data.length - 1;

            return (
              <g key={`col-${idx}`}>
                {/* Transparent hover hit area */}
                <rect
                  x={x - (chartWidth / data.length / 2)}
                  y={padding.top}
                  width={chartWidth / data.length}
                  height={chartHeight}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoverIndex(idx)}
                />

                {showLabel && (
                  <text
                    x={x}
                    y={height - 12}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="11"
                    fontFamily="var(--font-sans)"
                  >
                    {point.date}
                  </text>
                )}
              </g>
            );
          })}

          {/* Active Hover Crosshair and Markers */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={height - padding.bottom}
                stroke="var(--accent-navy)"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
              {/* APIx Dot */}
              <circle
                cx={getX(hoverIndex)}
                cy={getY(data[hoverIndex].apix)}
                r="5.5"
                fill="var(--accent-saffron)"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              {/* MoSPI CPI Dot */}
              <circle
                cx={getX(hoverIndex)}
                cy={getY(data[hoverIndex].cpiBaseline)}
                r="4.5"
                fill="var(--accent-navy)"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Chart Footer Notes */}
      <div style={{
        marginTop: '0.75rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <span>
          <strong>Data Source:</strong> Automated multi-source scraper (IndiGo, Air India, Akasa, SpiceJet, MakeMyTrip, EaseMyTrip)
        </span>
        <span>
          <strong>Index Formula:</strong> Modified Laspeyres Price Index weighted by DGCA passenger-km
        </span>
      </div>
    </div>
  );
};
