import React, { useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { auth } from "../database/firebase"
import { doc, getDoc } from "firebase/firestore"
import db from "../database/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"

function Dashboard() {
    const navigate = useNavigate();

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
        <div>
            <div id="assistenza-clienti">
                <p>Dashboard Page</p>
                <p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p>
            </div>
        </div>
    )
}

export default Dashboard;