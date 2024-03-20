import React, { useState, useEffect, useRef }  from "react"
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { doc, getDoc, getDocs, setDoc, collection, query, where, getFirestore, addDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { auth } from "../database/firebase"
import db from "../database/firebase"
import { onAuthStateChanged } from "firebase/auth"
import emptycart from "../assets/images/empty-cart.svg"
import { FaPlus } from "react-icons/fa"
import { FaMinus } from "react-icons/fa"
import soggiorno from '../assets/images/soggiorno.jpg'
import removeitem from '../assets/images/removeitem.png'
import GooglePay from "../assets/images/metodi-pagamento/GooglePay.png"
import MasterCard from "../assets/images/metodi-pagamento/MasterCard.png"
import PayPal from "../assets/images/metodi-pagamento/PayPal.png"
import visa from "../assets/images/metodi-pagamento/VISA.png"
import postepay from "../assets/images/metodi-pagamento/postepay.png"
import pp from "../assets/images/metodi-pagamento/pp.jpg"
import spuntaverde from "../assets/images/spuntaverde.png"
import error from "../assets/images/error.webp"
import "../styles/CheckoutPage.css"
import "../styles/Popup.css"
import suonoCarrello from "../assets/sounds/cash.mp3"


function Checkout() {
    const navigate = useNavigate();

    /*Costanti per l'ottenimento della data e dell'orario attuale.*/
    const dataAttuale = new Date();
    const day = String(dataAttuale.getDate()).padStart(2,'0');
    const month = String(dataAttuale.getMonth()+1).padStart(2,'0');
    const year = String(dataAttuale.getFullYear()).slice(2);
    const dataFormattata = `${day}/${month}/${year}`;

    const ora = String(dataAttuale.getHours()).padStart(2, '0');
    const minuti = String(dataAttuale.getMinutes()).padStart(2, '0');
    const oraFormattata = `${ora}:${minuti}`;

    /*Ottengo i parametri dallo stato della posizione corrente*/
    const location = useLocation();
    const prezzoTotale = location.state.prezzoTotale;

    /*Informazioni dell'utente*/
    const [oggettoUtente, setOggettoUtente] = useState("");

    /*Costanti per la gestione del popup*/
    const [popupActivated, setPopupActivated] = useState(false);
    const [tipoPopup, setTipoPopup] = useState(""); //tipoPopup = datiMancanti/richiestaConferma/AcquistoCompletato

    /*Costanti vari su prodotti e acquisti*/
    const [spedizioneFissa, setSpedizioneFissa] = useState("15.00");
    const [costoTotale, setCostoTotale] = useState(0.00);
    const [quantitaTotale, setQuantitaTotale] = useState(0);
    const [metodoPagamento, setMetodoPagamento] = useState("carta_di_credito");

    /*Audio per l'acquisto*/
    const audioAcquistoRef = useRef();


    useEffect(() => {
        /*Recupero informazioni sull'utente*/
        onAuthStateChanged(auth, async (user) => {
            if(user){
                const userUID = user.uid;
                const RiferimentoDocumentoUtente = await doc(db, 'Utenti', userUID);
                const DocumentoUtente = await getDoc(RiferimentoDocumentoUtente);

                if(DocumentoUtente.exists()){
                    setOggettoUtente(DocumentoUtente.data());
                }
                else{
                    navigate("/Login");
                }
            }
            else {
                navigate("/Login");
            }
        });
    }, []);

    useEffect(() => {
        /*Calcolo il costo totale dei prodotti*/
        const totale = parseFloat(prezzoTotale) + parseFloat(spedizioneFissa);
        setCostoTotale(totale);
    }, [prezzoTotale, spedizioneFissa]);


    /*Gestisco il metodo di pagamento*/
    const handlerMetodoPagamento = (e) => {
        setMetodoPagamento(e.target.value);
    };


    /*Gestisco l'evento del click sul bottone "Acquista"*/
    const Acquista = async(e) => {
        e.preventDefault();

        /*Controllo se i dati dell'utente sono tutti compilati*/
        if(oggettoUtente.numeroTelefono === "0000000000" || oggettoUtente.CAP === "" || oggettoUtente.Comune === "" || oggettoUtente.NumeroCivico === "" || oggettoUtente.IndirizzoDestinazione === "" || oggettoUtente.Nazione === "" || oggettoUtente.Provincia === ""){
            //gestisco popup dei dati mancanti
            setTipoPopup("datiMancanti");
        }
        else{
            //gestisco popup per la richiesta di conferma
            setTipoPopup("richiestaConferma");
        }
        setPopupActivated(true);
    }


    const confermaAcquisto = async(e) => {
        audioAcquistoRef.current.play();

        /*Creo un documento all'interno della cartella "Acquisti"*/
        const RiferimentoRaccoltaGestione = collection(db, "Gestione");
        let queryGetAcquisti = query(RiferimentoRaccoltaGestione, where("TipoGestione", "==", "Acquisti"));
        let snapshotGestione = await getDocs(queryGetAcquisti);

        let gestioneDoc = snapshotGestione.docs[0];
        const RiferimentoRaccoltaAcquisti = collection(gestioneDoc.ref, "Acquisti");
        const acquistoDoc = await addDoc(RiferimentoRaccoltaAcquisti,{
            //ContoUtilizzato: "non gestito",
            DataOrdine: dataFormattata,
            OrarioOrdine: oraFormattata,
            IDUtente: auth.currentUser.uid,
            IndirizzoDestinazione: oggettoUtente.IndirizzoResidenza,
            NumeroCivicoDestinazione: oggettoUtente.NumeroCivico,
            MetodoSpedizione: metodoPagamento,
            StatusOrdine: "Consegnato",
            Totale: costoTotale,
        });

        const RiferimentoRaccoltaProdottiAcquistati = collection(acquistoDoc, "ElencoProdottiAcquistati");
        const prodottiAcquisatiDoc = await addDoc(RiferimentoRaccoltaProdottiAcquistati,{
            IDProdotto: "",
            QuantitaAcquistata: 0,
        })

        /*Svuoto il carrello nel database per tale utente*/
        const queryGetGestione = query(RiferimentoRaccoltaGestione, where('TipoGestione', '==', 'Carrello'));
        let shapshotGestione = await getDocs(queryGetGestione);

        for(const gestioneDoc of shapshotGestione.docs){
            const RiferimentoRaccoltaCarrello = collection(gestioneDoc.ref, "Carrello");
            const queryGetUserCarrello = query(RiferimentoRaccoltaCarrello, where('IDUtente', '==', auth.currentUser.uid));
            const shapshotCarrello = await getDocs(queryGetUserCarrello);

            
            for(const carrelloDoc of shapshotCarrello.docs){
                const RiferimentoRaccoltaCarrelloProdotti = collection(carrelloDoc.ref, "CarrelloElencoProdotti");
                const snapshotCarrelloElencoProdotti = await getDocs(RiferimentoRaccoltaCarrelloProdotti);

                for(const carrelloElencoProdottiDoc of snapshotCarrelloElencoProdotti.docs){
                    /*Lascio sempre il documento vuoto di default, altrimenti Firebase elimina la cartella*/
                    if(carrelloElencoProdottiDoc.data().IDProdotto !== ""){
                        await deleteDoc(carrelloElencoProdottiDoc.ref);
                    }
                }
            }
        }


        /*Svuoto il localStorage del carrello per tale utente*/
        localStorage.removeItem(`${auth.currentUser.uid}_statusCarrello`);

        setTipoPopup("AcquistoCompletato");
    }

    /*Gestisco la chiusura del popup*/
    const chiudiPopup = async(e, scelta) => {
        e.preventDefault();

        if(scelta === "home"){
            setPopupActivated(false);
            navigate("/");
        }
        else if(scelta === "cronologia"){
            setPopupActivated(false);
            navigate("/Profilo/CronologiaOrdini");
        }
        else if(scelta === "modificaDati"){
            setPopupActivated(false);
            navigate("/Profilo/InformazioniPersonali")
        }
    }



    return(
        <div id="checkout">
            <div className="checkout-containter">
                <div className="informazioni-checkout">
                    <div className="checkout-spedizione">
                        <div className="spedizione-sx">
                            <p className="checkout-titolo">Indirizzo di spedizione ed info</p>
                            <p className="checkout-info b">Nome e Cognome: <span>{oggettoUtente.nome} {oggettoUtente.cognome}</span></p>
                            <p className="checkout-info">Numero di telefono: <span>{oggettoUtente.numeroTelefono}</span></p>
                            { 
                                (oggettoUtente.Nazione !== "" && oggettoUtente.Comune !== "" && oggettoUtente.CAP !== "") ? (
                                    <p className="checkout-info">Nazione e Comune: <span>{oggettoUtente.Nazione}, {oggettoUtente.Comune} ({oggettoUtente.CAP})</span></p>
                                ) : (
                                    <p className="checkout-info">Nazione e Comune: <span></span></p>
                                )
                            }
                            <p className="checkout-info">Indirizzo: <span>{oggettoUtente.IndirizzoResidenza} {oggettoUtente.NumeroCivico}</span></p>    
                        </div>
                        <div className="spedizione-dx">
                            <Link to="/Profilo/InformazioniPersonali">
                                <button className="modifica-dati-check"><span>Modifica dati</span></button>
                            </Link>
                        </div>
                    </div>
                    <div className="checkout-pagamento">
                        <p className="checkout-titolo">Modalità di pagamento</p>
                        <div className="metodo-pagamento-select">
                            <div className="payment-item">
                                <label>
                                    <input type="radio" value="carta_di_credito" checked={metodoPagamento === "carta_di_credito"} onChange={(e) => handlerMetodoPagamento(e)}/>
                                    <span>Carta di Credito/Debito</span>
                                </label>
                                <img className="payment-img" src={visa}/>
                                <img className="payment-img" src={MasterCard}/>
                                <img className="payment-img-postepay" src={pp}/>
                            </div>
                            <div className="payment-item">
                                <label>
                                    <input type="radio" value="paypal" checked={metodoPagamento === "paypal"} onChange={(e) => handlerMetodoPagamento(e)}/>
                                    <span>PayPal</span>
                                </label>
                                <img className="payment-img-paypal" src={PayPal}/>        
                            </div>
                            <div className="payment-item" >
                                <label>
                                    <input type="radio" value="googlepay" checked={metodoPagamento === "googlepay"} onChange={(e) => handlerMetodoPagamento(e)}/>
                                    <span>Google Pay</span>
                                </label>
                                <img className="payment-img-googlepay" src={GooglePay}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="riepilogo-ordine">
                    <p className="riepilogo-subtitle">Riepilogo dell'ordine</p>
                    <div className="costo-totale-checkout">
                        <p>Costo prodotti</p>
                        <p className="riepilogo-costo-totale">{parseFloat(prezzoTotale).toFixed(2)} €</p>
                    </div>
                    <div className="costo-totale-checkout">
                        <p>Spese di trasporto</p>
                        <p className="riepilogo-spese-trasporto">{spedizioneFissa} €</p>
                    </div>
                    <div className="somma-totale">
                        <p>Somma totale</p>
                        <p className="riepilogo-somma-totale">{parseFloat(costoTotale).toFixed(2)} €</p>
                    </div>
                    <div className="divisore-riepilogo"/>
                    <button className="ordina-button" onClick={(e) => Acquista(e)}><span>Ordina</span></button>
                </div>
            </div>

            {/*Messaggio popup*/}
            { popupActivated &&
                <>
                {
                    (tipoPopup === "datiMancanti") &&
                    <>
                        <div className="popup popupsignuppage popup-datimancanti">
                            <h2>Attenzione!</h2>
                            <p>Prima di procedere con l'acquisto è necessario prima compilare i tuoi dati personali!</p>
                            <img className="popup-croce-negativa" src={error} alt="conferma login"/>
                            <div className="checkup-btn">
                                <button className="popupcheckout-datimancanti" onClick={(e) => chiudiPopup(e, "modificaDati")}>Modifica dati</button>
                            </div>
                        </div>
                        <div id="overlay"/>
                    </>
                }
                {
                    (tipoPopup === "richiestaConferma") &&
                    <>
                        <div className="popup popupsignuppage">
                            <h2>Acquisto quasi completato!</h2>
                            <p>Confermi il tuo indirizzo? {oggettoUtente.IndirizzoResidenza} {oggettoUtente.NumeroCivico}, {oggettoUtente.Comune}</p>
                            <img className="popup-signup-img" src={spuntaverde} alt="conferma login"/>
                            <div className="checkup-btn checkup-btn-richiesta-conferma">
                                <button className="popuprichiesta-conferma" onClick={(e) => confermaAcquisto(e)}>Conferma</button>
                                <Link to="/Profilo/InformazioniPersonali"><p className="modifica-indirizzo">Modifica indirizzo</p></Link>
                                <audio ref={audioAcquistoRef} src={suonoCarrello}/>
                            </div>
                        </div>
                        <div id="overlay"/>
                    </>
                }
                {
                    (tipoPopup === "AcquistoCompletato") &&
                    <>
                        <div className="popup popupsignuppage">
                            <h2>Complimenti, <span className="popup-nomeutente">{oggettoUtente.nome}</span>!</h2>
                            <p>L'acquisto è andato a buon fine!</p>
                            <img className="popup-signup-img" src={spuntaverde} alt="conferma login"/>
                            <div className="checkup-btn">
                                <button className="popupcheckout-home" onClick={(e) => chiudiPopup(e, "home")}>Torna alla home</button>
                                <button className="popupcheckout-cronologia" onClick={(e) => chiudiPopup(e, "cronologia")}>Cronologia acquisti</button>
                            </div>
                        </div>
                        <div id="overlay"/>
                    </>
                }
                </>
            }
        </div>
    )
}

export default Checkout;