import React, { useState, useEffect, useRef }  from "react"
import { Link, useLocation } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa"
import { FaRegHeart } from "react-icons/fa6"
import { FiShoppingCart } from "react-icons/fi"
import { auth } from "../database/firebase"
import { doc, getDoc, setDoc, collection, getFirestore } from "firebase/firestore"
import db from "../database/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import lumialogo from "../assets/images/lumia-logo.svg"
import SearchBar from './SearchBarComponent.jsx'
import '../styles/Header.css'



/* Autenticazione utente per DEFAULT */
const USER_TYPES = {
    Admin: 'Admin',
    Employee: 'Employee',
    Client: 'Client',
    User: 'User'
}

function Header() {
    const location = useLocation();
    
    /*useEffect che viene aggiornato 1 volta appena auth cambia, ovvero appena l'utente fa il login firebase fa partire una sessione*/
    /*useEffect in realtà viene "runnato" appena il componente viene caricato nel DOM*/
    const [currentUserType, setCurrentUserType] = useState(USER_TYPES.User);
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
              const userUID = user.uid;
              const RiferimentoDocumentoUtente = await doc(db, 'Utenti', userUID);
              const DocumentoUtente = await getDoc(RiferimentoDocumentoUtente);

              if(DocumentoUtente.exists()){
                const ruoloUtente = DocumentoUtente.data().ruolo;
                console.log("ruolo utente: ", ruoloUtente);
                setCurrentUserType(ruoloUtente);
              }
              else{ /*Quando stiamo accedendo a Google per la prima volta, l'header viene montato prima ancora di creare la creazione del documento utente in firestore*/
                console.log("Per gli utenti Google: il documentoUtente non esiste, ma verrà creato a brevissimo");
              }
            }
            else {
              console.log("Lo user ha fatto logout");
            }
        });
    }, [])

    /*Funzione per quando devo fare il logout*/
    const handleLogout = async(e) => {
        signOut(auth).then(() => {
            setCurrentUserType(USER_TYPES.User);
            navigate("/");
        }).catch((error) => {
            console.log("user is logged out");
        });

        setDropdownVisible(false); //Chiudo il dropdown del profilo
    };

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

    /*Gestisco il dropdown del profilo Utente*/
    const [isDropdownVisibile, setDropdownVisible] = useState(false);
    const handleDropdownProfilo = () => {
        setDropdownVisible(!isDropdownVisibile);
    }
    /*Chiusura del dropdown appena clicco al di fuori del dropdown stesso*/
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => { /*Rimuovo il listener alla rimozione del componente*/
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return(
        <>
            <header className={`main-header ${isScrolled ? 'hidden' : ''}`}>
                <div className="top-header">
                    <img id="logo" src={lumialogo} alt="Logo"></img>
                    <SearchBar/>
                    <ul id="user-tools">
                        { (currentUserType !== USER_TYPES.User) && (<li className={`user-tool-content profile ${location.pathname === "/Profilo" ? "active" : ""}`}>
                                <div className="link" ref={dropdownRef} onClick={handleDropdownProfilo}>
                                    <div className="icon-user-tool">
                                        <FaUserCircle />
                                    </div>
                                    <span>Profilo</span>
                                </div>
                                {isDropdownVisibile && (
                                    <div className="dropdown-profilo">
                                        <ul>
                                            <li className="exclude-from-color"><Link to="/Profilo">Il tuo profilo</Link></li>
                                            <hr/>
                                            <li className="li-logout" onClick={(e) => handleLogout(e)}>Logout</li>
                                        </ul>
                                    </div>
                                )}
                            </li>
                        )}
                        { (currentUserType !== USER_TYPES.User) && <li className={`user-tool-content ${location.pathname === "/Wishlist" ? "active" : ""}`}>
                            <Link to="/Wishlist">
                                <div className="link">
                                    <div className="icon-user-tool">
                                        <FaRegHeart />
                                    </div>
                                    <span>Wishlist</span>
                                </div>
                            </Link></li> 
                        }
                        { (currentUserType !== USER_TYPES.User) && <li className={`user-tool-content ${location.pathname === "/Carrello" ? "active" : ""}`}>
                            <Link to="/Carrello">
                                <div className="link">
                                    <div className="icon-user-tool">
                                        <FiShoppingCart />
                                    </div>
                                    <span>Carrello</span>
                                </div>
                            </Link></li>
                        }
                        { (currentUserType === USER_TYPES.User) && <li className={`user-tool user login${location.pathname === "/Login" ? "active" : ""}`}><Link to="/Login">Accedi</Link></li> }
                        { (currentUserType === USER_TYPES.User) && <li className={`user-tool user signup${location.pathname === "/Signup" ? "active" : ""}`}><Link to="/Signup">Registrati</Link></li> }
                    </ul>
                </div>
                <nav className="bottom-header">
                    <ul id="navbar">
                        <li className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}><Link to="/" onClick={scrollToTop}>Home</Link></li>
                        <li className={`navbar-link ${location.pathname === "/CatalogoProdotti" ? "active" : ""}`}><Link to="/CatalogoProdotti" onClick={scrollToTop}>Catalogo prodotti</Link></li>
                        <li className={`navbar-link ${location.pathname === "/Idee" ? "active" : ""}`}><Link to="/Idee" onClick={scrollToTop}>Idee e spunti</Link></li>
                        <li className={`navbar-link ${location.pathname === "/ChiSiamo" ? "active" : ""}`}><Link to="/ChiSiamo" onClick={scrollToTop}>Chi siamo</Link></li>
                        <li className={`navbar-link ${location.pathname === "/AssistenzaClienti" ? "active" : ""}`}><Link to="/AssistenzaClienti" onClick={scrollToTop}>Assistenza clienti</Link></li>
                        { ((currentUserType === USER_TYPES.Admin) || (currentUserType === USER_TYPES.Employee)) && <li className={`navbar-link dashboard ${location.pathname === "/Dashboard" ? "active" : ""}`}><Link to="/Dashboard" onClick={scrollToTop}>Dashboard</Link></li> }
                    </ul>
                    { (currentUserType !== USER_TYPES.Admin) && (currentUserType !== USER_TYPES.Employee) && (
                        <div className="language-container">
                            <div className="dropdown-language">
                                <select className="language">
                                    <option value="it">Italiano</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                        </div>
                        )}          
                </nav>
            </header>
            {isScrolled && (
                <header className="scroll-header">
                    <nav className="scroll-navbar">
                        <div className="scroll-navbar-wrapper">
                            <img id="logo-scroll-navbar" src={lumialogo} alt="Logo"></img>
                            <ul>
                                <li className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}><Link to="/" onClick={scrollToTop}>Home</Link></li>
                                <li className={`navbar-link ${location.pathname === "/CatalogoProdotti" ? "active" : ""}`}><Link to="/CatalogoProdotti" onClick={scrollToTop}>Catalogo prodotti</Link></li>
                                <li className={`navbar-link ${location.pathname === "/Idee" ? "active" : ""}`}><Link to="/Idee" onClick={scrollToTop}>Idee e spunti</Link></li>
                                <li className={`navbar-link ${location.pathname === "/ChiSiamo" ? "active" : ""}`}><Link to="/ChiSiamo" onClick={scrollToTop}>Chi siamo</Link></li>
                                <li className={`navbar-link ${location.pathname === "/AssistenzaClienti" ? "active" : ""}`}><Link to="/AssistenzaClienti" onClick={scrollToTop}>Assistenza clienti</Link></li>
                                { ((currentUserType === USER_TYPES.Admin) || (currentUserType === USER_TYPES.Employee)) && <li className={`navbar-link scroll-dashboard ${location.pathname === "/Dashboard" ? "active" : ""}`}><Link to="/Dashboard" onClick={scrollToTop}>Dashboard</Link></li> }
                            </ul>
                            {(currentUserType !== USER_TYPES.Admin) && (currentUserType !== USER_TYPES.Employee) && <SearchBar/>} 
                        </div>      
                    </nav>
                </header>
            )}
        </>
    )
}

export default Header;

/*
<div className="language-container">
    <div className="dropdown-language">
        <ul className="language-list">
            <li className="language-option"><img src={it} alt="ITA" className="language-icon"/> IT</li>
            <li className="language-option"><img src={en} alt="ENG" className="language-icon"/> EN</li>
        </ul>
    </div>
</div>
*/