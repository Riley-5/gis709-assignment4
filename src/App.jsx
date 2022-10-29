import React, { useEffect, useMemo, useRef, useState } from "react"
import { GeoJSON, MapContainer, Marker, TileLayer } from "react-leaflet"
import Legend from "./components/Legend"
import "./style.css"

const App = () => {
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
	const [searchValue, setSearchValue] = useState({
		startLocation: "",
		endLocation: ""
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

	const ShortestRoute = (props) => {
		return <GeoJSON data={props.shortestRoute} />
	}

	const SafestRoute = (props) => {
		return <GeoJSON data={props.safestRoute} style={{ color: "green" }} />
	}

	// When the input to the form changes update the forms state value
	const handleChange = (event) => {
		const { name, value } = event.target
		setSearchValue((prevSearchValue) => {
			return {
				...prevSearchValue,
				[name]: value
			}
		})
	}

	/*
		When the form is submitted 
		Set the form state value to an empty string 
	*/
	const handleSubmit = (event) => {
		event.preventDefault()
		// Rest form to be empty
		setSearchValue({
			startLocation: "",
			endLocation: ""
		})

		findStartEndLocation(searchValue.startLocation, searchValue.endLocation)
	}

	/*
		From the searched start and end locations searched
		Query Nominatim and get the coordinates from the searched locations
		Set the startMarkerCoords and endMarkerCoords to the lat and lng of the searched locations
	*/
	const findStartEndLocation = (start, end) => {
		fetch(
			`https://nominatim.openstreetmap.org/search?country=&q=${start}, South Africa&format=geojson`
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
			`https://nominatim.openstreetmap.org/search?country=&q=${end}, South Africa&format=geojson`
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
			<form onSubmit={handleSubmit}>
				<input
					name="startLocation"
					placeholder="Start Location"
					type="text"
					value={searchValue.startLocation}
					onChange={handleChange}
				></input>
				<input
					name="endLocation"
					placeholder="End Location"
					type="text"
					value={searchValue.endLocation}
					onChange={handleChange}
				></input>
				<input type="submit" value="Find Route"></input>
			</form>
			<MapContainer ref={setMapState} center={[-25.7487, 28.238]} zoom={15}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<ShortestRoute shortestRoute={shortestRoute} />
				<SafestRoute safestRoute={safestRoute} />
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
				<Legend mapState={mapState} />
			</MapContainer>
		</div>
	)
}

export default App
