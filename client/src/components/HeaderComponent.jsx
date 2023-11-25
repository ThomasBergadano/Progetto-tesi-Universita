import React from "react";
import { Link, Route, Routes } from 'react-router-dom'
import '../styles/Header.css'
import logo from '../assets/images/Lucciola.png'

function Header() {
    return(
        <header>
            <div className="top-header">
                <img id="logo" src={logo} alt="Logo"></img>
                <input type="text" id="search-bar" placeholder="Cerca..."/>
                <ul id="user-tools">
                    <li><Link to="/Profilo">Profilo</Link></li>
                    <li><Link to="/Wishlist">Wishlist</Link></li>
                    <li><Link to="/Carrello">Carrello</Link></li>
                </ul>
            </div>
            <nav className="bottom-header">
                <ul className="navbar">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/ChiSiamo">Chi siamo</Link></li>
                    <li><Link to="/CatalogoProdotti">Catalogo prodotti</Link></li>
                    <li><Link to="/Idee">Idee e spunti</Link></li>
                    <li><Link to="/AssistenzaClienti">Assistenza clienti</Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;