import React, { useState, useEffect }  from "react"
import { Link, useNavigate } from 'react-router-dom'
import { auth } from "../database/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc, getDocs, setDoc, collection, query, where, addDoc } from "firebase/firestore"
import db from "../database/firebase"
import HomeFloatingButton from "../components/HomeFloatingButton"
import piantacadente from "../assets/images/pianta-cadente2.png"
import error from "../assets/images/error.webp"
import spuntaverde from "../assets/images/spuntaverde.png"
import "../styles/Signup.css"



function Signup() {
    const navigate = useNavigate();

    /*Costanti utili per il signup*/
    const [cognomeUtente, setCognome] = useState("");
    const [nomeUtente, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ripetiPassword, setRipetiPassword] = useState("");
    const [numeroTelefonoUtente, setTelefono] = useState("");

    /*Costanti per la gestione del popup*/
    const [popupActivated, setPopupActivated] = useState(false);
    const [tipoPopup, setTipoPopup] = useState(""); //tipoPopup = successo/errore
    const [messaggiErrore, setMessaggiErrore] = useState([]);


    /*Funzione per il controllo degli errori*/
    const controlloCredenziali = async(e) => {
        const aggiungiMessaggiErrore = [];
        const pattern=/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        const onlyLetters = /^[a-zA-Z]+$/;

        if(cognomeUtente === "" || nomeUtente === "" || email === "" || password === "" || ripetiPassword === "" || numeroTelefonoUtente === ""){
            aggiungiMessaggiErrore.push("Alcuni campi sono stati lasciati vuoti");
            setTipoPopup("errore");
        }
        else{
            if(password !== ripetiPassword){
                aggiungiMessaggiErrore.push("Le due password non corrispondono");
                setTipoPopup("errore");
            }
            if(nomeUtente.length < 3 || !nomeUtente.match(onlyLetters)){
                aggiungiMessaggiErrore.push("Il nome inserito non è valido");
                setTipoPopup("errore");
            }
            if(cognomeUtente.length < 3 || !cognomeUtente.match(onlyLetters)){
                aggiungiMessaggiErrore.push("Il cognome inserito non è valido");
                setTipoPopup("errore");     
            }
            if(!email.match(pattern)){
                aggiungiMessaggiErrore.push("Formato dell'email errato");
                setTipoPopup("errore");
            }
            if (password.length < 6){
                aggiungiMessaggiErrore.push("La password deve contenere almeno 6 caratteri");
                setTipoPopup("errore");
            }
            if(isNaN(numeroTelefonoUtente) || numeroTelefonoUtente.length < 10){
                aggiungiMessaggiErrore.push("Il numero di telefono deve contenere solo numeri ed avere 10 cifre");
                setTipoPopup("errore");
            }
            
        }
        setMessaggiErrore([...messaggiErrore, ...aggiungiMessaggiErrore]);
        setPopupActivated(true);
        Registrati(e);
    }

    const Registrati = async(e) => {
        e.preventDefault();

        /*Creo un utente in Firebase Authentication (solo email e password)*/
        try{
            const CredenzialiUtente = await createUserWithEmailAndPassword(auth, email, password);

            /*Creo ora un documento contenente le altre info sull'utente su Firestore Database*/
            const userUID = CredenzialiUtente.user.uid;
            const nuovoDocumentoUtente = doc(db, 'Utenti', userUID); //nuovoDocumentoUtente = documento utente
            setDoc(nuovoDocumentoUtente, {
                cognome: cognomeUtente,
                nome: nomeUtente,
                numeroTelefono: numeroTelefonoUtente,
                ruolo: "Client",
                Nazione: "",
                Provincia: "",
                IndirizzoResidenza: "",
                NumeroCivico: "",
                CAP: "",
            });

            /*Creo poi un documento all'interno della raccolta wishlist per tale utente*/
            const RiferimentoRaccoltaGestione = collection(db, "Gestione");
            const queryGetWishlist = query(RiferimentoRaccoltaGestione, where("TipoGestione", "==", "Wishlist"));
            let snapshotGestione = await getDocs(queryGetWishlist);

            let gestioneDoc = snapshotGestione.docs[0]; //documento della gestione contenente la wishlist
            const RiferimentoRaccoltaWishlist = collection(gestioneDoc.ref, "Wishlist");
            const wishlistDoc = await addDoc(RiferimentoRaccoltaWishlist,{
                ElencoProdotti: [],
                IDUtente: userUID,
            });

            /*Creo poi un documento all'interno della raccolta Carrello per tale utente*/
            const queryGetCarrello = query(RiferimentoRaccoltaGestione, where("TipoGestione", "==", "Carrello"));
            snapshotGestione = await getDocs(queryGetCarrello);
            gestioneDoc = snapshotGestione.docs[0];
            const RiferimentoRaccoltaCarrello = collection(gestioneDoc.ref, "Carrello");
            const carrelloDoc = await addDoc(RiferimentoRaccoltaCarrello,{
                IDUtente: userUID,
            });

            /*Dentro il documento "Carrello" appena creato, creo una nuova raccolta "CarrelloElencoProdotti"*/
            const RiferimentoRaccoltaCarrelloElencoProdotti = collection(carrelloDoc, "CarrelloElencoProdotti");
            const carrelloElencoProdottiDoc = await addDoc(RiferimentoRaccoltaCarrelloElencoProdotti,{
                IDProdotto: "",
                Quantita: 0,
            })
        }
        catch(error){
            console.log(error);
        }
        finally{
            setTipoPopup("successo");
            setPopupActivated(true);        
        }
    }

    /*Funzione per chiusura del popup*/
    const chiudiPopup = (e) => {
        navigate("/Login");
    }

    /*Funzione per chiusura del popup in caso di errore*/
    const continuaPopup = (e) => {
        setTipoPopup("");
        setMessaggiErrore([]);
        setPopupActivated(false);
    }

    
    return(
        <div id="full-page">
            <div id="signup">
                <img className="signup-img" src={piantacadente} alt="pianta-cadente"></img>
                <h2>Crea un account</h2>
                <p className="link-to-login">Hai già un account? <Link to="/Login"><span className="accedi">Accedi</span></Link></p>
                <form className="signup-form">
                    <div className="name-inputs">
                        <div className="first-name-input">
                            <label htmlFor="first-name" className="label">Nome</label>
                            <input type="text" className="half-form" placeholder="Nome" name="first-name" onChange={(e) => setNome(e.target.value)} required/>
                        </div>
                        <div className="last-name-input">
                            <label htmlFor="last-name">Cognome</label>
                            <input type="text" className="half-form" placeholder="Cognome" name="last-name" onChange={(e) => setCognome(e.target.value)} required/>
                        </div>
                    </div>
                    <div className="email-input">
                        <label htmlFor="email" className="label">Email</label>
                        <input type="email" className="full-form" placeholder="Email" name="email" autoComplete="email" onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className="passwords-section-input">
                        <div className="password-in">
                            <label htmlFor="password" className="label">Password</label>
                            <input type="password" className="half-form" placeholder="Password" name="password" autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        <div className="repeat-password-input">
                            <label htmlFor="repeat-password" className="label">Ripeti password</label>
                            <input type="password" className="half-form" placeholder="Ripeti password" name="ripeti-password" autoComplete="new-password" onChange={(e) => setRipetiPassword(e.target.value)} required/>
                        </div>
                    </div>
                    <div className="phone-number-input">
                        <label htmlFor="phone" className="label">Numero di telefono</label>
                        <input type="tel" className="half-form" placeholder="323 129 9408" name="phone" onChange={(e) => setTelefono(e.target.value)} required/>
                    </div>
                </form>
                <button className="button-signup" onClick={(e) => controlloCredenziali(e)}><span className="button-text">Registrati</span></button>           
            </div>
            <Link to="/">
                <HomeFloatingButton/>
            </Link>

            {/*Messaggio popup*/}
            { popupActivated && 
                <>
                {
                    (tipoPopup === "successo") && 
                    <>
                        <div className="popup popupsignuppage">
                            <h2>Benvenuto, <span className="popup-nomeutente">{nomeUtente}</span>!</h2>
                            <p>Registrazione effettuata! I tuoi dati sono stati inseriti<br/> con successo. Lumia ti da il benvenuto.</p>
                            <img className="popup-signup-img" src={spuntaverde} alt="conferma login"/>
                            <button className="popup-signup-btn" type="button" onClick={(e) => chiudiPopup(e)}>Vai in Login</button>
                        </div>
                        <div id="overlay"></div>
                    </>
                }
                {
                    (tipoPopup === "errore") && 
                    <>
                        <div className="popup popupsignuppage-error">
                            <h2>Errore nel login:</h2>
                            <img className="popup-croce-negativa" src={error} alt="conferma login"/>
                            <ul>
                                {messaggiErrore.map((messaggio, index) => (
                                    <li key={index}>{messaggio}</li>
                                ))}
                            </ul>
                            <button className="modifica-signup-btn" type="button" aria-expanded="false" onClick={(e) => continuaPopup(e)}>Modifica</button>
                        </div>
                        <div id="overlay"></div>
                    </>
                }
                </>
            }
        </div>
    )
}

export default Signup;