import React, { useState, useEffect }  from "react"
import { Link, useLocation } from 'react-router-dom'

import '../styles/Header.css'
import logo from '../assets/images/Lucciola.png'
import SearchBar from './SearchBarComponent.jsx'

/* Autenticazione utente */
const USER_TYPES = {
    Admin: 'Administrator',
    Employee: 'Employee',
    Client: 'Client user',
    User: 'Unlogged user'
}
const CURRENT_USER_TYPES = USER_TYPES.User


function Header() {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState('');

    useEffect(() => {
        const currentPath = location.pathname;
        setActiveItem(currentPath);
    }, [location.pathname]);

    const canSeeDashboard = () =>{
        return (CURRENT_USER_TYPES !== USER_TYPES.User) && (CURRENT_USER_TYPES !== USER_TYPES.Client);
    }

    return(
        <header>
            <div className="top-header">
                <img id="logo" src={logo} alt="Logo"></img>
                <SearchBar/>
                <ul id="user-tools">
                    <li className={`user-tool ${location.pathname === "/Profilo" ? "active" : ""}`}>
                        <Link to="/Profilo">Profilo</Link></li>
                    <li className={`user-tool ${location.pathname === "/Wishlist" ? "active" : ""}`}><Link to="/Wishlist">Wishlist</Link></li>
                    <li className={`user-tool ${location.pathname === "/Carrello" ? "active" : ""}`}><Link to="/Carrello">Carrello</Link></li>
                </ul>
            </div>
            <nav className="bottom-header">
                <ul id="navbar">
                    <li className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}><Link to="/">Home</Link></li>
                    <li className={`navbar-link ${location.pathname === "/ChiSiamo" ? "active" : ""}`}><Link to="/ChiSiamo">Chi siamo</Link></li>
                    <li className={`navbar-link ${location.pathname === "/CatalogoProdotti" ? "active" : ""}`}><Link to="/CatalogoProdotti">Catalogo prodotti</Link></li>
                    <li className={`navbar-link ${location.pathname === "/Idee" ? "active" : ""}`}><Link to="/Idee">Idee e spunti</Link></li>
                    <li className={`navbar-link ${location.pathname === "/AssistenzaClienti" ? "active" : ""}`}><Link to="/AssistenzaClienti">Assistenza clienti</Link></li>
                    {canSeeDashboard() && 
                        <li className={`navbar-link dashboard ${location.pathname === "/Dashboard" ? "active" : ""}`}><Link to="/Dashboard">Dashboard</Link></li>
                    }
                </ul>                
            </nav>
        </header>
    )
}

export default Header;


/* 
/*
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
*/
