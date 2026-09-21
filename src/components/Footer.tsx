import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      background: '#0B1926',
      color: '#CBD5E1',
      borderTop: '3px solid var(--accent-saffron)',
      padding: '2.5rem 1.75rem 1.5rem',
      marginTop: 'auto',
      fontSize: '0.8rem'
    }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Ministry Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{
              background: 'var(--accent-saffron)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.75rem',
              padding: '2px 6px',
              borderRadius: 3
            }}>
              FAREPULSE
            </span>
            <span style={{ fontWeight: 700, color: '#FFFFFF' }}>MoSPI &bull; NSO &bull; RBI</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.6 }}>
            National Airfare Real-Time Price Index System. Developed under the Data Information and Innovation Division (DIID), Ministry of Statistics and Programme Implementation, Government of India.
          </p>
        </div>

        {/* Official Stakeholders */}
        <div>
          <h4 style={{ color: '#FFFFFF', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            Participating Stakeholders
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem', color: '#94A3B8' }}>
            <li>&bull; National Statistical Office (NSO) - Retail Inflation Division</li>
            <li>&bull; Reserve Bank of India (RBI) - Monetary Policy Committee</li>
            <li>&bull; Directorate General of Civil Aviation (DGCA) - Traffic Statistics</li>
            <li>&bull; Ministry of Civil Aviation (MoCA)</li>
          </ul>
        </div>

        {/* Standards & Guidelines */}
        <div>
          <h4 style={{ color: '#FFFFFF', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            Design & Compliance Framework
          </h4>
          <p style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '0.5rem' }}>
            Built strictly in accordance with Govt. of India <strong>UX4G 3.0</strong> guidelines, <strong>GIGW 3.0</strong> accessibility standards, and ethical automated web collection safeguards.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#38BDF8' }}>
              <ShieldCheck size={12} /> GIGW 3.0 Compliant
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: 'var(--accent-saffron-light)' }}>
              <ShieldCheck size={12} /> UX4G Design System
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Disclaimer Strip */}
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.72rem',
        color: '#64748B'
      }}>
        <div>
          &copy; 2026 Farepulse &bull; Ministry of Statistics and Programme Implementation, Government of India.
        </div>
        <div>
          Demo prototype for MoSPI DIID / RBI MPC Airfare CPI modernization.
        </div>
      </div>
    </footer>
  );
};
