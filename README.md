# FAREPULSE

### Background

**Essence** : CPI still calculated manually(BY RBI so note our clients aren't regualar people they are Govt. People Working for india), but most booking is on online. so manual is no longer the dynamic, route-specific, time-sensitive that indian customers face. so the solution it requires "automated, scalable and high-frequency data-collection system that mirrors what a real Indian traveller pays."

> The Consumer Price Index (CPI) released by the National Statistical Office (NSO), Ministry of Statistics and Programme Implementation (MoSPI), is the primary measure of retail inflation in India and is used by the Reserve Bank of India (RBI) for setting monetary policy under the flexible inflation-targeting framework. The current CPI framework, however, collects 'Transport and Communication' sub-group prices, including air travel fares, primarily through manual price-collection from a limited set of outlets and ticketing offices. With over 90% of domestic air tickets in India now sold online through airline websites and Online Travel Aggregators (OTAs) such as MakeMyTrip, Yatra, EaseMyTrip, Cleartrip, Ixigo and Goibibo, manual collection no longer captures the highly dynamic, route-specific, and time-sensitive pricing that Indian consumers actually face. Airfares in India follow dynamic pricing where the same sector can vary by 200-400% within a single day depending on advance-booking window, day-of-week, demand surges, festival seasons and fuel-price-linked surcharges. There is therefore an urgent need for an automated, scalable and high-frequency data-collection system that mirrors what a real Indian traveller pays.


---
### Detailed Description
**Essence** : Create an end-end software platform, that automatically scrapes (IndiGo, Air India, Air India Express, Akasa Air, SpiceJet and leading OTAs) after processing compute a real-time airfare price index(APIx) at daily, weekly and monthly frequencies. make buckets of pairs example (DEL-BOM) selected on basis of DGCA passenger traffic data and
capture fares for multiple advanced-purchases windows (Such as T+1, T+7). Handle js Rendered pages, dynamic CAPTCHA's, Anti-bot measures, IP Rotation, session management while being compliant to robots.txt with 
appropriate rate-limiting and ethical-scrapping safe guards. also seperate base fare from taxes, user development fee and convenience charges. dashboard should contain price trends, sector-wise heatmaps, lead-time elasticity curves and provide
an API that the NSO and RBI can Consume.

> The problem statement envisages development of an end-to-end software platform that automatically web-scrapes airfare data from major Indian airline websites (IndiGo, Air India, Air India Express, Akasa Air, SpiceJet) and leading OTAs, cleans and normalises the collected price quotes, and computes a Real-time Airfare Price Index (APIx) at daily, weekly and monthly frequencies. The system shall maintain a basket of representative city-pairs (such as DEL-BOM, DEL-BLR, BOM-BLR, DEL-CCU, BLR-HYD, MAA-DEL, etc.) selected on the basis of DGCA passenger-traffic data, and shall capture fares for multiple advance-purchase windows (T+1, T+7, T+15, T+30, T+45 days). Scraping must handle JavaScript-rendered pages, dynamic CAPTCHAs, anti-bot measures, IP rotation, and session management while remaining compliant with the robots.txt and terms of service of source websites, with appropriate rate-limiting and ethical-scraping safeguards. The collected raw quotes shall be passed through a data-cleaning pipeline that removes outliers, handles missing values, accounts for cancellations/sold-out flights, and separates base fare from taxes, user-development fee and convenience charges. The dashboard must visualise price trends, sector-wise heatmaps, lead-time elasticity curves, and provide an API that the NSO and RBI can consume.


---
### Expected Solution
> A working software prototype consisting of (a) a robust, ethically-designed multi-source web-scraping engine using Python (Scrapy/Selenium/Playwright) capable of scheduled daily extraction from airline portals; (b) a cleaned and de-duplicated airfare database with metadata such as origin, destination, carrier, advance-purchase window, fare-class, base fare, taxes and total fare; (c) an index-construction module based on PSD given routes and weights; (d) a web-based interactive dashboard showing the daily Airfare Price Index. The solution must include documentation, automated testing, and demonstrate at least 30 days of back-tested results against publicly available DGCA monthly average-fare data.

---
### Details
**Organisation** : MoSPI

**Department** : Data Information and Innovation Division
---
### Core Idea
- Permitted sources → Automated Quotes → Clean + Normalize → Weighted Index → Dashboard API

### Technical approach
**Stack** : Python, Playwright/scrapy, FastAPI, PostgreSQL, Pandas, Plotly, Docker, pytest.

**Methodology** : Scheduled collection(Event driven / adaptive polling → if frequency Increases) → Source Adapters → validation → normalization → Storage.

**Index + output**: Route Basket → fare aggregation → prescribed weights. 
> daily/ weekly/ Monthly index + REST API

### Flows
> Schedular (Avoid braking system or block the ip of scrapper) → Airline OTA → Validation + Cleaning (dupes/incorrect/morphed should be pruned) → PostgreSQL(storage server) → Index engine (A engine that can make route-prices in transparent weighted index) → API + DASHBOARD


### The AUDIT
**This is how we can trust the process**
> Raw Quote → Cleaned Quote → Routed Price → Weighted Index

### Objectives
- [ ] Create the scrape src for differnt OTAs
- [ ] Design simple non modern and reliable frontend
- [ ] Write Architecture diagram
- [ ] look for vulnerabilites
