import React, { useState, useEffect, useRef } from "react"
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { auth } from "../../database/firebase"
import { doc, getDoc, getDocs, setDoc, collection, query, where, getFirestore, addDoc } from "firebase/firestore"
import db from "../../database/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import "../../styles/Dashboard/GestioneUtenti.css"


function GestioneUtenti(){
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if(user) {
              const userUID = user.uid;
              const RiferimentoDocumentoUtente = await doc(db, 'Utenti', userUID);
              const DocumentoUtente = await getDoc(RiferimentoDocumentoUtente);

              if(DocumentoUtente.exists()){
                const ruoloUtente = DocumentoUtente.data().ruolo;
                if(ruoloUtente==="User"){
                    navigate("/Login");
                }
              }
              else{
                console.log("L'utente che prova ad accedere in Profile non esiste");
                navigate("/Login");
              }
            }
            else {
                /*Tentativo di accesso da parte di un utente non autenticato*/
                console.log("L'utente che prova ad accedere in Profile non è autenticato");
                navigate("/Login");
            }
        });
    }, []);

    return(
      <div id="pagina-gestione-utenti">
        <div className="gestione-utenti-title-container">
          <p className="gestione-utenti-title">GESTIONE UTENTI</p>
        </div>
        <div className="container-gestione">

          {/*AGGIORNA RUOLO - FORM PER AGGIORNARE IL RUOLO DI UN UTENTE*/}
          <form className="form-gestione-utenti aggiorna-ruolo" method="POST">
            <span className="titolo-form">Cambia ruolo</span>
            <div className="email-aggiorna-ruolo">
                <label className="label-dashpage">Scrivi l'email dell'utente: </label>
                <input type="email" className="dashboard-input-form" placeholder="Email" autoComplete="email" onChange={null}/>
            </div>
            <div className="ruolo-aggiorna-ruolo">
              <label className="label-dashpage">Scegli il ruolo: </label>
              <select className="select-aggiorna-ruolo" name="userType" defaultValue="User">
                  <option value="Admin">Admin</option>
                  <option value="Employee">Employee</option>
                  <option value="Client">Client</option>
                  <option value="User">User</option>
              </select>
            </div>
            <div className="divisore-aggiorna-ruolo"/>
            <button className="submit-gestione-utenti">Aggiorna ruolo</button>
          </form>
        </div>
      </div>
    )
}

export default GestioneUtenti;