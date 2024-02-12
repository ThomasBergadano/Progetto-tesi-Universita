import React from "react"
import { IoFilter } from "react-icons/io5"
import "../styles/FilterFloatingButton.css"

function FilterFloatingButton(){
    return (
        <div className="icon-filter-container">
            <div className="icon-filter">
                <IoFilter />
            </div>
        </div>
    )
}

export default FilterFloatingButton