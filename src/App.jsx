import L from "leaflet"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { GeoJSON, MapContainer, Marker, TileLayer } from "react-leaflet"
import Legend from "./components/Legend"
import SearchLocation from "./components/SearchLocation"
import "./style.css"

const App = () => {
	// Green Leaflet marker
	const greenIcon = new L.Icon({
		iconUrl:
			"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
		shadowUrl:
			"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	})

	const redIcon = new L.Icon({
		iconUrl:
			"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
		shadowUrl:
			"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	})

	// State to hold the roads
	const [mapState, setMapState] = useState(null)
	const [shortestRoute, setShortestRoute] = useState(null)
	const [safestRoute, setSafestRoute] = useState(null)
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
	const [showErrorMessage, setShowErrorMessage] = useState({
		errorMessage: false
	})

	/*
        Collect start and end node from Geoserver
        Set the id of the found node to state
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
	}, [startMarkerCoords, endMarkerCoords])

	/*
		Get the shortest and safest route based on the start and end nodes
		Set the route to state
	*/
	useEffect(() => {
		/*
			shortest route viewparams:
			source -> starting node id
			target -> end node id
		*/
		fetch(
			`http://localhost:9090/geoserver/routes/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=routes%3Ashortest_route&outputFormat=application%2Fjson&viewparams=source:${startNearestVertex};target:${endNearestVertex}`
		)
			.then((response) => response.json())
			.then((data) => setShortestRoute(data))

		/*
			safest route viewparams:
			source -> starting id
			target -> end node id
		*/
		fetch(
			`http://localhost:9090/geoserver/routes/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=routes%3Asafest_route&outputFormat=application%2Fjson&viewparams=source:${startNearestVertex};target:${endNearestVertex}`
		)
			.then((response) => response.json())
			.then((data) => setSafestRoute(data))
	}, [startNearestVertex, endNearestVertex])

	/*
		When dragging start marker ends 
		Get the coordinates and set to state
	*/
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

	/*
		When dragging end marker ends 
		Get the coordinates and set to state
	*/
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

	/*
		Create a layer for the shortest route
	*/
	const ShortestRoute = (props) => {
		return <GeoJSON data={props.shortestRoute} />
	}

	/*
		Create a layer for the safest route
	*/
	const SafestRoute = (props) => {
		return <GeoJSON data={props.safestRoute} style={{ color: "green" }} />
	}

	/*
		From the searched start and end locations searched
		Query Nominatim and get the coordinates from the searched locations
		Set the startMarkerCoords and endMarkerCoords to the lat and lng of the searched locations
	*/
	const handleSearchLocation = (formData) => {
		fetch(
			`https://nominatim.openstreetmap.org/search?country=&q=${formData.startLocation}, Pretoria, South Africa&format=geojson`
		)
			.then((response) => response.json())
			.then((data) => {
				data.features.forEach((startPoint) => {
					setStartMarkerCoords({
						lat: startPoint.geometry.coordinates[1],
						lng: startPoint.geometry.coordinates[0]
					})
				})
			})

		fetch(
			`https://nominatim.openstreetmap.org/search?country=&q=${formData.endLocation}, Pretoria, South Africa&format=geojson`
		)
			.then((response) => response.json())
			.then((data) => {
				data.features.forEach((endPoint) => {
					setEndMarkerCoords({
						lat: endPoint.geometry.coordinates[1],
						lng: endPoint.geometry.coordinates[0]
					})
				})
			})
	}

	return (
		<div>
			<div id="top-bar">
				<div className="side-text">
					<h1>Safe Routes</h1>
				</div>
				<SearchLocation
					handleSearchLocation={handleSearchLocation}
					setShowErrorMessage={setShowErrorMessage}
				/>
				<div className="side-text">
					{showErrorMessage.errorMessage ? (
						<h2>Please enter a Start & End Location</h2>
					) : (
						<h2>Navigate a route in Hatfield</h2>
					)}
				</div>
			</div>
			<MapContainer ref={setMapState} center={[-25.7487, 28.238]} zoom={15}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<ShortestRoute shortestRoute={shortestRoute} />
				<SafestRoute safestRoute={safestRoute} />
				<Marker
					icon={greenIcon}
					draggable={true}
					eventHandlers={startMarkerEventHandlers}
					position={startMarkerCoords}
					ref={startMarkerRef}
				></Marker>
				<Marker
					icon={redIcon}
					draggable={true}
					eventHandlers={endMarkerEventHandlers}
					position={endMarkerCoords}
					ref={endMarkerRef}
				></Marker>
				<Legend mapState={mapState} />
			</MapContainer>
		</div>
	)
}

export default App
