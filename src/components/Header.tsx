import React from 'react';
import { Plane, Eye, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface HeaderProps {
  highContrast: boolean;
  onToggleContrast: () => void;
  fontScale: number;
  onScaleFont: (delta: number) => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  highContrast,
  onToggleContrast,
  fontScale,
  onScaleFont,
  onRefreshData,
  isRefreshing
}) => {
  return (
    <header>
      {/* UX4G GIGW Compliance Top Ribbon */}
      <div className="gov-ribbon">
        <div className="gov-ribbon-left">
          <div className="tiranga-strip" title="National Flag of India">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>भारत सरकार | Government of India</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)</span>
        </div>

        <div className="gov-ribbon-right">
          <button
            className="gov-btn-text"
            onClick={() => onScaleFont(-0.1)}
            title="Decrease font size"
            disabled={fontScale <= 0.85}
          >
            <ZoomOut size={12} style={{ display: 'inline', marginRight: 2 }} /> A-
          </button>
          <button
            className="gov-btn-text"
            onClick={() => onScaleFont(0)}
            title="Reset font size"
          >
            A
          </button>
          <button
            className="gov-btn-text"
            onClick={() => onScaleFont(0.1)}
            title="Increase font size"
            disabled={fontScale >= 1.25}
          >
            <ZoomIn size={12} style={{ display: 'inline', marginRight: 2 }} /> A+
          </button>
          <span style={{ opacity: 0.4 }}>|</span>
          <button
            className="gov-btn-text"
            onClick={onToggleContrast}
            title="Toggle high-contrast accessible mode"
          >
            <Eye size={12} style={{ display: 'inline', marginRight: 3 }} />
            {highContrast ? 'Standard Contrast' : 'High Contrast'}
          </button>
          <span style={{ opacity: 0.4 }}>|</span>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>NSO / RBI Terminal v1.4.2</span>
        </div>
      </div>

      {/* Main Gov Application Header */}
      <div className="main-header">
        <div className="brand-wrapper">
          <div className="emblem-icon" title="National Statistical Office">
            <Plane size={24} strokeWidth={2.2} />
          </div>
          <div className="brand-info">
            <h1>
              FAREPULSE
              <span className="brand-badge">APIx Engine</span>
            </h1>
            <div className="subline">
              National Real-Time Airfare Price Index System &bull; National Statistical Office (NSO) &bull; Reserve Bank of India
            </div>
          </div>
        </div>

        <div className="header-status-group">
          <div className="status-badge live" title="Scraper nodes actively polling Indigo, Air India, Akasa, SpiceJet and OTAs">
            <span className="dot"></span>
            <span>Live Quote Stream: 42,850 Indexed Today</span>
          </div>

          {onRefreshData && (
            <button
              className="fp-btn fp-btn-outline fp-btn-sm"
              onClick={onRefreshData}
              disabled={isRefreshing}
              title="Trigger simulated high-frequency scrape poll"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Polling Scraper...' : 'Simulate Scrape Poll'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
