import React, { useState, useEffect }  from "react"
import { Link, useNavigate } from 'react-router-dom'
import { auth, googleAuthProvider } from "../database/firebase"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { doc, getDoc, getDocs, setDoc, collection, query, where, getFirestore, addDoc } from "firebase/firestore"
import db from "../database/firebase"
import google from '../assets/images/google.png'
import HomeFloatingButton from "../components/HomeFloatingButton"
import error from "../assets/images/error.webp"
import spuntaverde from "../assets/images/spuntaverde.png"
import "../styles/Login.css"
import "../styles/Popup.css"

function Login() {
    const navigate = useNavigate();

    /*Costanti per il form di login */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    /*Costanti per la gestione del popup*/
    const [popupActivated, setPopupActivated] = useState(false);
    const [nomeUtente, setNomeUtente] = useState("");
    const [tipoPopup, setTipoPopup] = useState(""); //tipoPopup = successo/errore
    const [messaggiErrore, setMessaggiErrore] = useState([]);


    /*Funzione per il controllo degli errori*/
    const controlloCredenziali = async(e) => {
        const pattern=/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        const aggiungiMessaggiErrore = [];

        if(email === "" || password === ""){
            console.log("Alcuni campi sono stati lasciati vuoti");
            aggiungiMessaggiErrore.push("Alcuni campi sono stati lasciati vuoti");
            setTipoPopup("errore");
        }
        if(!email.match(pattern)){
            console.log("Formato dell'email errato");
            aggiungiMessaggiErrore.push("Formato dell'email errato");
            setTipoPopup("errore");
        }
        if (password.length < 6) {
            console.log("La password deve contenere almeno 6 caratteri");
            aggiungiMessaggiErrore.push("La password deve contenere almeno 6 caratteri");
            setTipoPopup("errore");
        }

        setMessaggiErrore([...messaggiErrore, ...aggiungiMessaggiErrore]);
        setPopupActivated(true);
        Accedi(e);
    };

    const Accedi = async(e) => {
        e.preventDefault();
        try {
            /*Controllo e ottengo l'utente loggato in Firebase Authentication*/
            const CredenzialiUtente = await signInWithEmailAndPassword(auth, email, password);

            /*Recupero e ottengo le informazioni (il ruolo) dell'utente da Firestore Database*/
            const userUID = CredenzialiUtente.user.uid;
            console.log("userUID: ", userUID);
            const RiferimentoDocumentoUtente = await doc(db, 'Utenti', userUID);
            const DocumentoUtente = await getDoc(RiferimentoDocumentoUtente);

            if(DocumentoUtente.exists()){
                setNomeUtente(DocumentoUtente.data().nome);
                setTipoPopup("successo");
                setPopupActivated(true);
            }
        } catch (error){
            console.log("L'utente non esiste!");
        }
    }

    const AccediConGoogle = async(e) => {
        e.preventDefault();
        try{
            const CredenzialiUtente = await signInWithPopup(auth, googleAuthProvider);
            const userUID = CredenzialiUtente.user.uid;

            const RiferimentoDocumentoUtente = await doc(db, 'Utenti', userUID);
            const DocumentoUtente = await getDoc(RiferimentoDocumentoUtente);
            const [nomeUtente, cognomeUtente] = CredenzialiUtente.user.displayName.split(' '); //Recupero nome e cognome 
            
            /*Controllo se l'utente si sta registrando per la prima volta, se sì creo un nuovo documento Utente*/
            if(!DocumentoUtente.exists()){
                await setDoc(RiferimentoDocumentoUtente, {
                    cognome: cognomeUtente, 
                    nome: nomeUtente,
                    numeroTelefono: "0000000000",
                    ruolo: "Client",
                    Nazione: "",
                    Provincia: "",
                    IndirizzoResidenza: "",
                    NumeroCivico: "",
                    CAP: "00000",
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
            setNomeUtente(nomeUtente);
            setTipoPopup("successo");
            setPopupActivated(true);
        } catch(error){ /*Utente Google non ha mai fatto il primo accesso. Inseriamolo.*/
            console.log(error);
            console.log("login con google, non creato");
        }
    }

    /*Funzione per chiusura del popup*/
    const chiudiPopup = (e) => {
        navigate("/");
        setTipoPopup("");
        setMessaggiErrore([]);
        setPopupActivated(false);
    }

    /*Funzione per chiusura del popup in caso di errore*/
    const continuaPopup = (e) => {
        setTipoPopup("");
        setMessaggiErrore([]);
        setPopupActivated(false);
    }



    return(
        <div id="full-page-login">
            <div id="login">
                <h2>Accedi!</h2>
                <p className="link-to-signup">Non hai ancora un account? <Link to="/Signup"><span className="crea-account">Crea un nuovo account</span></Link></p>
                <form className="login-form" method="POST">
                    <div className="email-input">
                        <label htmlFor="email" className="label">Email</label>
                        <input type="email" className="input-form" placeholder="Email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="password-input">
                        <label htmlFor="password" className="label">Password</label>
                        <input type="password" className="input-form" placeholder="Password" name="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <input type="checkbox" id="myCheckbox" name="myCheckbox"></input>
                    <label htmlFor="myCheckbox" className="checkbox-label">Ricordami</label>
                    <Link to="/Login"><span className="password-dimenticata">Password dimenticata?</span></Link>
                    <button className="button-login" onClick={(e) => controlloCredenziali(e)}><span>Login</span></button>

                    <p className="alternative">Oppure</p>

                    <div className="google-login" onClick={(e) => AccediConGoogle(e)}>
                        <div className="logo-google-login">
                            <img className="logo-google" src={google}></img>
                        </div>
                        <div className="span-google-login">
                            <span className="google-login-btn">Accedi con Google</span>
                        </div>
                    </div>
                </form>
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
                        <div className="popup popuploginpage">
                            <h2>Ciao, <span className="popup-nomeutente">{nomeUtente}</span>!</h2>
                            <p>Lumia ti stava aspettando, ci sono moltissime novità!<br/>Login effettuato con successo.</p>
                            <img className="popup-spunta-positiva" src={spuntaverde} alt="conferma login"/>
                            <button className="chiudi_popup" type="button" aria-expanded="false" onClick={(e) => chiudiPopup(e)}>Vai alla home!</button>
                        </div>
                        <div id="overlay"></div>
                    </>
                }
                {
                    (tipoPopup === "errore") && 
                    <>
                        <div className="popup popuploginpage-error">
                            <h2>Errore nel login:</h2>
                            <img className="popup-croce-negativa" src={error} alt="conferma login"/>
                            <ul>
                                {messaggiErrore.map((messaggio, index) => (
                                    <li key={index}>{messaggio}</li>
                                ))}
                            </ul>
                            <button className="modifica-login-btn" type="button" aria-expanded="false" onClick={(e) => continuaPopup(e)}>Modifica</button>
                        </div>
                        <div id="overlay"></div>
                    </>
                }
                </>
            }
        </div>
    )
}

export default Login;