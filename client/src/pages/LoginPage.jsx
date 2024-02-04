import React, { useState, useEffect }  from "react"
import { Link, useNavigate } from 'react-router-dom'
import { auth, googleAuthProvider } from "../database/firebase"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { doc, getDoc, setDoc, collection, getFirestore } from "firebase/firestore"
import db from "../database/firebase"
import axios from "axios"
import logo from '../assets/images/Lucciola.png'
import google from '../assets/images/google.png'
import HomeFloatingButton from "../components/HomeFloatingButton"
//import { loginEseguito } from "../components/HeaderComponent.jsx" //importo la funzione dall'header in modo da richiamarla
import "../styles/Login.css"

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

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
                /*const ruoloUtente = DocumentoUtente.data().ruolo;
                console.log("ruolo utente: ", ruoloUtente);*/
                navigate("/");
                /*Passo il ruolo all'header, in modo da cambiare la schermata in base al ruolo e trasferirmi nella home*/
                //loginEseguito(navigate, ruoloUtente, setCurrentUserType);
                //handleLogin(navigate, ruoloUtente);
            }
            else{
                console.log("L'utente non esiste! Devi registrarti!");
            }

        } catch (error){
            console.log(error);
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

            if(!DocumentoUtente.exists()){
                await setDoc(RiferimentoDocumentoUtente, {cognome: cognomeUtente, nome: nomeUtente, ruolo: 'Client'});
            }
            navigate("/");
        } catch(error){ /*Utente Google non ha mai fatto il primo accesso. Inseriamolo.*/
            console.log(error);
        }
    }


    return(
        <div id="full-page-login">
            <div id="login">
                <h2>Accedi!</h2>
                <p className="link-to-signup">Non hai ancora un account? <Link to="/Signup"><span className="crea-account">Crea un nuovo account</span></Link></p>
                <form className="login-form" method="POST">
                    <div className="email-input">
                        <label htmlFor="email" className="label">Email</label>
                        <input type="email" className="input-form" placeholder="Email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className="password-input">
                        <label htmlFor="password" className="label">Password</label>
                        <input type="password" className="input-form" placeholder="Password" name="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    <input type="checkbox" id="myCheckbox" name="myCheckbox"></input>
                    <label htmlFor="myCheckbox" className="checkbox-label">Ricordami</label>
                    <Link to="/Login"><span className="password-dimenticata">Password dimenticata?</span></Link>
                    <button className="button-login" onClick={(e) => Accedi(e)}><span>Login</span></button>
                    
                    <span className="alternative">Oppure</span>

                    <div className="google-login" onClick={(e) => AccediConGoogle(e)}>
                        <div className="logo-google-login">
                            <img className="logo-google" src={google}></img>
                        </div>
                        <div className="span-google-login">
                            <span>Accedi con Google</span>
                        </div>
                    </div>
                </form>
            </div>
            <Link to="/">
                <HomeFloatingButton/>
            </Link>
        </div>
    )
}

export default Login;