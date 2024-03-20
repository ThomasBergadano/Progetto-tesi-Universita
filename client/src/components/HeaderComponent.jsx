import React, { useState, useEffect, useRef }  from "react"
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
import Home from '../pages/HomePage.jsx'
import About from '../pages/AboutPage.jsx'
import CatalogoProdotti from '../pages/CatalogoProdottiPage.jsx'
import EsploraTrend from '../pages/EsploraTrend.jsx'
import AssistenzaClienti from '../pages/AssistenzaClientiPage.jsx'
import Dashboard from '../pages/Dashboard/DashboardPage.jsx'
import GestioneProdotti from '../pages/Dashboard/GestioneProdotti.jsx'
import GestioneUtenti from '../pages/Dashboard/GestioneUtenti.jsx'
import Login from '../pages/LoginPage.jsx'
import Signup from '../pages/SignupPage.jsx'
import Profilo from '../pages/Profilo/ProfilePage.jsx'
import InformazioniPersonali from '../pages/Profilo/InformazioniPersonali.jsx'
import CambioPassword from '../pages/Profilo/CambioPassword.jsx'
import CronologiaOrdini from '../pages/Profilo/CronologiaOrdini.jsx'
import Wishlist from '../pages/WishlistPage.jsx'
import Carrello from '../pages/CarrelloPage.jsx'
import Checkout from '../pages/CheckoutPage.jsx'
import Product from '../pages/ProductPage.jsx'



/* Autenticazione utente, tipi di UTENTI */
const USER_TYPES = {
    Admin: 'Admin',
    Client: 'Client',
    User: 'User',
}

