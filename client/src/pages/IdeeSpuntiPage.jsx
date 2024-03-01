import React, { useState, useEffect }  from "react"
import '../styles/IdeeSpuntiPage.css'
import lumialogo from "../assets/images/lumia-logo.svg"
import loading from "../assets/images/loading.gif"

function IdeeSpunti() {
    const [isDropdownVisibile, setDropdownVisible] = useState(false);

    /*Teletrasporto l'utente all'inizio della pagina appena viene fatto il rendering*/
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

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
                <img className="loading-gif" src={loading} alt="caricamento"></img>
                <p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p>
            </div>
        </div>
    )
}

export default IdeeSpunti;