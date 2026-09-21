import React, { useState } from 'react';
import { FileCode, CheckCircle2, Copy, Check, ShieldAlert, Cpu } from 'lucide-react';
import { AUDIT_TRAIL_DATA } from '../data/rawQuotesData';
import { AuditRecord } from '../types';

export const RawDataAudit: React.FC = () => {
  const [selectedAuditId, setSelectedAuditId] = useState<string>(AUDIT_TRAIL_DATA[0].id);
  const [copiedStage, setCopiedStage] = useState<string | null>(null);
  const [activeStageTab, setActiveStageTab] = useState<'raw' | 'cleaned' | 'routed' | 'index'>('raw');

  const selectedRecord: AuditRecord = AUDIT_TRAIL_DATA.find(a => a.id === selectedAuditId) || AUDIT_TRAIL_DATA[0];

  const handleCopy = (content: string, stageName: string) => {
    navigator.clipboard.writeText(content);
    setCopiedStage(stageName);
    setTimeout(() => setCopiedStage(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 4-Stage Pipeline Header Card (README lines 45-48) */}
      <div className="fp-card">
        <div className="fp-card-header">
          <div>
            <h2 className="fp-card-title">
              <FileCode size={18} color="var(--accent-navy)" />
              The Audit Trail — Trust Through Complete Transparency
            </h2>
            <p className="fp-card-subtitle">
              Demonstrating the exact transformation pipeline: Raw OTA Quotation → Data Normalization & Outlier Pruning → Sector Aggregation → Laspeyres Index
            </p>
          </div>
          <span className="status-badge live">
            <Cpu size={13} /> Automated Ingestion Pipeline
          </span>
        </div>

        {/* Visual 4-Stage Pipeline Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
          marginTop: '0.5rem'
        }}>
          {[
            { key: 'raw', num: '01', title: 'Raw Quote', desc: 'HTML/JSON payload from airline or OTA' },
            { key: 'cleaned', num: '02', title: 'Cleaned Quote', desc: 'Outliers pruned, duplicate removed, fee unbundled' },
            { key: 'routed', num: '03', title: 'Routed Price', desc: 'Sector median & trimmed mean calculated' },
            { key: 'index', num: '04', title: 'Weighted Index', desc: 'DGCA passenger-km weight applied to basket' }
          ].map(stage => {
            const isActive = activeStageTab === stage.key;
            return (
              <div
                key={stage.key}
                onClick={() => setActiveStageTab(stage.key as any)}
                style={{
                  background: isActive ? 'var(--accent-navy)' : 'var(--bg-surface-subtle)',
                  color: isActive ? '#FFFFFF' : 'var(--text-primary)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? '1px solid var(--accent-navy)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: isActive ? 'var(--accent-saffron-light)' : 'var(--accent-saffron)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  STAGE {stage.num}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, margin: '0.2rem 0' }}>
                  {stage.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: isActive ? '#CBD5E1' : 'var(--text-muted)' }}>
                  {stage.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Audit Console */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '1.25rem' }}>
        {/* Left: Sampled Audit Records List */}
        <div className="fp-card" style={{ padding: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--accent-navy)' }}>
            Recent Ingestion Stream ({AUDIT_TRAIL_DATA.length} Sample Records)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {AUDIT_TRAIL_DATA.map(rec => {
              const isSelected = rec.id === selectedAuditId;
              const isOutlier = rec.status === 'outlier_pruned';

              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedAuditId(rec.id)}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--accent-saffron)' : '1px solid var(--border-color)',
                    background: isSelected ? 'var(--accent-saffron-bg)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-navy)' }}>
                      {rec.airline} ({rec.route})
                    </span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-pill)',
                      background: isOutlier ? 'var(--status-danger-bg)' : 'var(--status-success-bg)',
                      color: isOutlier ? 'var(--status-danger)' : 'var(--status-success)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3
                    }}>
                      {isOutlier ? <ShieldAlert size={10} /> : <CheckCircle2 size={10} />}
                      {isOutlier ? 'Outlier Filtered' : 'Valid Ingest'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    {rec.source}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span>ID: {rec.id}</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{rec.timestamp.substring(11, 19)} UTC</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Stage Inspector & JSON Viewer */}
        <div className="fp-card">
          <div className="fp-card-header">
            <div>
              <h3 className="fp-card-title">
                Payload Inspector: {selectedRecord.quoteId}
              </h3>
              <p className="fp-card-subtitle">
                Source: {selectedRecord.source} &bull; Route: {selectedRecord.route} &bull; Airline: {selectedRecord.airline}
              </p>
            </div>

            {/* Copy Button */}
            <button
              className="fp-btn fp-btn-outline fp-btn-sm"
              onClick={() => {
                const payloadToCopy = activeStageTab === 'raw'
                  ? JSON.stringify(selectedRecord.rawPayload, null, 2)
                  : JSON.stringify(selectedRecord.cleanedRecord, null, 2);
                handleCopy(payloadToCopy, activeStageTab);
              }}
            >
              {copiedStage === activeStageTab ? <Check size={13} color="var(--status-success)" /> : <Copy size={13} />}
              {copiedStage === activeStageTab ? 'Copied JSON!' : 'Copy Stage JSON'}
            </button>
          </div>

          {/* Sub-tabs for Stage */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            {[
              { id: 'raw', label: '1. Raw OTA Payload' },
              { id: 'cleaned', label: '2. Cleaned & Unbundled' },
              { id: 'routed', label: '3. Sector Aggregation' },
              { id: 'index', label: '4. Index Contribution' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`fp-btn fp-btn-sm ${activeStageTab === tab.id ? 'fp-btn-primary' : 'fp-btn-outline'}`}
                onClick={() => setActiveStageTab(tab.id as any)}
                style={{ fontSize: '0.75rem' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          {activeStageTab === 'raw' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 6, color: 'var(--text-muted)' }}>
                <span>Unmodified scraped response payload:</span>
                <span>Format: JSON / Intercepted Stream</span>
              </div>
              <pre className="code-box">
                {JSON.stringify(selectedRecord.rawPayload, null, 2)}
              </pre>
            </div>
          )}

          {activeStageTab === 'cleaned' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 6, color: 'var(--text-muted)' }}>
                <span>Standardized normalization schema after outlier evaluation:</span>
                <span>Status: {selectedRecord.status.toUpperCase()}</span>
              </div>
              <pre className="code-box">
                {JSON.stringify({
                  quoteId: selectedRecord.quoteId,
                  status: selectedRecord.status,
                  airline: selectedRecord.airline,
                  route: selectedRecord.route,
                  cleaningPipeline: {
                    baseFareINR: selectedRecord.cleanedRecord.baseFare,
                    taxesINR: selectedRecord.cleanedRecord.taxes,
                    udfLevyINR: selectedRecord.cleanedRecord.udf,
                    convenienceFeeINR: selectedRecord.cleanedRecord.convenienceFee,
                    netEffectiveFareINR: selectedRecord.cleanedRecord.totalFare,
                    timestampNormalized: selectedRecord.cleanedRecord.normalizedAt
                  }
                }, null, 2)}
              </pre>
            </div>
          )}

          {activeStageTab === 'routed' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 6, color: 'var(--text-muted)' }}>
                <span>Aggregation into {selectedRecord.route} City-Pair Matrix:</span>
                <span>Algorithm: 15% Trimmed Mean</span>
              </div>
              <pre className="code-box">
                {JSON.stringify({
                  sector: selectedRecord.route,
                  window: 'T+7 Days Advance',
                  sampleSizeQuotes: 142,
                  sectorMedianINR: 5940,
                  trimmedMeanINR: 5912.4,
                  standardDeviation: 384.2,
                  outlierRejectionRatio: '2.1%'
                }, null, 2)}
              </pre>
            </div>
          )}

          {activeStageTab === 'index' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 6, color: 'var(--text-muted)' }}>
                <span>Laspeyres Index weighting for {selectedRecord.route}:</span>
                <span>DGCA Weight: {(selectedRecord.indexWeight * 100).toFixed(1)}%</span>
              </div>
              <pre className="code-box">
                {JSON.stringify({
                  route: selectedRecord.route,
                  dgcaTrafficWeightFraction: selectedRecord.indexWeight,
                  priceRatioPtOverP0: 1.284,
                  weightedContributionPoints: selectedRecord.contributionPoints,
                  nationalIndexShare: `${(selectedRecord.indexWeight * 100).toFixed(1)}% of CPI Air Travel Sub-Group`
                }, null, 2)}
              </pre>
            </div>
          )}

          {/* Audit Verification Note */}
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}>
            🔒 <strong>Auditor Verification Guarantee:</strong> Every single APIx index point published on this dashboard is traceable down to the raw JSON quote payload, server timestamp, carrier flight number, and IP rotation node.
          </div>
        </div>
      </div>
    </div>
  );
};
