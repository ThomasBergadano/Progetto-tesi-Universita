import React from "react"
import { Link, Route, Routes } from 'react-router-dom'
import '../styles/Header.css'
import logo from '../assets/images/Lucciola.png'
import SearchBar from './SearchBarComponent.jsx'

/*<input type="text" id="search-bar" placeholder="Cerca..."/>*/
function Header() {
    return(
        <header>
            <div className="top-header">
                <img id="logo" src={logo} alt="Logo"></img>
                <SearchBar/>
                <ul id="user-tools">
                    <li className="user-tool"><Link to="/Profilo">Profilo</Link></li>
                    <li className="user-tool"><Link to="/Wishlist">Wishlist</Link></li>
                    <li className="user-tool"><Link to="/Carrello">Carrello</Link></li>
                </ul>
            </div>
            <nav className="bottom-header">
                <ul id="navbar">
                    <li className="navbar-link"><Link to="/">Home</Link></li>
                    <li className="navbar-link"><Link to="/ChiSiamo">Chi siamo</Link></li>
                    <li className="navbar-link"><Link to="/CatalogoProdotti">Catalogo prodotti</Link></li>
                    <li className="navbar-link"><Link to="/Idee">Idee e spunti</Link></li>
                    <li className="navbar-link"><Link to="/AssistenzaClienti">Assistenza clienti</Link></li>
                    <li className="dashboard"><Link to="/Dashboard">Dashboard</Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;