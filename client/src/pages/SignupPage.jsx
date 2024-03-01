import React, { useState, useEffect }  from "react"
import { Link, useNavigate } from 'react-router-dom'
import { auth } from "../database/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc, getDocs, setDoc, collection, query, where, addDoc } from "firebase/firestore"
import db from "../database/firebase"
import HomeFloatingButton from "../components/HomeFloatingButton"
import "../styles/Signup.css"
import piantacadente from "../assets/images/pianta-cadente2.png"

function Signup() {
    const [cognomeUtente, setCognome] = useState("");
    const [nomeUtente, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [numeroTelefonoUtente, setTelefono] = useState("");
    const navigate = useNavigate();

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
            });

            /*Creo poi un documento all'interno della raccolta wishlist per tale utente*/
            const RiferimentoRaccoltaGestione = collection(db, "Gestione");
            const queryGetWishlist = query(RiferimentoRaccoltaGestione, where("TipoGestione", "==", "Wishlist"));
            const snapshotGestione = await getDocs(queryGetWishlist);

            const gestioneDoc = snapshotGestione.docs[0]; //documento della gestione contenente la wishlist
            const RiferimentoRaccoltaWishlist = collection(gestioneDoc.ref, "Wishlist");
            const wishlistDoc = await addDoc(RiferimentoRaccoltaWishlist,{
                ElencoProdotti: [],
                IDUtente: userUID,
            });

            navigate("/Login");
        }
        catch(error){
            console.log(error);
        }

    }
    
    return(
        <div id="full-page">
            <div id="signup">
                <img src={piantacadente} alt="pianta-cadente"></img>
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
                            <input type="password" className="half-form" placeholder="Ripeti password" name="ripeti-password" autoComplete="new-password" required/>
                        </div>
                    </div>
                    <div className="phone-number-input">
                        <label htmlFor="phone" className="label">Numero di telefono</label>
                        <input type="tel" className="half-form" placeholder="000 000 0000" name="phone" onChange={(e) => setTelefono(e.target.value)} required/>
                    </div>
                </form>
                <button className="button-signup" onClick={(e) => Registrati(e)}><span className="button-text">Registrati</span></button>           
            </div>
            <Link to="/">
                <HomeFloatingButton/>
            </Link>
        </div>
    )
}

export default Signup;