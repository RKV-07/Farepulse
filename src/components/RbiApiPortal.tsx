import React, { useState } from 'react';
import { Terminal, Play, Key, Copy, Check, ShieldCheck } from 'lucide-react';
import { API_ENDPOINTS, executeMockApiCall } from '../services/mockApiService';
import { ApiEndpointDoc } from '../types';

export const RbiApiPortal: React.FC = () => {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>(API_ENDPOINTS[0].id);
  const [activeCodeTab, setActiveCodeTab] = useState<'python' | 'curl'>('python');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('rbi_depr_live_8f902ac7e12');

  const selectedEndpoint: ApiEndpointDoc = API_ENDPOINTS.find(e => e.id === selectedEndpointId) || API_ENDPOINTS[0];

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const res = executeMockApiCall(selectedEndpointId, { frequency: 'daily' });
      setApiResponse(res);
      setIsExecuting(false);
    }, 280);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Introduction Card */}
      <div className="fp-card">
        <div className="fp-card-header">
          <div>
            <h2 className="fp-card-title">
              <Terminal size={18} color="var(--accent-navy)" />
              Reserve Bank of India (RBI) & MoSPI API Consumption Portal
            </h2>
            <p className="fp-card-subtitle">
              High-frequency programmatic data ingestion gateway for RBI Department of Economic & Policy Research (DEPR) and MoSPI Data Information Division
            </p>
          </div>
          <span className="status-badge live">
            <ShieldCheck size={13} /> REST API Gateway v1.4
          </span>
        </div>

        {/* API Key & Authentication Ribbon */}
        <div style={{
          background: 'var(--bg-surface-subtle)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Key size={18} color="var(--accent-navy)" />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                ACTIVE RBI CLIENT TOKEN (BEARER)
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-navy)' }}>
                {apiKey}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="fp-btn fp-btn-outline fp-btn-sm"
              onClick={() => setApiKey('rbi_depr_live_' + Math.random().toString(36).substring(2, 11))}
            >
              Rotate Key
            </button>
            <button
              className="fp-btn fp-btn-outline fp-btn-sm"
              onClick={() => handleCopyCode(apiKey)}
            >
              Copy Token
            </button>
          </div>
        </div>
      </div>

      {/* Main Console: Endpoints List on Left, Interactive Runner on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '1.25rem' }}>
        {/* Endpoints Sidebar */}
        <div className="fp-card" style={{ padding: '1rem' }}>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--accent-navy)' }}>
            Available REST Endpoints
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {API_ENDPOINTS.map(ep => {
              const isSelected = ep.id === selectedEndpointId;
              return (
                <div
                  key={ep.id}
                  onClick={() => {
                    setSelectedEndpointId(ep.id);
                    setApiResponse(null);
                  }}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--accent-saffron)' : '1px solid var(--border-color)',
                    background: isSelected ? 'var(--accent-saffron-bg)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      background: 'var(--accent-navy)',
                      color: '#FFFFFF',
                      padding: '1px 5px',
                      borderRadius: 3,
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {ep.method}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-navy)' }}>
                      {ep.path}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {ep.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Endpoint Details & Interactive Try It Out Console */}
        <div className="fp-card">
          <div className="fp-card-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
                <span style={{
                  background: 'var(--accent-navy)',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: 3,
                  fontFamily: 'var(--font-mono)'
                }}>
                  {selectedEndpoint.method}
                </span>
                <h3 className="fp-card-title" style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem' }}>
                  {selectedEndpoint.path}
                </h3>
              </div>
              <p className="fp-card-subtitle">{selectedEndpoint.description}</p>
            </div>

            <button
              className="fp-btn fp-btn-saffron fp-btn-sm"
              onClick={handleExecute}
              disabled={isExecuting}
            >
              <Play size={12} />
              {isExecuting ? 'Sending Request...' : 'Send Live Request'}
            </button>
          </div>

          {/* Request Query Parameters */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-navy)' }}>
              Parameters
            </h4>
            <div className="fp-table-wrapper">
              <table className="fp-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEndpoint.params.map(p => (
                    <tr key={p.name}>
                      <td><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{p.name}</code></td>
                      <td><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.type}</span></td>
                      <td>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: p.required ? 'var(--status-danger)' : 'var(--text-muted)'
                        }}>
                          {p.required ? 'YES' : 'OPTIONAL'}
                        </span>
                      </td>
                      <td>{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Code Snippets (Python / cURL) */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  className={`fp-btn fp-btn-sm ${activeCodeTab === 'python' ? 'fp-btn-primary' : 'fp-btn-outline'}`}
                  onClick={() => setActiveCodeTab('python')}
                >
                  Python (Pandas / Requests)
                </button>
                <button
                  className={`fp-btn fp-btn-sm ${activeCodeTab === 'curl' ? 'fp-btn-primary' : 'fp-btn-outline'}`}
                  onClick={() => setActiveCodeTab('curl')}
                >
                  cURL
                </button>
              </div>

              <button
                className="fp-btn fp-btn-outline fp-btn-sm"
                onClick={() => handleCopyCode(activeCodeTab === 'python' ? selectedEndpoint.pythonCode : selectedEndpoint.curlCode)}
              >
                {copiedCode ? <Check size={12} color="var(--status-success)" /> : <Copy size={12} />}
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <pre className="code-box">
              {activeCodeTab === 'python' ? selectedEndpoint.pythonCode : selectedEndpoint.curlCode}
            </pre>
          </div>

          {/* Response Box */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-navy)' }}>
                Response Preview {apiResponse ? '(HTTP 200 OK - 14ms)' : '(Sample Response)'}
              </h4>
              {apiResponse && (
                <span className="status-badge live" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                  ● 200 OK &bull; JSON
                </span>
              )}
            </div>

            <pre className="code-box" style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {JSON.stringify(apiResponse ? apiResponse.data : selectedEndpoint.responseExample, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
