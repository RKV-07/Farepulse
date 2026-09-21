import React, { useState } from 'react';
import { RouteBucketType, RouteItem } from '../types';
import { DGCA_ROUTE_BUCKETS, ROUTES_DATA } from '../data/routesData';
import { Boxes, ArrowRight, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react';

interface RouteBucketsProps {
  onSelectRoute?: (route: RouteItem) => void;
}

export const RouteBuckets: React.FC<RouteBucketsProps> = ({ onSelectRoute }) => {
  const [selectedBucket, setSelectedBucket] = useState<RouteBucketType | 'all'>('all');
  const [activeRouteDetail, setActiveRouteDetail] = useState<RouteItem | null>(null);

  const filteredRoutes = selectedBucket === 'all'
    ? ROUTES_DATA
    : ROUTES_DATA.filter(r => r.bucket === selectedBucket);

  const bucketKeys: RouteBucketType[] = ['metro', 'tier2', 'regional'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Introduction Card */}
      <div className="fp-card">
        <div className="fp-card-header">
          <div>
            <h2 className="fp-card-title">
              <Boxes size={18} color="var(--accent-navy)" />
              DGCA Passenger Traffic Baskets (Three Route Buckets)
            </h2>
            <p className="fp-card-subtitle">
              Representative city-pairs categorized based on Directorate General of Civil Aviation (DGCA) domestic passenger volume statistics
            </p>
          </div>
          <span className="status-badge live" style={{ background: 'var(--accent-navy-muted)', color: 'var(--accent-navy)', border: 'none' }}>
            <ShieldCheck size={13} /> 100% DGCA Prescribed Weights
          </span>
        </div>

        {/* 3 Bucket Selector Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
          {bucketKeys.map(bKey => {
            const bucketInfo = DGCA_ROUTE_BUCKETS[bKey];
            const routesInBucket = ROUTES_DATA.filter(r => r.bucket === bKey);
            const totalWeight = routesInBucket.reduce((sum, r) => sum + r.dgcaTrafficWeight, 0).toFixed(1);
            const isSelected = selectedBucket === bKey;

            return (
              <div
                key={bKey}
                onClick={() => setSelectedBucket(isSelected ? 'all' : bKey)}
                style={{
                  border: isSelected ? '2px solid var(--accent-saffron)' : '1px solid var(--border-color)',
                  background: isSelected ? 'var(--accent-saffron-bg)' : 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.1rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: isSelected ? 'var(--accent-saffron)' : 'var(--accent-navy)',
                    background: isSelected ? '#FFFFFF' : 'var(--bg-surface-subtle)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border-color)'
                  }}>
                    {bucketInfo.badge}
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-navy)' }}>
                    {totalWeight}% Weight
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', margin: '0.4rem 0 0.3rem', color: 'var(--accent-navy)' }}>
                  {bucketInfo.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  {bucketInfo.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>{routesInBucket.length} Representative Sectors</span>
                  <span style={{ fontWeight: 600, color: isSelected ? 'var(--accent-saffron)' : 'var(--accent-navy)' }}>
                    {isSelected ? '✓ Filter Applied' : 'Click to Filter'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {selectedBucket !== 'all' && (
          <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
            <button
              className="fp-btn fp-btn-outline fp-btn-sm"
              onClick={() => setSelectedBucket('all')}
            >
              Reset Filter & Show All Sectors (13)
            </button>
          </div>
        )}
      </div>

      {/* Route Table */}
      <div className="fp-card">
        <div className="fp-card-header">
          <h3 className="fp-card-title">
            Sector Airfare Matrix & DGCA Traffic Weights ({filteredRoutes.length} Sectors)
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Click any sector for detailed fee disaggregation
          </span>
        </div>

        <div className="fp-table-wrapper">
          <table className="fp-table">
            <thead>
              <tr>
                <th>Sector</th>
                <th>Route Name</th>
                <th>Bucket</th>
                <th>DGCA Weight</th>
                <th>Annual Pax</th>
                <th>Average Fare</th>
                <th>DoD Shift</th>
                <th>Volatility Index</th>
                <th>Top Carriers</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map(route => (
                <tr
                  key={route.id}
                  style={{ cursor: 'pointer', background: activeRouteDetail?.id === route.id ? 'var(--accent-saffron-bg)' : undefined }}
                  onClick={() => {
                    setActiveRouteDetail(route);
                    if (onSelectRoute) onSelectRoute(route);
                  }}
                >
                  <td>
                    <strong style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 6px',
                      background: 'var(--accent-navy-muted)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--accent-navy)',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {route.sector}
                    </strong>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {route.originCity} <ArrowRight size={11} style={{ display: 'inline' }} /> {route.destCity}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-pill)',
                      background: route.bucket === 'metro' ? '#EFF6FF' : route.bucket === 'tier2' ? '#FFFBEB' : '#ECFDF5',
                      color: route.bucket === 'metro' ? '#1D4ED8' : route.bucket === 'tier2' ? '#B45309' : '#047857'
                    }}>
                      {route.bucket.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {route.dgcaTrafficWeight}%
                    </span>
                  </td>
                  <td>{route.annualPassengers}</td>
                  <td>
                    <strong style={{ color: 'var(--accent-navy)' }}>
                      ₹{route.avgFare.toLocaleString('en-IN')}
                    </strong>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 2,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: route.dodChange >= 0 ? 'var(--status-danger)' : 'var(--status-success)'
                    }}>
                      {route.dodChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {route.dodChange >= 0 ? `+${route.dodChange}%` : `${route.dodChange}%`}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 40,
                        height: 6,
                        background: '#E2E8F0',
                        borderRadius: 3,
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${route.volatilityIndex * 10}%`,
                          height: '100%',
                          background: route.volatilityIndex > 7 ? 'var(--accent-saffron)' : 'var(--accent-navy)'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                        {route.volatilityIndex}/10
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {route.topCarriers.join(', ')}
                    </span>
                  </td>
                  <td>
                    <button
                      className="fp-btn fp-btn-outline fp-btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveRouteDetail(route);
                        if (onSelectRoute) onSelectRoute(route);
                      }}
                    >
                      View Breakdown
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Route Detailed Breakdown Drawer/Modal */}
      {activeRouteDetail && (
        <div className="modal-backdrop" onClick={() => setActiveRouteDetail(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0, color: 'var(--accent-navy)' }}>
                  Sector Analysis: {activeRouteDetail.sector} ({activeRouteDetail.originCity} → {activeRouteDetail.destCity})
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  DGCA Bucket: {activeRouteDetail.bucket.toUpperCase()} &bull; Assigned Weight: {activeRouteDetail.dgcaTrafficWeight}%
                </span>
              </div>
              <button
                className="fp-btn fp-btn-outline fp-btn-sm"
                onClick={() => setActiveRouteDetail(null)}
              >
                ✕ Close
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                background: 'var(--bg-surface-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Annual Traffic</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-navy)' }}>
                    {activeRouteDetail.annualPassengers}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Current 30D Average</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-navy)' }}>
                    ₹{activeRouteDetail.avgFare.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>DoD Price Movement</span>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: activeRouteDetail.dodChange >= 0 ? 'var(--status-danger)' : 'var(--status-success)'
                  }}>
                    {activeRouteDetail.dodChange >= 0 ? `+${activeRouteDetail.dodChange}%` : `${activeRouteDetail.dodChange}%`}
                  </div>
                </div>
              </div>

              {/* Fare Component Breakdown (README line 14: separate base fare from taxes, UDF and convenience fees) */}
              <div>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--accent-navy)' }}>
                  Regulatory Fare Disaggregation (Statutory vs Base Fare)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span>Air Carrier Base Fare ({activeRouteDetail.baseFarePct}%)</span>
                    <strong>₹{Math.round(activeRouteDetail.avgFare * (activeRouteDetail.baseFarePct / 100)).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span>User Development Fee (UDF - Airport Infrastructure)</span>
                    <strong>₹{activeRouteDetail.udfFee.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span>Passenger Service Fee & Statutory GST ({activeRouteDetail.taxPct}%)</span>
                    <strong>₹{Math.round(activeRouteDetail.avgFare * 0.08).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span>Average Platform Convenience Fee</span>
                    <strong>₹350</strong>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    borderTop: '2px solid var(--border-color)',
                    paddingTop: '0.5rem',
                    color: 'var(--accent-navy)'
                  }}>
                    <span>Total Effective Fare</span>
                    <span style={{ color: 'var(--accent-saffron)' }}>₹{activeRouteDetail.avgFare.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: '#FFFBEB', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A' }}>
                💡 <strong>NSO / MoSPI Methodology Note:</strong> Farepulse dynamically isolates statutory levies (UDF + GST) from the base carrier yield to ensure CPI airfare sub-index calculations only reflect market-driven carrier pricing fluctuations.
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="fp-btn fp-btn-primary"
                onClick={() => setActiveRouteDetail(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
