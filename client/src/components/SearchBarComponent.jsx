import React, { useState, useEffect, useRef }  from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

const SearchBar = () => {
    const navigate = useNavigate();

    /*Costanti per il contenuto della barra di ricerca*/
    const [parolaDiRicerca, setParolaDiRicerca] = useState("");

    const handlerRicerca = (e) => {
        e.preventDefault();
        navigate(`/CatalogoProdotti?ricercaNome=${encodeURIComponent(parolaDiRicerca)}`);
        setParolaDiRicerca("");
    }

    const handlerCambiaRicerca = (e) => {
        setParolaDiRicerca(e.target.value);
    }

    return (
        <form id="searchbar" onSubmit={handlerRicerca}>
            <input type="text" id="search" className="search_input" onChange={handlerCambiaRicerca} value={parolaDiRicerca} placeholder="Cerca"/>
            <button type="submit" className="search_button">
                <FontAwesomeIcon icon={faMagnifyingGlass}/>
            </button>
        </form>
    )
}
export default SearchBar