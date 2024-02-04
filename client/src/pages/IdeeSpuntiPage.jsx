import React, { useState, useEffect }  from "react"
import Header from "../components/HeaderComponent"
import Footer from "../components/FooterComponent"
import { FaUserCircle } from "react-icons/fa"
import '../styles/IdeeSpuntiPage.css'
import lumia from "../assets/images/Lumia.png"
import lumia2 from "../assets/images/Lumia2.png"

function IdeeSpunti() {
    const [isDropdownVisibile, setDropdownVisible] = useState(false);
    const handleDropdownProfilo = () => {
        setDropdownVisible(!isDropdownVisibile);
    }

    const handleLogout = () => {

        // Chiudo il dropdown dopo il logout
        setDropdownVisible(false);
    };


    return(
        <div>
            <div id="suggerimenti">
                <img id="lum" src={lumia2} alt="Logo"></img>
                <p>IdeeSpuntiComponent</p>
                <p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p>
            </div>
        </div>
    )
}

export default IdeeSpunti;