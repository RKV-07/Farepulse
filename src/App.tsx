import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation, TabKey } from './components/Navigation';
import { KpiMetrics } from './components/KpiMetrics';
import { IndexChart } from './components/IndexChart';
import { RouteBuckets } from './components/RouteBuckets';
import { LeadTimeElasticity } from './components/LeadTimeElasticity';
import { SkyscannerExplorer } from './components/SkyscannerExplorer';
import { RawDataAudit } from './components/RawDataAudit';
import { CpiCalculation } from './components/CpiCalculation';
import { RbiApiPortal } from './components/RbiApiPortal';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Frequency, IndexDataPoint } from './types';
import { DAILY_INDEX_DATA, WEEKLY_INDEX_DATA, MONTHLY_INDEX_DATA } from './data/indexData';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [fontScale, setFontScale] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Latest point based on frequency
  let activeSeries: IndexDataPoint[] = DAILY_INDEX_DATA;
  if (frequency === 'weekly') activeSeries = WEEKLY_INDEX_DATA;
  if (frequency === 'monthly') activeSeries = MONTHLY_INDEX_DATA;
  const latestPoint = activeSeries[activeSeries.length - 1];

  // Font scale handler
  const handleScaleFont = (delta: number) => {
    if (delta === 0) {
      setFontScale(1);
      document.documentElement.style.setProperty('--font-scale', '1');
    } else {
      const nextScale = Math.min(1.25, Math.max(0.85, Number((fontScale + delta).toFixed(2))));
      setFontScale(nextScale);
      document.documentElement.style.setProperty('--font-scale', String(nextScale));
    }
  };

  // High contrast toggle
  const handleToggleContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    if (next) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  // Simulate scrape poll
  const handleRefreshData = () => {
    setIsRefreshing(true);
    setNotification('Initiating adaptive rate-limited scraper poll across 6 airlines & 4 OTAs...');

    setTimeout(() => {
      setIsRefreshing(false);
      setNotification('✓ Scrape cycle complete: 1,420 new quotes cleaned and ingested into APIx.');
      setTimeout(() => setNotification(null), 4000);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Gov of India & UX4G Header */}
      <Header
        highContrast={highContrast}
        onToggleContrast={handleToggleContrast}
        fontScale={fontScale}
        onScaleFont={handleScaleFont}
        onRefreshData={handleRefreshData}
        isRefreshing={isRefreshing}
      />

      {/* Global Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* Live Notification Banner */}
      {notification && (
        <div style={{
          background: 'var(--accent-saffron-bg)',
          borderBottom: '1px solid var(--accent-saffron-border)',
          color: 'var(--accent-saffron-hover)',
          padding: '0.6rem 1.75rem',
          fontSize: '0.8rem',
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800, color: 'inherit' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="page-container">
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top KPI Metric Cards */}
            <KpiMetrics latestPoint={latestPoint} />

            {/* Primary Time-Series Interactive Chart */}
            <IndexChart
              frequency={frequency}
              onFrequencyChange={(f) => setFrequency(f)}
            />

            {/* DGCA 3 Route Buckets Section */}
            <RouteBuckets
              onSelectRoute={() => {
                // Route selection can navigate or open drawer
              }}
            />

            {/* Lead Time Elasticity Section */}
            <LeadTimeElasticity />

            {/* Small FAQ at the bottom as specified in design.md line 17 */}
            <FaqSection />
          </div>
        )}

        {activeTab === 'buckets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <RouteBuckets />
            <FaqSection />
          </div>
        )}

        {activeTab === 'elasticity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <LeadTimeElasticity />
            <FaqSection />
          </div>
        )}

        {activeTab === 'explorer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SkyscannerExplorer />
            <FaqSection />
          </div>
        )}

        {activeTab === 'audit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <RawDataAudit />
            <FaqSection />
          </div>
        )}

        {activeTab === 'cpi' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <CpiCalculation />
            <FaqSection />
          </div>
        )}

        {activeTab === 'api' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <RbiApiPortal />
            <FaqSection />
          </div>
        )}

        {activeTab === 'faq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <FaqSection />
          </div>
        )}
      </main>

      {/* Official MoSPI / DGCA Footer */}
      <Footer />
    </div>
  );
};
export default App;
