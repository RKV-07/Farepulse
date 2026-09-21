import React from 'react';
import {
  TrendingUp,
  Boxes,
  Activity,
  Compass,
  FileCode,
  Calculator,
  Terminal,
  HelpCircle
} from 'lucide-react';

export type TabKey =
  | 'overview'
  | 'buckets'
  | 'elasticity'
  | 'explorer'
  | 'audit'
  | 'cpi'
  | 'api'
  | 'faq';

interface NavigationProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const tabs: { key: TabKey; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      key: 'overview',
      label: 'APIx Index Dashboard',
      icon: <TrendingUp size={15} />
    },
    {
      key: 'buckets',
      label: 'DGCA Route Buckets',
      icon: <Boxes size={15} />,
      badge: '3 Buckets'
    },
    {
      key: 'elasticity',
      label: 'Lead-Time Elasticity',
      icon: <Activity size={15} />,
      badge: 'T+1 to T+45'
    },
    {
      key: 'explorer',
      label: 'Route & Fare Explorer',
      icon: <Compass size={15} />,
      badge: 'Skyscanner UI'
    },
    {
      key: 'audit',
      label: 'The Audit Trail & Raw Data',
      icon: <FileCode size={15} />,
      badge: 'Raw JSON'
    },
    {
      key: 'cpi',
      label: 'CPI Engine & Laspeyres',
      icon: <Calculator size={15} />
    },
    {
      key: 'api',
      label: 'RBI & MoSPI API Portal',
      icon: <Terminal size={15} />,
      badge: 'REST Console'
    },
    {
      key: 'faq',
      label: 'Methodology FAQ',
      icon: <HelpCircle size={15} />
    }
  ];

  return (
    <nav className="nav-tabs-wrapper" aria-label="Main Navigation Tabs">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`nav-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => onSelectTab(tab.key)}
          aria-selected={activeTab === tab.key}
          role="tab"
        >
          {tab.icon}
          <span>{tab.label}</span>
          {tab.badge && <span className="tab-badge">{tab.badge}</span>}
        </button>
      ))}
    </nav>
  );
};
