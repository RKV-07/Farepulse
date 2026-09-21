import React from 'react';
import { TrendingUp, Award, AlertCircle, Database } from 'lucide-react';
import { IndexDataPoint } from '../types';

interface KpiMetricsProps {
  latestPoint: IndexDataPoint;
}

export const KpiMetrics: React.FC<KpiMetricsProps> = ({ latestPoint }) => {
  return (
    <div className="kpi-grid">
      {/* KPI 1: Real-Time APIx Index */}
      <div className="kpi-card accent-saffron">
        <div className="kpi-top">
          <span className="kpi-label">Real-Time Airfare Index (APIx)</span>
          <TrendingUp size={16} color="var(--accent-saffron)" />
        </div>
        <div className="kpi-value-row">
          <span className="kpi-value">{latestPoint.apix.toFixed(2)}</span>
          <span className="kpi-badge up">▲ +2.4% DoD</span>
        </div>
        <div className="kpi-footer">
          Base Year: <strong>Jan 2024 = 100</strong> &bull; Weighted Laspeyres
        </div>
      </div>

      {/* KPI 2: MoSPI Official CPI Transport Sub-Index */}
      <div className="kpi-card">
        <div className="kpi-top">
          <span className="kpi-label">MoSPI CPI Transport Sub-Index</span>
          <Award size={16} color="var(--accent-navy)" />
        </div>
        <div className="kpi-value-row">
          <span className="kpi-value">{latestPoint.cpiBaseline.toFixed(2)}</span>
          <span className="kpi-badge neutral">+0.3% MoM</span>
        </div>
        <div className="kpi-footer">
          Manual Outlets Survey &bull; Monthly Offline Sample
        </div>
      </div>

      {/* KPI 3: Measurement Divergence Gap */}
      <div className="kpi-card accent-saffron">
        <div className="kpi-top">
          <span className="kpi-label">Measurement Divergence Gap</span>
          <AlertCircle size={16} color="var(--accent-saffron)" />
        </div>
        <div className="kpi-value-row">
          <span className="kpi-value">+{latestPoint.divergence.toFixed(2)}</span>
          <span className="kpi-badge up">Index Points</span>
        </div>
        <div className="kpi-footer">
          Online Dynamic Premium over Manual Outlets
        </div>
      </div>

      {/* KPI 4: Today's Daily Scraped Quotes */}
      <div className="kpi-card accent-green">
        <div className="kpi-top">
          <span className="kpi-label">Quotes Indexed Today</span>
          <Database size={16} color="var(--status-success)" />
        </div>
        <div className="kpi-value-row">
          <span className="kpi-value">{latestPoint.volume.toLocaleString('en-IN')}</span>
          <span className="kpi-badge down">100% Verified</span>
        </div>
        <div className="kpi-footer">
          6 Airlines &bull; 4 Leading OTAs &bull; T+1 to T+45
        </div>
      </div>
    </div>
  );
};
