import React, { useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { auth } from "../database/firebase"
import { doc, getDoc } from "firebase/firestore"
import db from "../database/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import "../styles/DashboardPage.css"

function Dashboard() {
    const navigate = useNavigate();

    /*Gestione autorizzazone e permessi per accesso in /Dashboard*/
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if(user) {
              const userUID = user.uid;
              const RiferimentoDocumentoUtente = await doc(db, 'Utenti', userUID);
              const DocumentoUtente = await getDoc(RiferimentoDocumentoUtente);
              
              if(DocumentoUtente.exists()){
                const ruoloUtente = DocumentoUtente.data().ruolo;
                if(ruoloUtente!=="Admin"){
                    navigate("/");
                }
              }
              else{
                console.log("L'utente che prova ad accedere in Dashboard non esiste");
                navigate("/");
              }
            }
            else {
                console.log("L'utente che prova ad accedere in Dashboard non è autenticato");
                navigate("/");
            }
        });
    }, []);

    return(
        <div id="dashboardpage">
            <div id="gestione-utenti">
                <label type="text" className="label-gestione">GESTIONE UTENTI</label>
                <form className="form-gestione aggiorna-ruolo" method="POST">
                    <span className="titolo-form">Cambia ruolo</span>
                    <div className="email-aggiorna-ruolo">
                        <label htmlFor="email" className="label-dashpage">Scrivi l'email dell'utente: </label>
                        <input type="email" className="input-form" placeholder="Email" autoComplete="email" onChange={null}/>
                    </div>
                    <div className="ruolo-aggiorna-ruolo">
                        <label htmlFor="email" className="label-dashpage">Scegli il ruolo: </label>
                        <select className="select-aggiorna-ruolo" name="userType" defaultValue="User">
                            <option value="Admin">Admin</option>
                            <option value="Employee">Employee</option>
                            <option value="Client">Client</option>
                            <option value="User">User</option>
                        </select>
                    </div>
                    <div className="divisore-gestione"/>
                    <button className="submit-dashboard sub-1">Aggiorna ruolo</button>
                </form>
            </div>
            <div id="gestione-prodotti">
                <label type="text" className="label-gestione">GESTIONE PRODOTTI</label>
                <form className="form-gestione separate">
                    <span className="titolo-form">Inserisci prodotto</span>
                    <div className="email-aggiorna-ruolo">
                        <label htmlFor="email" className="label-dashpage">Scrivi l'email dell'utente: </label>
                        <input type="email" className="input-form" placeholder="Email" autoComplete="email" onChange={null}/>
                    </div>
                    <div className="ruolo-aggiorna-ruolo">
                        <label htmlFor="email" className="label-dashpage">Scegli il ruolo: </label>
                        <select className="select-aggiorna-ruolo" name="userType" defaultValue="User">
                            <option value="Admin">Admin</option>
                            <option value="Employee">Employee</option>
                            <option value="Client">Client</option>
                            <option value="User">User</option>
                        </select>
                    </div>
                    <div className="divisore-gestione"/>
                    <button className="submit-dashboard sub-2">Inserisci prodotto</button>
                </form>
                <form className="form-gestione">
                    <span className="titolo-form">Elimina prodotto</span>
                    <div className="email-aggiorna-ruolo">
                        <label htmlFor="email" className="label-dashpage">Scrivi l'email dell'utente: </label>
                        <input type="email" className="input-form" placeholder="Email" autoComplete="email" onChange={null}/>
                    </div>
                    <div className="ruolo-aggiorna-ruolo">
                        <label htmlFor="email" className="label-dashpage">Scegli il ruolo: </label>
                        <select className="select-aggiorna-ruolo" name="userType" defaultValue="User">
                            <option value="Admin">Admin</option>
                            <option value="Employee">Employee</option>
                            <option value="Client">Client</option>
                            <option value="User">User</option>
                        </select>
                    </div>
                    <div className="divisore-gestione"/>
                    <button className="submit-dashboard sub-3">Elimina prodotto</button>
                </form>
            </div>
        </div>
    )
}

export default Dashboard;