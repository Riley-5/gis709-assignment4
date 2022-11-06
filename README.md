# Safe Routes

## How to use the app

The application allows a user to pick a start and end location by either searching for a start and end location with the form above the map or by dragging the markers around the map. Once a start and end location have been determined the shortest and safest route between the start and end location will be displayed.

## Motivation

South Africa has many townships, dangerous roads and areas that are not safe to be in. A "standard" GPS provides a route based on the shortest distance which may result in the shortest route passing through dangerous areas.

## Solution

To address this problem the routing can be based on the the safety/danger of the roads instead of the shortest distance.

---

## The App

### Tech Stack

- Leaflet
- GeoServer
- Nominatim
- Postgres + PostGIS + pgRouting

### How the tech all works

- Postgres with the PostGIS and pgRouting extention is used to store the spatial data
- GeoServer is used to serve the spatial data from the database to the frontend
- Nominatim is an API that provides the locations and coordinates for searched places in Hatfield
- Leaflet is a mapping library that visually shows the routes that a user requests

### How to start the app

Navigate to the source folder in the repository (/safe_routes) and execute the following in a terminal

```bash
docker compose up
```

This will start all of the necessary services. Note if there is any service running on port 80 (usually Nginx) on your local machine stop the service (Otherwise localhost in your browser will navigate you to the local port instead of the Docker container port). In a browser go to "localhost" and the application should automatically open.
