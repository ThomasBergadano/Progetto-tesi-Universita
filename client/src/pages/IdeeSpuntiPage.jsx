import React, { useState, useEffect }  from "react"
import '../styles/IdeeSpuntiPage.css'
import lumialogo from "../assets/images/lumia-logo.svg"

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
                <img id="lum" src={lumialogo} alt="Logo"></img>
                <p>IdeeSpuntiComponent</p>
                <p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p>
            </div>
        </div>
    )
}

export default IdeeSpunti;