# Open Freight
Open and optimised routes for intermodal freight

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
