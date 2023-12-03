import React, { useState, useEffect }  from "react"
import { Link, useLocation } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa"
import { FaRegHeart } from "react-icons/fa6"
import { FiShoppingCart } from "react-icons/fi"
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
const CURRENT_USER_TYPES = USER_TYPES.Admin  


function Header() {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState('');

    useEffect(() => {
        const currentPath = location.pathname;
        setActiveItem(currentPath);
    }, [location.pathname]);

    const canSeeDashboard = () => {
        return (CURRENT_USER_TYPES !== USER_TYPES.User) && (CURRENT_USER_TYPES !== USER_TYPES.Client);
    }

    const canSeeClientTools = () => {
        return (CURRENT_USER_TYPES !== USER_TYPES.User);
    }

    const canSeeUserTools = () => {
        return (CURRENT_USER_TYPES === USER_TYPES.User);
    }
    

    return(
        <header>
            <div className="top-header">
                <img id="logo" src={logo} alt="Logo"></img>
                <SearchBar/>
                <ul id="user-tools">
                    { canSeeClientTools() && <li className={`user-tool-content ${location.pathname === "/Profilo" ? "active" : ""}`}>
                        <Link to="/Profilo">
                            <div className="link">
                                <div className="icon-user-tool">
                                    <FaUserCircle />
                                </div>
                                <span>Profilo</span>
                            </div>
                        </Link></li>
                    }
                    { canSeeClientTools() && <li className={`user-tool-content ${location.pathname === "/Wishlist" ? "active" : ""}`}>
                        <Link to="/Wishlist">
                            <div className="link">
                                <div className="icon-user-tool">
                                    <FaRegHeart />
                                </div>
                                <span>Wishlist</span>
                            </div>
                        </Link></li> 
                    }
                    { canSeeClientTools() && <li className={`user-tool-content ${location.pathname === "/Carrello" ? "active" : ""}`}>
                        <Link to="/Carrello">
                            <div className="link">
                                <div className="icon-user-tool">
                                    <FiShoppingCart />
                                </div>
                                <span>Carrello</span>
                            </div>
                        </Link></li>
                    }
                    { canSeeUserTools() && <li className={`user-tool user login${location.pathname === "/Login" ? "active" : ""}`}><Link to="/Login">Accedi</Link></li> }
                    { canSeeUserTools() && <li className={`user-tool user signin${location.pathname === "/Signin" ? "active" : ""}`}><Link to="/Signin">Registrati</Link></li> }
                </ul>
            </div>
            <nav className="bottom-header">
                <ul id="navbar">
                    <li className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}><Link to="/">Home</Link></li>
                    <li className={`navbar-link ${location.pathname === "/ChiSiamo" ? "active" : ""}`}><Link to="/ChiSiamo">Chi siamo</Link></li>
                    <li className={`navbar-link ${location.pathname === "/CatalogoProdotti" ? "active" : ""}`}><Link to="/CatalogoProdotti">Catalogo prodotti</Link></li>
                    <li className={`navbar-link ${location.pathname === "/Idee" ? "active" : ""}`}><Link to="/Idee">Idee e spunti</Link></li>
                    <li className={`navbar-link ${location.pathname === "/AssistenzaClienti" ? "active" : ""}`}><Link to="/AssistenzaClienti">Assistenza clienti</Link></li>
                    { canSeeDashboard() && <li className={`navbar-link dashboard ${location.pathname === "/Dashboard" ? "active" : ""}`}><Link to="/Dashboard">Dashboard</Link></li> }
                </ul>                
            </nav>
        </header>
    )
}

export default Header;

//{ canSeeClientTools() && <li className={`user-tool ${location.pathname === "/Profilo" ? "active" : ""}`}><Link to="/Profilo"><FaUserCircle/>Profilo</Link></li> }

/*
                    { canSeeClientTools() && <li className={`user-tool ${location.pathname === "/Profilo" ? "active" : ""}`}>
                        <Link to="/Profilo">
                            <div id="profilo" className="user-tool-content">
                                <div className="icon-user-tool">
                                    <FaUserCircle />
                                </div>
                                <span>Profilo</span>
                            </div>
                        </Link></li> 
                    }
                    { canSeeClientTools() && <li className={`user-tool ${location.pathname === "/Wishlist" ? "active" : ""}`}>
                        <Link to="/Wishlist">
                            <div className="user-tool-content">
                                <div className="icon-user-tool">
                                    <FaRegHeart />
                                </div>
                                <span>Wishlist</span>
                            </div>
                        </Link></li> 
                    }
                    { canSeeClientTools() && <li className={`user-tool ${location.pathname === "/Carrello" ? "active" : ""}`}>
                        <Link to="/Carrello">
                            <div className="user-tool-content">
                                <div className="icon-user-tool">
                                    <FiShoppingCart />
                                </div>
                                <span>Carrello</span>
                            </div>
                        </Link></li>
                    }

*/