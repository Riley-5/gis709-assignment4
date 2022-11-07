# Safe Routes

## Motivation

South Africa has many townships, dangerous roads and areas that are not safe to be in. A "standard" GPS provides a route based on the shortest distance between the start and end location however, this may result in the shortest route passing through dangerous areas. Apps such as Google maps and Wayz have managed to incorperate traffic into their routing system but, to our knowledge no one has considered safetey as yet. 

## Solution

To address this problem, we have created an application that incorperates saftey into the routing suggestions. The suggested route is based on the the safety/danger of the roads instead of the shortest distance. It uses Dijkstra algorithm to determine the safest routes based on the fewest crime incidences. 

## How to Use the App

The application allows a user to pick a start and end location by either searching for a start and end location with the form above the map or by dragging the markers around the map. Once a start and end location have been determined, the safest route between the start and end location will be displayed.

---

## The App

### Tech Stack

All items used in stack are open source. The links attached lead you to the download and/ or documentation for each item respectively.  

- [PostgreSQL](https://www.postgresql.org/)
- [PostGIS](https://postgis.net/)
- [pgRouting](https://pgrouting.org/)
- [GeoServer](https://geoserver.org/)
- [Nominatim](https://nominatim.org/)
- [Leaflet](https://leafletjs.com/)

### How the Tech Works

- Postgres with the PostGIS and pgRouting extention is used to store the spatial data.
- GeoServer is used to serve the spatial data from the database to the frontend.
- Nominatim is an API that provides the locations and coordinates for searched places in Hatfield.
- Leaflet is a mapping library that visually shows the routes that the user requests.

### How to Start the App
Ensure that you have [Docker](https://www.docker.com/products/docker-desktop/) downloaded on your computer. 

If you are using a Microsoft Windows computer make sure to download Windows Subsystem for Linux (WSL) as Docker runs through WSL on Windows. To do this, follow the steps set out in [Learn Microsoft](https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package).

Navigate to the source folder in the repository (/gis709-assignment4) and execute the following to start all of the necessary services.

```bash
docker compose up
```

Note if there is any service running on port 80 (usually Nginx) on your local machine stop the service (Otherwise localhost in your browser will navigate you to the local port instead of the Docker container port). In a browser go to "localhost" and the application should automatically open.

It may take a few seconds for the database to kick in. This will create all the infrastructure however, you will needtocreate your own databases and data.
