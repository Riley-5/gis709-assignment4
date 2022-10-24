import "leaflet/dist/leaflet.css"
import React, { useEffect, useState } from "react"
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet"
import "./style.css"

const App = () => {
	// State to hold the roads
	const [routes, setRoutes] = useState(null)

	/*
        Collect data from Geoserver
        Set the routes state to the received data
    */
	useEffect(() => {
		fetch(
			"http://localhost:9090/geoserver/routes/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=routes%3Ashortest_route&outputFormat=application%2Fjson&viewparams=source:549;target:415"
		)
			.then((response) => response.json())
			.then((data) => setRoutes(data))
	}, [])

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
		</MapContainer>
	)
}

export default App
