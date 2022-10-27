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
	const [startNearestVertex, setStartNearestVertex] = useState(null)
	const [endNearestVertex, setEndNearestVertex] = useState(null)
	const [startMarkerCoords, setStartMarkerCoords] = useState([-25.7487, 28.238])
	const [endMarkerCoords, setEndMarkerCoords] = useState([-25.75, 28.25])

	/*
        Collect data from Geoserver
        Set the routes state to the received data
    */
	useEffect(() => {
		/*
			startNearestVertex viewparams:
			x -> latitude
			y -> longitude
		*/
		fetch(
			`http://localhost:9090/geoserver/routes/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=routes%3Anearest_vertex&outputFormat=application%2Fjson&viewparams=x:-25.7487;y:28.238`
		)
			.then((response) => response.json())
			.then((data) =>
				data.features.forEach((point) => {
					setStartNearestVertex(point.properties.id)
				})
			)

		/*
			endNearestVertex viewparams:
			x -> latitude
			y -> longitude
		*/
		fetch(
			`http://localhost:9090/geoserver/routes/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=routes%3Anearest_vertex&outputFormat=application%2Fjson&viewparams=x:-25.75;y:28.25`
		)
			.then((response) => response.json())
			.then((data) =>
				data.features.forEach((point) => {
					setEndNearestVertex(point.properties.id)
				})
			)

		/*
			viewparams:
			source -> starting node id
			target -> end node id
		*/
		fetch(
			`http://localhost:9090/geoserver/routes/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=routes%3Ashortest_route&outputFormat=application%2Fjson&viewparams=source:${5};target:${164}`
		)
			.then((response) => response.json())
			.then((data) => setRoutes(data))
	}, [startMarkerCoords, startNearestVertex, endMarkerCoords, endNearestVertex])

	const startMarkerRef = useRef(null)
	const startMarkerEventHandlers = useMemo(
		() => ({
			dragend() {
				const marker = startMarkerRef.current
				if (marker !== null) {
					setStartMarkerCoords(marker.getLatLng())
				}
			}
		}),
		[]
	)

	const endMarkerRef = useRef(null)
	const endMarkerEventHandlers = useMemo(
		() => ({
			dragend() {
				const marker = endMarkerRef.current
				if (marker !== null) {
					setEndMarkerCoords(marker.getLatLng())
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
			<Marker
				draggable={true}
				eventHandlers={startMarkerEventHandlers}
				position={startMarkerCoords}
				ref={startMarkerRef}
			></Marker>
			<Marker
				draggable={true}
				eventHandlers={endMarkerEventHandlers}
				position={endMarkerCoords}
				ref={endMarkerRef}
			></Marker>
		</MapContainer>
	)
}

export default App
