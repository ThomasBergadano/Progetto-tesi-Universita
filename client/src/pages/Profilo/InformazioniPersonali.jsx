import React, { useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { auth } from "../../database/firebase"
import { doc, getDoc } from "firebase/firestore"
import db from "../../database/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import "../../styles/Profilo/InformazioniPersonali.css"

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
            <p className="page-info-title">INFORMAZIONI PERSONALI</p>
            <div className="container-informazioni">
                <div className="informazioni-gruppo1">
                    <div className="informazione-personale">
                        <div className="informazione-specifica">
                            <p>Nome:</p>
                        </div>
                        <div className="informazione-contenuto">
                            <p>Thomas Bergadano</p>
                        </div>
                    </div>
                    <div className="informazione-personale">
                        <div className="informazione-specifica">
                            <p>Email:</p>
                        </div>
                        <div className="informazione-contenuto">
                            <p>bthomasb2001@gmail.com</p>
                        </div>
                    </div>
                    <div className="informazione-personale">
                        <div className="informazione-specifica">
                            <p>Telefono:</p>
                        </div>
                        <div className="informazione-contenuto">
                            <p>022 222 1111</p>
                        </div>
                    </div>
                </div>
                <div className="informazioni-gruppo2">
                    <div className="informazione-personale">
                        <div className="informazione-specifica">
                            <p>Nazione:</p>
                        </div>
                        <div className="informazione-contenuto">
                            <p>Italia</p>
                        </div>
                    </div>
                    <div className="informazione-personale">
                        <div className="informazione-specifica">
                            <p>Città:</p>
                        </div>
                        <div className="informazione-contenuto">
                            <p>Torino</p>
                        </div>
                    </div>
                    <div className="informazione-personale">
                        <div className="informazione-specifica">
                            <p>Provincia:</p>
                        </div>
                        <div className="informazione-contenuto">
                            <p>Moncalieri</p>
                        </div>
                    </div>
                    <div className="informazione-personale">
                        <div className="informazione-specifica">
                            <p>CAP:</p>
                        </div>
                        <div className="informazione-contenuto">
                            <p>23931</p>
                        </div>
                    </div>
                    <div className="informazione-personale">
                        <div className="informazione-specifica">
                            <p>Indirizzo:</p>
                        </div>
                        <div className="informazione-contenuto">
                            <p>Via Calvino 23</p>
                        </div>
                    </div>
                </div>
                <div className="modifica-informazioni-personali">
                    <button className="btn-modifica-informazioni-personali">Modifica</button>
                </div>
            </div>
        </div>
    )
}

export default InformazioniPersonali;