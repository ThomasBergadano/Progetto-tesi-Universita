import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

const SearchBar = ({ posts, setSearchResults }) => {
    const handleSubmit = (e) => e.preventDefault()

    const handleSearchChange = (e) => {
        /*if (!e.target.value) return setSearchResults(posts)

        const resultsArray = posts.filter(post => post.title.includes(e.target.value) || post.body.includes(e.target.value))

        setSearchResults(resultsArray)*/
    }

    return (
        <form id="searchbar" onSubmit={handleSubmit}>
            <input type="text" id="search" className="search_input" onChange={handleSearchChange} placeholder="Cerca"/>
            <button className="search_button" onClick={handleSearchChange}>
                <FontAwesomeIcon icon={faMagnifyingGlass}/>
            </button>
        </form>
    )
}
export default SearchBar