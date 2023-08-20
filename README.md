# Open Freight
Open and optimised routes for intermodal freight

# Project description
Trucks and trains are the vital arteries of Australia's national freight network. Yet, due to commercial sensitivities and a scarcity of accessible data, the precise logistics and planning that underpin route selection for transporting freight from Point A to Point B remain largely enigmatic. Our analysis of traffic and demand patterns, however, reveals a striking insight: freight is often shipped simultaneously, resulting in road congestion, elongated travel times, and subsequently, increased fuel costs. This lack of coordination translates to lost productivity, costing the Australian economy an estimated $16.5 billion annually. At <Project Name>, we are committed to fostering transparency in this crucial sector. Our mission is to open-source the freight data, equipping freight operators with the essential information and tools they need to collaborate effectively and optimise their routes. Together, we are paving the way towards a more efficient and sustainable future for Australian freight.

# Data story
## Step one - Data Collection
**Major Manufacturers and Distribution Centres:** Use the Google Maps Places API to identify the locations of major manufacturing plants and distribution centres across Australia. These could include facilities for automotive, electronics, machinery, and food products, among others. 
Ports and Intermodal Terminals: Identify the major seaports and intermodal terminals where goods can move between trucks and trains. These could include key ports like Sydney, Melbourne, Brisbane, Perth, and Adelaide, and major intermodal terminals in these cities and others. 

**Commodity Data:** Gather data on the broad categories of commodities moved by trucks, trains, or both. For instance, perishable goods and high-value items might be more likely to move by road, whereas bulky and heavy commodities like coal or grain might be transported more efficiently by train.

## Step two - Data Collection
**Route Efficiency:** Analyze potential routes between manufacturers, distribution centres, and ports/intermodal terminals. Use the Google Maps API or other routing algorithms to determine the most efficient routes based on distance, travel time, and traffic conditions for trucks. For trains, consider the existing rail infrastructure and scheduling. 

**Mode of Transport Decision:** Based on the commodity data, determine which goods are likely to be moved exclusively by trucks, by trains, or by both. For goods that could use both modes, analyse which would be more efficient based on speed, cost, and volume.

## Step three - Data Collection

**Interactive Map:** Use a mapping tool (e.g., Google Maps API, ArcGIS, or QGIS) to create an interactive map that displays: Major manufacturers and distribution centres (as points) Ports and intermodal terminals (as points) Optimized routes for trucks (as lines) Railway lines for freight trains (as lines)

**Summary Insights:** Provide graphs and charts that summarize key insights, such as: The proportion of goods moved by trucks vs. trains The most heavily used routes The busiest ports and intermodal terminals


## Attribution
This project uses the following datasets:
- https://catalogue.data.infrastructure.gov.au/dataset/australian-intermodal-terminals
- https://catalogue.data.infrastructure.gov.au/dataset/australian-seaports
- https://data.gov.au/data/dataset/freight-vehicle-congestion-in-australia-s-5-major-cities
- https://catalogue.data.infrastructure.gov.au/dataset/national-key-freight-routes-map/resource/73072f20-119a-4a09-aed8-724914b48fbc
- https://catalogue.data.infrastructure.gov.au/dataset/artc-train-count-and-average-speed
- https://developers.google.com/maps/documentation/routes
- https://developers.google.com/maps/documentation/places/web-service
- https://chat.openai.com/

## Getting started
Due to the nature of Cross-Origin-Resource policy, this project needs to run on a server. Any server will work but the simple python http.server will suffice
1.   Get a Google maps API key
2.   inside the `static` folder, add a .env file only containing the API key, this is gitignored and will be safe
3.   run `start.bat`
4.   Go to `http://localhost:8000/static/index.html`
5.   Enjoy!

## Learn more
This project uses the Google maps API and the OpenStreetMap api to visualise and provide routes.
