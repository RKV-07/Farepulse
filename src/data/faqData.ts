import { FaqItem } from '../types';

export const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Methodology',
    question: 'How is the Airfare Price Index (APIx) computed?',
    answer: 'APIx is computed using a Laspeyres-type weighted aggregation across representative DGCA passenger city-pairs. Fares are collected daily across multiple advance-purchase windows (T+1, T+7, T+15, T+30, T+45). The base year is standardized to Jan 2024 = 100, where route weights Wi are derived from DGCA annual passenger-kilometer statistics.'
  },
  {
    id: 'faq-2',
    category: 'Methodology',
    question: 'Why does APIx diverge from the official MoSPI CPI Transport Sub-Index?',
    answer: 'The current CPI framework collects air travel prices primarily through manual, physical price collection from limited ticketing outlets and offline counters on a quarterly/monthly schedule. However, over 90% of tickets in India are sold online with dynamic pricing algorithm surges (200-400% intra-day variance). APIx captures high-frequency online transaction reality, revealing the dynamic inflation premium that travellers actually incur.'
  },
  {
    id: 'faq-3',
    category: 'Data & Scraping',
    question: 'How does Farepulse handle ethical scraping and robots.txt compliance?',
    answer: 'Farepulse uses an adaptive rate-limiting engine with session pooling and randomized back-off delays (3-5s per request) strictly honoring robots.txt crawl-delay directives. Scraping requests are distributed across geo-distributed nodes with polite headers, preventing load spikes on airline servers while extracting public fare matrices.'
  },
  {
    id: 'faq-4',
    category: 'Methodology',
    question: 'How are Base Fares separated from Taxes, UDF, and Convenience Fees?',
    answer: 'The raw quotation ingestion parser breaks down every airline and OTA payload into distinct cost components: Base Fare (BF), User Development Fee (UDF), Passenger Service Fee (PSF), Goods and Services Tax (GST K3), and Convenience Fees. This ensures the index measures true carrier pricing power separate from statutory airport infrastructure levies.'
  },
  {
    id: 'faq-5',
    category: 'RBI Policy',
    question: 'How can the Reserve Bank of India (RBI) utilize the Farepulse API?',
    answer: 'The RBI Monetary Policy Committee (MPC) and Department of Economic and Policy Research (DEPR) can consume the daily high-frequency APIx REST endpoints. This enables nowcasting of transport inflation weeks before MoSPI releases official headline CPI, allowing proactive monetary policy tuning and liquidity management.'
  },
  {
    id: 'faq-6',
    category: 'Compliance',
    question: 'What are the three DGCA route buckets and how are weights assigned?',
    answer: 'Routes are partitioned into: (1) High-Volume Metro Corridors (42.6% weight), (2) Tier-2 Growth & Tech Sectors (34.8% weight), and (3) Regional & UDAN Connectivity (22.6% weight). Weights are refreshed annually based on DGCA scheduled domestic passenger carriage data.'
  }
];
