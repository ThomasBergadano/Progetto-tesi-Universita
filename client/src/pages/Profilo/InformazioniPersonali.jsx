import React, { useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { auth } from "../../database/firebase"
import { doc, getDoc } from "firebase/firestore"
import db from "../../database/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"

function InformazioniPersonali(){
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
        <div id="pagina-informazioni-personali">
            <p>Sono dentro Informazioni Personali</p>
        </div>
    )
}

export default InformazioniPersonali;