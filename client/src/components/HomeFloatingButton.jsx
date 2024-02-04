import React from "react"
import { IoHome } from "react-icons/io5"
import "../styles/HomeFloatingButton.css"

function HomeFloatingButton(){
    return (
        <div className="icon-container">
            <div className="icon-home">
                <IoHome/>
            </div>
        </div>
    )
}

export default HomeFloatingButton