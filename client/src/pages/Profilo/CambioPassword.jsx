import React, { useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { auth } from "../../database/firebase"
import { doc, getDoc } from "firebase/firestore"
import db from "../../database/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import "../../styles/Profilo/CambioPassword.css"


function CambioPassword(){
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
        <div id="pagina-cambio-password">
            <p className="page-info-title">CAMBIO PASSWORD</p>
            <form className="form-cambio-password" method="POST">
                <div className="cambio-password-attuale">
                    <label className="label-cambiopassword">Password attuale: </label>
                    <input type="text" className="cambio-input-form" placeholder="Set prodotto" autoComplete="Set prodotto" onChange={(e) => setNomeSet(e.target.value)} required/>
                </div>
                <div className="cambio-password-nuova">
                    <label className="label-cambiopassword">Nuova password: </label>
                    <input type="text" className="cambio-input-form" placeholder="Set prodotto" autoComplete="Set prodotto" onChange={(e) => setNomeSet(e.target.value)} required/>
                </div>
                <div className="cambio-password-verifica">
                    <label className="label-cambiopassword">Verifica nuova password: </label>
                    <input type="text" className="cambio-input-form" placeholder="Set prodotto" autoComplete="Set prodotto" onChange={(e) => setNomeSet(e.target.value)} required/>
                </div>
                <button className="submit-cambio-password">Cambia password</button>
            </form>
        </div>
    )
}

export default CambioPassword;