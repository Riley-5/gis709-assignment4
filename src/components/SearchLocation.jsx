import { Button, TextField } from "@mui/material"
import React, { useState } from "react"

/*
    Props:
    handleSearchLocation
	setShowErrorMessage
*/

const SearchLocation = (props) => {
	const [searchValue, setSearchValue] = useState({
		startLocation: "",
		endLocation: ""
	})

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
		Send the searchValue data to the App.jsx file
	*/
	const handleSubmit = (event) => {
		if (searchValue.startLocation === "" || searchValue.endLocation === "") {
			event.preventDefault()
			props.setShowErrorMessage({
				errorMessage: true
			})
		} else {
			event.preventDefault()

			// Reset form to be empty
			setSearchValue({
				startLocation: "",
				endLocation: ""
			})

			// Set the error message to false
			props.setShowErrorMessage({
				errorMessage: false
			})

			// Send the search values to the App
			props.handleSearchLocation(searchValue)
		}
	}

	return (
		<form id="start-end-form" onSubmit={handleSubmit}>
			<div>
				<TextField
					size="small"
					id="start-location"
					variant="outlined"
					margin="dense"
					name="startLocation"
					label="Start Location"
					type="text"
					value={searchValue.startLocation}
					onChange={handleChange}
				></TextField>
				<TextField
					size="small"
					id="end-location"
					variant="outlined"
					margin="dense"
					name="endLocation"
					label="End Location"
					type="text"
					value={searchValue.endLocation}
					onChange={handleChange}
				></TextField>
			</div>
			<Button variant="outlined" size="small" type="submit">
				Find Route
			</Button>
		</form>
	)
}

export default SearchLocation
