# Atlanta.Civics.City

## /site

This site is built on [SvelteKit](https://kit.svelte.dev/), and uses [Leaflet](https://leafletjs.com/) for maps, and [Chart.js](https://www.chartjs.org/) for charts, and [Turf.js](https://turfjs.org/) for processing locations when needed.

## /serverless/archive911

This function captures and archives 911 incidents in S3

## /serverless/archiveGDOT

This function captures and archives GDOT crash incidents

## /serverless/cityProxy

Some public api endpoints do not have the appropriate CORS headers configured correctly, so this function proxies and caches the results

## /serverless/dailyCrimeUpdate

This captures public data from APD, and summarizes it in various aggregations (month, year, sums, etc)

Current state: The data is captured correctly, but some of the final summary roll-ups are not being calculated correctly. Not yet used for live data.

## /serverless/dailyGoogleKml

This function captures a KML file from Google MyMaps and saves it to S3. Not currently running daily

## /serverless/summarize911

Takes the archived 911 data captured by /serverless/archive911 and summarizes it by date


![Creative Commons License](https://i.creativecommons.org/l/by-nc/4.0/88x31.png)

This work is licensed under a [Creative Commons Attribution-NonCommercial 4.0 International License](http://creativecommons.org/licenses/by-nc/4.0/).