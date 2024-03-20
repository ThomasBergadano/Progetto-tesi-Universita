import React, { useState, useEffect, useRef }  from "react"
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { doc, getDoc, getDocs, setDoc, collection, query, where, getFirestore, addDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { auth } from "../../database/firebase"
import db from "../../database/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import soggiorno from '../../assets/images/soggiorno.jpg'
import emptyhistory from "../../assets/images/empty-history.png"
import "../../styles/Profilo/CronologiaOrdini.css"


function CronologiaOrdini(){
    const navigate = useNavigate();
    
    /*Informazioni dell'utente*/
    const [oggettoUtente, setOggettoUtente] = useState("");
    const [emailDB, setEmailUtente] = useState("");

    /*Array di oggetti con gli acquisti dell'utente*/
    const [arrayAcquisti, setArrayAcquisti] = useState([]);

    useEffect(() => {
        /*Recupero informazioni sull'utente*/
        onAuthStateChanged(auth, async (user) => {
            if(user){
                const userUID = user.uid;
                const RiferimentoDocumentoUtente = doc(db, 'Utenti', userUID);
                const DocumentoUtente = await getDoc(RiferimentoDocumentoUtente);
    
                if(DocumentoUtente.exists()){
                    setOggettoUtente(DocumentoUtente.data());
                }
                else{
                    navigate("/Login");
                }
                uploadAcquisti(userUID);
            } else {
                navigate("/Login");
            }
        });


        /*Caricamento degli acquisti dal db*/
        const uploadAcquisti = async(idUtente) => {
            const arrayAcquisti = [];

            const RiferimentoRaccoltaGestione = collection(db, 'Gestione');
            const queryGetGestione = query(RiferimentoRaccoltaGestione, where('TipoGestione', '==', 'Acquisti'));
            const shapshotGestione = await getDocs(queryGetGestione);

            for(const gestioneDoc of shapshotGestione.docs){
                const RiferimentoRaccoltaAcquisti = collection(gestioneDoc.ref, "Acquisti");
                const queryGetUserAcquisti = query(RiferimentoRaccoltaAcquisti, where('IDUtente', '==', idUtente));
                const shapshotAcquisti = await getDocs(queryGetUserAcquisti);

                for(const acquistoDoc of shapshotAcquisti.docs){
                    const datiAcquisto = acquistoDoc.data();
                    const acquistoConId = { id: acquistoDoc.id, ...datiAcquisto}
                    arrayAcquisti.push(acquistoConId);
                }
            }
            setArrayAcquisti(arrayAcquisti);
        }

    }, []);


    return(
        <div id="pagina-cronologia-ordini">
            <p className="page-info-title">CRONOLOGIA ORDINI</p>
            {arrayAcquisti.length === 0 && (
                <div className="emptyhistory">
                    <img src={emptyhistory}></img>
                    <p>La tua cronologia degli ordini è vuota!</p>
                    <button className="btn-emptyhistory">Inizia con gli acquisti</button>
                </div>
            )}
            {arrayAcquisti.length !== 0 && arrayAcquisti.map((acquisto, index) => (
                <div className="notemptyhistory">
                    <div className="singolo-acquisto" key={index}>
                        <div className="immagine-prodotto-history">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="barra-verticale-history"/>
                        <div className="history">
                            <div className="history-informazione">
                                <div className="dataid-history">
                                    <p>Data ordine: {acquisto.DataOrdine}</p>
                                    <p>Orario: {acquisto.OrarioOrdine}</p>
                                    <p>ID ordine: {acquisto.id}</p>
                                </div>
                                <div className="prezzostatus-history">
                                    <p>Indirizzo: {acquisto.IndirizzoDestinazione} {acquisto.NumeroCivicoDestinazione}</p>
                                    <p>Totale: {acquisto.Totale}€</p>
                                    <p>Status: Consegnato</p>
                                </div>
                            </div>
                            <div className="history-ricevuta">
                                <button className="btn-history-ricevuta">Stampa la ricevuta in PDF</button>
                                <button className="btn-history-feedback">Scrivici un feedback</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CronologiaOrdini;