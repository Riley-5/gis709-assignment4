import React, { useEffect, useMemo, useRef, useState } from "react"
import { GeoJSON, MapContainer, Marker, TileLayer } from "react-leaflet"
import "./style.css"

const App = () => {
	// State to hold the roads
	const [routes, setRoutes] = useState(null)
	const [startNearestVertex, setStartNearestVertex] = useState(190)
	const [endNearestVertex, setEndNearestVertex] = useState(268)
	const [startMarkerCoords, setStartMarkerCoords] = useState({
		lat: -25.7527555,
		lng: 28.2468943
	})
	const [endMarkerCoords, setEndMarkerCoords] = useState({
		lat: -25.7521842,
		lng: 28.2328684
	})

	/*
        Collect data from Geoserver
        Set the routes state to the received data
    */
	useEffect(() => {
		/*
			startNearestVertex viewparams:
			x -> longitude
			y -> latitude
		*/
		fetch(
			`http://localhost:9090/geoserver/routes/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=routes%3Anearest_vertex&outputFormat=application%2Fjson&viewparams=x:${startMarkerCoords.lng};y:${startMarkerCoords.lat}`
		)
			.then((response) => response.json())
			.then((data) => {
				data.features.forEach((point) => {
					setStartNearestVertex(point.properties.id)
				})
			})

		/*
			endNearestVertex viewparams:
			x -> longitude
			y -> latitude
		*/
		fetch(
			`http://localhost:9090/geoserver/routes/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=routes%3Anearest_vertex&outputFormat=application%2Fjson&viewparams=x:${endMarkerCoords.lng};y:${endMarkerCoords.lat}`
		)
			.then((response) => response.json())
			.then((data) => {
				data.features.forEach((point) => {
					setEndNearestVertex(point.properties.id)
				})
			})

		/*
			viewparams:
			source -> starting node id
			target -> end node id
		*/
		fetch(
			`http://localhost:9090/geoserver/routes/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=routes%3Ashortest_route&outputFormat=application%2Fjson&viewparams=source:${startNearestVertex};target:${endNearestVertex}`
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

	const Route = (props) => {
		return <GeoJSON data={props.routes} />
	}

	return (
		<MapContainer center={[-25.7487, 28.238]} zoom={15}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<Route routes={routes} />
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
