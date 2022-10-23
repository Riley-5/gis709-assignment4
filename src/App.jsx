import "leaflet/dist/leaflet.css"
import React from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import "./style.css"

const App = () => {
	return (
		<MapContainer center={[-25.7487, 28.238]} zoom={15}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
		</MapContainer>
	)
}

export default App
