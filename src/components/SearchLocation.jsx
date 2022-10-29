import React, { useState } from "react"

/*
    Props:
    handleSearchLocation
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
		event.preventDefault()
		// Rest form to be empty
		props.handleSearchLocation(searchValue)
	}

	return (
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
	)
}

export default SearchLocation
