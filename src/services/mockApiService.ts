import { ApiEndpointDoc } from '../types';
import { DAILY_INDEX_DATA, WEEKLY_INDEX_DATA, MONTHLY_INDEX_DATA } from '../data/indexData';
import { DGCA_ROUTE_BUCKETS, ROUTES_DATA } from '../data/routesData';
import { LEAD_TIME_ELASTICITY } from '../data/elasticityData';
import { AUDIT_TRAIL_DATA } from '../data/rawQuotesData';

export const API_ENDPOINTS: ApiEndpointDoc[] = [
  {
    id: 'ep-apix-index',
    method: 'GET',
    path: '/api/v1/index/apix',
    title: 'Real-time Airfare Price Index Feed',
    description: 'Returns the high-frequency Laspeyres Airfare Price Index (APIx) at daily, weekly, or monthly frequency with base year 2024 = 100.',
    params: [
      { name: 'frequency', type: 'string', required: false, description: 'Aggregation frequency: daily, weekly, monthly (default: daily)' },
      { name: 'from', type: 'string', required: false, description: 'Start date in YYYY-MM-DD format' },
      { name: 'to', type: 'string', required: false, description: 'End date in YYYY-MM-DD format' },
      { name: 'format', type: 'string', required: false, description: 'Output format: json (default) or csv' }
    ],
    responseExample: {
      status: 'success',
      timestamp: '2026-09-21T05:30:00Z',
      baseYear: '2024=100',
      frequency: 'daily',
      count: 35,
      latestIndex: {
        date: '2026-09-21',
        apix: 128.45,
        dodChangePct: '+2.4%',
        cpiBaseline: 114.20,
        divergencePoints: 14.25,
        dailyQuotesSampled: 42850
      },
      series: DAILY_INDEX_DATA.slice(-5)
    },
    pythonCode: `import requests
import pandas as pd

# MoSPI / RBI Authenticated API Ingestion
url = "https://farepulse.mospi.gov.in/api/v1/index/apix"
headers = {
    "Authorization": "Bearer rbi_depr_live_8f902ac7e12",
    "Accept": "application/json"
}
params = {
    "frequency": "daily",
    "from": "2026-08-01",
    "to": "2026-09-21"
}

response = requests.get(url, headers=headers, params=params)
data = response.json()

# Convert to Pandas DataFrame for RBI Inflation Modeling
df = pd.DataFrame(data['series'])
df['date'] = pd.to_datetime(df['date'])
df.set_index('date', inplace=True)
print(df[['apix', 'cpiBaseline', 'divergence']].tail())`,
    curlCode: `curl -X GET "https://farepulse.mospi.gov.in/api/v1/index/apix?frequency=daily&from=2026-08-01" \\
  -H "Authorization: Bearer rbi_depr_live_8f902ac7e12" \\
  -H "Accept: application/json"`
  },
  {
    id: 'ep-route-buckets',
    method: 'GET',
    path: '/api/v1/routes/buckets',
    title: 'DGCA Route Basket & Sector Weights',
    description: 'Retrieves the current domestic representative basket of city-pairs, assigned DGCA passenger traffic weights, and median sector fares.',
    params: [
      { name: 'bucket', type: 'string', required: false, description: 'Filter by bucket: metro, tier2, regional, or all' }
    ],
    responseExample: {
      status: 'success',
      dgcaWeightYear: 2025,
      totalSectorsTracked: 13,
      buckets: DGCA_ROUTE_BUCKETS,
      sectors: ROUTES_DATA.slice(0, 4)
    },
    pythonCode: `import requests

url = "https://farepulse.mospi.gov.in/api/v1/routes/buckets?bucket=metro"
headers = {"Authorization": "Bearer rbi_depr_live_8f902ac7e12"}
res = requests.get(url, headers=headers).json()
print(f"Total Metro Traffic Weight: {sum(s['dgcaTrafficWeight'] for s in res['sectors'])}%")`,
    curlCode: `curl -X GET "https://farepulse.mospi.gov.in/api/v1/routes/buckets?bucket=metro" \\
  -H "Authorization: Bearer rbi_depr_live_8f902ac7e12"`
  },
  {
    id: 'ep-lead-time',
    method: 'GET',
    path: '/api/v1/elasticity/advance-purchase',
    title: 'Advance-Purchase Lead-Time Elasticity Curve',
    description: 'Provides pricing matrix across advance purchase windows (T+1, T+7, T+15, T+30, T+45) with carrier dispersion breakdowns.',
    params: [
      { name: 'sector', type: 'string', required: false, description: 'City-pair code (e.g. DEL-BOM, BLR-HYD)' }
    ],
    responseExample: {
      status: 'success',
      sector: 'DEL-BOM',
      windows: LEAD_TIME_ELASTICITY
    },
    pythonCode: `import requests

url = "https://farepulse.mospi.gov.in/api/v1/elasticity/advance-purchase?sector=DEL-BOM"
headers = {"Authorization": "Bearer rbi_depr_live_8f902ac7e12"}
res = requests.get(url, headers=headers).json()
for w in res['windows']:
    print(f"Window {w['window']}: Avg Fare ₹{w['avgFare']} (Surge: {w['surgeMultiplier']}x)")`,
    curlCode: `curl -X GET "https://farepulse.mospi.gov.in/api/v1/elasticity/advance-purchase?sector=DEL-BOM" \\
  -H "Authorization: Bearer rbi_depr_live_8f902ac7e12"`
  },
  {
    id: 'ep-audit-quotes',
    method: 'GET',
    path: '/api/v1/audit/raw-quotes',
    title: 'Scraped Quotes Stream & Audit Trail',
    description: 'MoSPI Auditor endpoint returning raw quote JSON payloads, cleaning normalizations, and Z-score outlier filtering records.',
    params: [
      { name: 'limit', type: 'number', required: false, description: 'Records to return (max: 200, default: 50)' },
      { name: 'status', type: 'string', required: false, description: 'valid, outlier_pruned, sold_out_filtered' }
    ],
    responseExample: {
      status: 'success',
      totalRecords: 4,
      records: AUDIT_TRAIL_DATA
    },
    pythonCode: `import requests

url = "https://farepulse.mospi.gov.in/api/v1/audit/raw-quotes?limit=10"
headers = {"Authorization": "Bearer mospi_audit_key_33b82"}
audit_data = requests.get(url, headers=headers).json()
print("Audited items:", len(audit_data['records']))`,
    curlCode: `curl -X GET "https://farepulse.mospi.gov.in/api/v1/audit/raw-quotes?limit=10" \\
  -H "Authorization: Bearer mospi_audit_key_33b82"`
  }
];

