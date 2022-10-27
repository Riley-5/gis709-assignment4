import "leaflet/dist/leaflet.css"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { GeoJSON, MapContainer, Marker, TileLayer } from "react-leaflet"
import "./style.css"

// Styling for leaflet marker
import L from "leaflet"
import icon from "leaflet/dist/images/marker-icon.png"
import iconShadow from "leaflet/dist/images/marker-shadow.png"

const DefaultIcon = L.icon({
	iconUrl: icon,
	shadowUrl: iconShadow
})

L.Marker.prototype.options.icon = DefaultIcon

const App = () => {
	// State to hold the roads
	const [routes, setRoutes] = useState(null)
	const [nearestVertex, setNearestVertex] = useState(null)

	/*
        Collect data from Geoserver
        Set the routes state to the received data
    */
	useEffect(() => {
		/*
			viewparams:
			source -> starting node id
			target -> end node id
		*/
		// fetch(
		// 	"http://localhost:9090/geoserver/routes/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=routes%3Ashortest_route&outputFormat=application%2Fjson&viewparams=source:498;target:368"
		// )
		// 	.then((response) => response.json())
		// 	.then((data) => setRoutes(data))
		/*
			viewparams:
			x -> latitude
			y -> longitude
		*/
		// fetch(
		// 	"http://localhost:9090/geoserver/routes/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=routes%3Anearest_vertex&outputFormat=application%2Fjson&viewparams=x:-25.7487;y:28.238"
		// )
		// 	.then((response) => response.json())
		// 	.then((data) => setNearestVertex(data))
	}, [])

	const [coords, setCoords] = useState([-25.7487, 28.238])
	console.log(coords)
	const markerRef = useRef(null)
	const eventHandlers = useMemo(
		() => ({
			dragend() {
				const marker = markerRef.current
				if (marker !== null) {
					setCoords(marker.getLatLng())
				}
			}
		}),
		[]
	)

	return (
		<MapContainer center={[-25.7487, 28.238]} zoom={15}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{/* 
                If there are routes stored in state return GeoJSON layer 
                Else return null
            */}
			{routes ? <GeoJSON data={routes} /> : null}
			{nearestVertex ? <GeoJSON data={nearestVertex} /> : null}
			<Marker
				draggable={true}
				eventHandlers={eventHandlers}
				position={coords}
				ref={markerRef}
			></Marker>
		</MapContainer>
	)
}

export default App
