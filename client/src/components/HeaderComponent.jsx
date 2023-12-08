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
const CURRENT_USER_TYPES = USER_TYPES.User  


function Header() {
    /*useEffect per il tracciamento della posizione all'interno della pagina*/
    const location = useLocation();
    const [activeItem, setActiveItem] = useState('');

    useEffect(() => {
        const currentPath = location.pathname;
        setActiveItem(currentPath);
    }, [location.pathname]);

    /*useEffect per cambiare l'header (mostrare la navbar) sulla base della coordinata Y dell'utente'*/
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const headerHeight = 151;
    
            setIsScrolled(scrollPosition > headerHeight);
        };
    
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    /*Funzione per i permessi in base al ruolo*/
    const canSeeDashboard = () => {
        return (CURRENT_USER_TYPES !== USER_TYPES.User) && (CURRENT_USER_TYPES !== USER_TYPES.Client);
    }

    const canSeeClientTools = () => {
        return (CURRENT_USER_TYPES !== USER_TYPES.User);
    }

    const canSeeUserTools = () => {
        return (CURRENT_USER_TYPES === USER_TYPES.User);
    }

    const AdminsCantSee = () => {
        return (CURRENT_USER_TYPES !== USER_TYPES.Admin) && (CURRENT_USER_TYPES !== USER_TYPES.Employee);
    }
    
    /*Effetto dei link per scollare in cima alla pagina*/
    const scrollToTop = () => {
        const scrollDuration = 500; //ms
        const scrollStep = -window.scrollY / (scrollDuration / 15);
        
        const scrollInterval = setInterval(() => {
          if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep);
          } else {
            clearInterval(scrollInterval);
          }
        }, 15);
    };

    return(
        <>
            <header className={`main-header ${isScrolled ? 'hidden' : ''}`}>
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
                        <li className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}><Link to="/" onClick={scrollToTop}>Home</Link></li>
                        <li className={`navbar-link ${location.pathname === "/ChiSiamo" ? "active" : ""}`}><Link to="/ChiSiamo" onClick={scrollToTop}>Chi siamo</Link></li>
                        <li className={`navbar-link ${location.pathname === "/CatalogoProdotti" ? "active" : ""}`}><Link to="/CatalogoProdotti" onClick={scrollToTop}>Catalogo prodotti</Link></li>
                        <li className={`navbar-link ${location.pathname === "/Idee" ? "active" : ""}`}><Link to="/Idee" onClick={scrollToTop}>Idee e spunti</Link></li>
                        <li className={`navbar-link ${location.pathname === "/AssistenzaClienti" ? "active" : ""}`}><Link to="/AssistenzaClienti" onClick={scrollToTop}>Assistenza clienti</Link></li>
                        { canSeeDashboard() && <li className={`navbar-link dashboard ${location.pathname === "/Dashboard" ? "active" : ""}`}><Link to="/Dashboard" onClick={scrollToTop}>Dashboard</Link></li> }
                    </ul>                
                </nav>
            </header>
            {isScrolled && (
                <header className="scroll-header">
                    <nav className="scroll-navbar">
                        <div className="scroll-navbar-wrapper">
                            <img id="logo-scroll-navbar" src={logo} alt="Logo"></img>
                            <ul>
                                <li className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}><Link to="/" onClick={scrollToTop}>Home</Link></li>
                                <li className={`navbar-link ${location.pathname === "/ChiSiamo" ? "active" : ""}`}><Link to="/ChiSiamo" onClick={scrollToTop}>Chi siamo</Link></li>
                                <li className={`navbar-link ${location.pathname === "/CatalogoProdotti" ? "active" : ""}`}><Link to="/CatalogoProdotti" onClick={scrollToTop}>Catalogo prodotti</Link></li>
                                <li className={`navbar-link ${location.pathname === "/Idee" ? "active" : ""}`}><Link to="/Idee" onClick={scrollToTop}>Idee e spunti</Link></li>
                                <li className={`navbar-link ${location.pathname === "/AssistenzaClienti" ? "active" : ""}`}><Link to="/AssistenzaClienti" onClick={scrollToTop}>Assistenza clienti</Link></li>
                                { canSeeDashboard() && <li className={`navbar-link dashboard scroll-dashboard${location.pathname === "/Dashboard" ? "active" : ""}`}><Link to="/Dashboard" onClick={scrollToTop}>Dashboard</Link></li> }
                            </ul>
                            {AdminsCantSee() && <SearchBar/>} 
                        </div>      
                    </nav>
                </header>
            )}
        </>
    )
}

export default Header;