function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    /*Costanti per la gestione del popup*/
    const [popupActivated, setPopupActivated] = useState(false);
    const [nomeUtente, setNomeUtente] = useState("");

    /*Status nel local storage di wishlist e carrello*/
    const [statusWishlist, setStatusWishlist] = useState({});
    const [statusCarrello, setStatusCarrello] = useState({});
    const [sommaProdottiNellaWishlist, setSommaProdottiNellaWishlist] = useState(0);
    const [sommaProdottiNelCarrello, setSommaProdottiNelCarrello] = useState(0);

    
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
                setNomeUtente(DocumentoUtente.data().nome);

                /*Ottengo la wishlist dell'utente dal localstorage*/
                /*const statusWishlist = localStorage.getItem(`${userUID}_statusWishlist`);
                if(statusWishlist){
                    setStatusWishlist(JSON.parse(statusWishlist));
                }
                else{
                    setStatusWishlist({});
                }*/

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

    /* Cambio la somma dei prodotti nella wishlist utente nella UI! */
    useEffect(() => {
        const calcoloProdottiNellaWishlist = () => {
            const userUID = auth.currentUser.uid;
            const statusWishlist = localStorage.getItem(`${userUID}_statusWishlist`);
            if(statusWishlist){
                const wishlist = JSON.parse(statusWishlist);
                let quantitaTotale = 0;
                for(const prodottoID in wishlist){
                    if(wishlist.hasOwnProperty(prodottoID)){
                        quantitaTotale += wishlist[prodottoID].quantita;
                    }
                }
                setSommaProdottiNellaWishlist(quantitaTotale);
            }
            else{
                setSommaProdottiNellaWishlist(0);
            }
        };
    
        if(auth.currentUser){
            calcoloProdottiNellaWishlist();
        }
    
    }, [auth.currentUser !== null && localStorage.getItem(`${auth.currentUser?.uid}_statusWishlist`)]);
        /*Richiamo la funzione ogni volta che il local storage viene aggiornato*/
        /* Alla fine non serve!
        const storageChangeHandler = () => {
            calcoloProdottiNellaWishlist();
        };
    
        window.addEventListener('storage', storageChangeHandler);
    
        return () => {
            window.removeEventListener('storage', storageChangeHandler);
        };*/


    /* Cambio la somma dei prodotti nel carrello utente nella UI! */
    useEffect(() => {
        const calcoloProdottiNelCarrello = () => {
            const userUID = auth.currentUser.uid;
            const statusCarrello = localStorage.getItem(`${userUID}_statusCarrello`);
            if(statusCarrello){
                const carrello = JSON.parse(statusCarrello);
                let quantitaTotale = 0;
                for(const prodottoID in carrello){
                    if(carrello.hasOwnProperty(prodottoID)){
                        quantitaTotale += carrello[prodottoID].quantita;
                    }
                }
                setSommaProdottiNelCarrello(quantitaTotale);
            }
            else{
                setSommaProdottiNelCarrello(0);
            }
        };
    
        if(auth.currentUser){
            calcoloProdottiNelCarrello();
        }

    }, [auth.currentUser !== null && localStorage.getItem(`${auth.currentUser?.uid}_statusCarrello`)])




    /* ----- GESTIONE POPUP ----- */
    /*Ovunque io sia, quando compare il popup di logout io voglio evitare che l'utente possa scrollare*/
    useEffect(() => {
        const elementIds = [
            'homepage',
            'catalogo',
            'pagina-prodotto',
            'esplora-trend',
            'assistenzaclientipage',
            'aboutpage',
            'dashboardpage'
        ];
    
        if (popupActivated) {
            document.body.style.overflow = 'hidden';
            elementIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.style.overflow = 'hidden';
                }
            });
        } else {
            document.body.style.overflow = 'auto';
            elementIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.style.overflow = 'auto';
                }
            });
        }
    }, [popupActivated]);


    /*Funzione per l'apertura del popup*/
    const apriPopup = async(e) => {
        setPopupActivated(true);
    }

    /*Funzione per chiusura del popup*/
    const chiudiPopup = async(e, scelta) => {
        if(scelta === "esci"){
            setPopupActivated(false);
            handleLogout(e);
        }
        else if(scelta === "rimani"){
            setPopupActivated(false);
        }
        setDropdownVisible(false);
    }

    /*Funzione per quando devo fare il logout*/
    const handleLogout = async(e) => {
        signOut(auth).then(() => {
            navigate("/");
            setCurrentUserType(USER_TYPES.User);
        }).catch((error) => {
            console.log("user is logged out");
        });
    };


    /* ----- HOOKS E FUNZIONI PER LA GESTIONE DELL'HEADER ----- */
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
       const scrollDuration = 300; //ms
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

       return () => {
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
                        { (currentUserType !== USER_TYPES.User) && (<li className={`user-tool-content profile ${location.pathname.startsWith("/Profilo") ? "active" : ""}`}>
                                <div className="link" ref={dropdownRef} onClick={handleDropdownProfilo}>
                                    <div className="icon-user-tool">
                                        <FaUserCircle />
                                    </div>
                                    <span>Profilo</span>
                                </div>
                                {isDropdownVisibile && (
                                    <div className="dropdown-profilo">
                                        <ul>
                                            <Link to="/Profilo">
                                                <li className=" li-logout exclude-from-color">Il tuo profilo</li>
                                            </Link>
                                            <hr/>
                                            <li className="li-logout" onClick={(e) => apriPopup(e)}>Logout</li>
                                        </ul>
                                    </div>
                                )}
                            </li>
                        )}
                        { (currentUserType !== USER_TYPES.User) && <li className={`user-tool-content ${location.pathname === "/Wishlist" ? "active" : ""}`}>
                            <Link to="/Wishlist">
                                <div className="numero-prodotti-wishlist">
                                <p>{sommaProdottiNellaWishlist}</p>
                                </div>
                                <div className="link">
                                    <div className="icon-user-tool">
                                        <FaRegHeart />
                                    </div>
                                    <span>Wishlist</span>
                                </div>
                            </Link></li> 
                        }
                        { (currentUserType !== USER_TYPES.User) && <li className={`user-tool-content ${location.pathname.startsWith("/Carrello") ? "active" : ""}`}>
                            <Link to="/Carrello">
                                <div className="numero-prodotti-carrello">
                                    <p>{sommaProdottiNelCarrello}</p>
                                </div>
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
                        <li className={`navbar-link ${location.pathname.startsWith("/CatalogoProdotti") ? "active" : ""}`}><Link to="/CatalogoProdotti" onClick={scrollToTop}>Catalogo prodotti</Link></li>
                        <li className={`navbar-link ${location.pathname === "/EsploraTrend" ? "active" : ""}`}><Link to="/EsploraTrend" onClick={scrollToTop}>Esplora i trend</Link></li>
                        <li className={`navbar-link ${location.pathname === "/ChiSiamo" ? "active" : ""}`}><Link to="/ChiSiamo" onClick={scrollToTop}>Chi siamo</Link></li>
                        <li className={`navbar-link ${location.pathname === "/AssistenzaClienti" ? "active" : ""}`}><Link to="/AssistenzaClienti" onClick={scrollToTop}>Assistenza clienti</Link></li>
                        { (currentUserType === USER_TYPES.Admin) && <li className={`navbar-link dashboard ${location.pathname === "/Dashboard" ? "active" : ""}`}><Link to="/Dashboard" onClick={scrollToTop}>Dashboard</Link></li> }
                    </ul>
                    { (currentUserType !== USER_TYPES.Admin) && (
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
                                <li className={`navbar-link ${location.pathname.startsWith("/CatalogoProdotti") ? "active" : ""}`}><Link to="/CatalogoProdotti" onClick={scrollToTop}>Catalogo prodotti</Link></li>
                                <li className={`navbar-link ${location.pathname === "/EsploraTrend" ? "active" : ""}`}><Link to="/EsploraTrend" onClick={scrollToTop}>Esplora i trend</Link></li>
                                <li className={`navbar-link ${location.pathname === "/ChiSiamo" ? "active" : ""}`}><Link to="/ChiSiamo" onClick={scrollToTop}>Chi siamo</Link></li>
                                <li className={`navbar-link ${location.pathname === "/AssistenzaClienti" ? "active" : ""}`}><Link to="/AssistenzaClienti" onClick={scrollToTop}>Assistenza clienti</Link></li>
                                { (currentUserType === USER_TYPES.Admin) && <li className={`navbar-link scroll-dashboard ${location.pathname === "/Dashboard" ? "active" : ""}`}><Link to="/Dashboard" onClick={scrollToTop}>Dashboard</Link></li> }
                            </ul>
                            {(currentUserType !== USER_TYPES.Admin) && <SearchBar/>} 
                        </div>      
                    </nav>
                </header>
            )}
            
            {/*Messaggio popup*/}
            { popupActivated && <>
                <div className="popup popuplogout">
                    <h2><span className="popup-nomeutente">{nomeUtente}</span>, sicuro di voler fare logout?</h2>
                    <div className="btn">
                        <button className="popuplogout-rimani" onClick={(e) => chiudiPopup(e, "rimani")}>No, rimani</button>
                        <button className="popuplogout-esci" onClick={(e) => chiudiPopup(e, "esci")}>Sì, logout!</button>
                    </div>
                </div>
                <div id="overlay"></div>
            </>}
        </>
    )
}

export default Header;