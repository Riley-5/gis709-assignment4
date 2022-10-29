import L from "leaflet"
import { useEffect } from "react"
import "../style.css"

/*
    Props:
    mapState
*/

const Legend = (props) => {
	useEffect(() => {
		if (props.mapState) {
			const legend = L.control({ position: "bottomright" })
			legend.onAdd = () => {
				const div = L.DomUtil.create("div", "legend")
				div.innerHTML = `
                <table id="legend-table">
                    <tr>
                        <th  colspan="2">Route</th>
                    </tr>
                    <tr>
                        <td class="color-width" style="background-color: #3388FF;"></td>
                        <td class="center-text">Shortest</td>
                    </tr>
                    <tr>
                        <td class="color-width" style="background-color: #008000;"></td>
                        <td class="center-text">Safest</td>
                    </tr>
                </table>
            `
				return div
			}

			props.mapState.addControl(legend)
		}
	}, [props.mapState])

	return null
}

export default Legend