export function executeMockApiCall(endpointId: string, queryParams: Record<string, string>) {
  const endpoint = API_ENDPOINTS.find(e => e.id === endpointId);
  if (!endpoint) {
    return { status: 404, message: 'Endpoint not found' };
  }

  if (endpointId === 'ep-apix-index') {
    const freq = queryParams.frequency || 'daily';
    let series = DAILY_INDEX_DATA;
    if (freq === 'weekly') series = WEEKLY_INDEX_DATA;
    if (freq === 'monthly') series = MONTHLY_INDEX_DATA;

    return {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'x-ratelimit-remaining': '4982',
        'x-api-version': 'v1.4.2',
        'x-source': 'MoSPI-NSO-Data-Pipeline'
      },
      latencyMs: 14,
      data: {
        status: 'success',
        frequency: freq,
        baseYear: '2024=100',
        count: series.length,
        latest: series[series.length - 1],
        series
      }
    };
  }

  if (endpointId === 'ep-route-buckets') {
    const bucketFilter = queryParams.bucket;
    const sectors = bucketFilter && bucketFilter !== 'all'
      ? ROUTES_DATA.filter(r => r.bucket === bucketFilter)
      : ROUTES_DATA;

    return {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'x-api-version': 'v1.4.2'
      },
      latencyMs: 12,
      data: {
        status: 'success',
        count: sectors.length,
        buckets: DGCA_ROUTE_BUCKETS,
        sectors
      }
    };
  }

  return {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
    latencyMs: 16,
    data: endpoint.responseExample
  };
}
