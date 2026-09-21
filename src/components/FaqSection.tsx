import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ_DATA } from '../data/faqData';

export const FaqSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': true
  });

  const toggleFaq = (id: string) => {
    setOpenIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="fp-card" style={{ marginTop: '1rem' }}>
      <div className="fp-card-header">
        <div>
          <h2 className="fp-card-title">
            <HelpCircle size={18} color="var(--accent-navy)" />
            Frequently Asked Questions & Policy Documentation
          </h2>
          <p className="fp-card-subtitle">
            Essential guidance for Ministry of Statistics (MoSPI), NSO analysts, and RBI economic researchers
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {FAQ_DATA.map(item => {
          const isOpen = !!openIds[item.id];
          return (
            <div
              key={item.id}
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: isOpen ? 'var(--bg-surface)' : 'var(--bg-surface-subtle)',
                transition: 'background 0.15s ease'
              }}
            >
              <button
                onClick={() => toggleFaq(item.id)}
                style={{
                  width: '100%',
                  padding: '0.9rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--accent-navy)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    borderRadius: 3,
                    background: 'var(--accent-navy-muted)',
                    color: 'var(--accent-navy)'
                  }}>
                    {item.category}
                  </span>
                  <span>{item.question}</span>
                </div>
                {isOpen ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
              </button>

              {isOpen && (
                <div style={{
                  padding: '0 1.25rem 1rem',
                  fontSize: '0.82rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  borderTop: '1px solid var(--border-color-subtle)'
                }}>
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
