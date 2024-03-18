import React, { useState, useEffect, useRef }  from "react"
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc, getDocs, setDoc, collection, query, where, getFirestore, addDoc } from "firebase/firestore"
import db from "../database/firebase"
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import soggiorno from '../assets/images/soggiorno.jpg'
import stoffa from '../assets/images/stoffa.png'
import loading from "../assets/images/loading.gif"
import '../styles/EsploraTrend.css'

function EsploraTrend() {
    const navigate = useNavigate();
    
    /*Stato e riferimenti per il carosello delle Sottocategorie*/
    const [posizioneCaroselloSottocategorie, setPosizioneCaroselloSottocategorie] = useState(0);
    const caroselloSottocategorieRef = useRef(null);
    const [limiteCaroselloSottocategorie, setLimiteCaroselloSottocategorie] = useState(10);
    const [sottocategorie, setSottocategorie] = useState([]);
    const [caricamentoArray, setCaricamentoArray] = useState(true);

    /*Stato e riferimenti per il carosello dei Prodotti più Economici*/
    const [posizioneCaroselloProdEco, setPosizioneCaroselloProdEco] = useState(0);
    const caroselloProdEcoRef = useRef(null);
    const [limiteCaroselloProdEco, setLimiteCaroselloProdEco] = useState(10);
    const [prodottiPiuEconomici, setProdottiPiuEconomici] = useState([]);

    /*Stato e riferimenti per il carosello dei Prodotti più Recenti*/
    const [posizioneCaroselloProdRec, setPosizioneCaroselloProdRec] = useState(0);
    const caroselloProdRecRef = useRef(null);
    const [limiteCaroselloProdRec, setLimiteCaroselloProdRec] = useState(10);
    const [prodottiPiuRecenti, setprodottiPiuRecenti] = useState([]);

    

    useEffect(() => {
        /*Teletrasporto l'utente all'inizio della pagina appena viene fatto il rendering*/
        window.scrollTo(0, 0);

        /*Setto a 0 la posizione (asse x) di ciascun carosello*/
        const handlerPosizioneCarosello = async() => {
            setPosizioneCaroselloSottocategorie(0);
            setPosizioneCaroselloProdEco(0);
            setPosizioneCaroselloProdRec(0);
        }
        handlerPosizioneCarosello();

        /*Caricamento degli array delle Sottocategorie, I più economici, e I più recenti*/
        const fillArrays = async() => {
            const arraySottocategorie = [];
            const arrayProdotti = [];

            /*Ottengo riferimento alla raccolta Categoria*/
            const RiferimentoRaccoltaCategoria = collection(db, 'Categoria');
            const snapshotCategorie = await getDocs(RiferimentoRaccoltaCategoria);
            for(const categoriaDoc of snapshotCategorie.docs){

                /*Ottengo riferimento alla raccolta Sottocategoria*/
                const RiferimentoRaccoltaSottoCategoria = collection(categoriaDoc.ref, "SottoCategoria");
                const snapshotSottoCategorie = await getDocs(RiferimentoRaccoltaSottoCategoria);
                for(const sottocategoriaDoc of snapshotSottoCategorie.docs){
                    arraySottocategorie.push(sottocategoriaDoc.data());

                    /*Ottengo riferimento alla raccolta Prodotti e inserisco nell'array*/
                    const RiferimentoRaccoltaProdotti = collection(sottocategoriaDoc.ref, "Prodotti");
                    const snapshotProdotti = await getDocs(RiferimentoRaccoltaProdotti);
                    if(snapshotProdotti.docs.length > 0){
                        for(const prodottoDoc of snapshotProdotti.docs){
                            /*Voglio inserire nell'array sia l'id del documento che i campi del prodotto*/
                            const datiProdotto = prodottoDoc.data();
                            const prodottoConId = { id: prodottoDoc.id, dataAggiunta: prodottoDoc.data().timestamp, ...datiProdotto }
                            arrayProdotti.push(prodottoConId);
                        }
                    }
                }
            }
            setSottocategorie(arraySottocategorie);
            setprodottiPiuRecenti(arrayProdotti);
            setProdottiPiuEconomici(arrayProdotti.sort((a, b) => a.Prezzo - b.Prezzo).slice(0,50));
            /*setprodottiPiuRecenti(arrayProdotti.sort((a, b) => a.dataAggiunta - b.dataAggiunta).slice(0,50));*/
            setCaricamentoArray(false);
        }
        fillArrays();
    }, [])


    /*Funzione per lo spostamento all'interno del carosello delle Sottocategorie*/
    const spostaCaroselloSottocategorie = async(direzione) => {
        const spostamentoPX = 230;
        const carosello = caroselloSottocategorieRef.current;
        const limiteDestro = carosello.scrollWidth - carosello.clientWidth;
        setLimiteCaroselloSottocategorie(limiteDestro);

        if(direzione === "destra" && posizioneCaroselloSottocategorie < limiteDestro){
            setPosizioneCaroselloSottocategorie(posizioneCaroselloSottocategorie + spostamentoPX);
        }
        else if(direzione === "sinistra" && posizioneCaroselloSottocategorie > 0){
            setPosizioneCaroselloSottocategorie(posizioneCaroselloSottocategorie - spostamentoPX);
        }
    }

    /*Funzione per lo spostamento all'interno dei prodotti più economici*/
    const spostaCaroselloProdEco = async(direzione) => {
        const spostamentoPX = 230;
        const carosello = caroselloProdEcoRef.current;
        const limiteDestro = carosello.scrollWidth - carosello.clientWidth;
        setLimiteCaroselloProdEco(limiteDestro);

        if(direzione === "destra" && posizioneCaroselloProdEco < limiteDestro){
            setPosizioneCaroselloProdEco(posizioneCaroselloProdEco + spostamentoPX);
        }
        else if(direzione === "sinistra" && posizioneCaroselloProdEco > 0){
            setPosizioneCaroselloProdEco(posizioneCaroselloProdEco - spostamentoPX);
        }       
    }
    
    /*Funzione per lo spostamento all'interno dei prodotti più recenti*/
    const spostaCaroselloProdRec = async(direzione) => {
        const spostamentoPX = 230;
        const carosello = caroselloProdRecRef.current;
        const limiteDestro = carosello.scrollWidth - carosello.clientWidth;
        setLimiteCaroselloProdRec(limiteDestro);

        if(direzione === "destra" && posizioneCaroselloProdRec < limiteDestro){
            setPosizioneCaroselloProdRec(posizioneCaroselloProdRec + spostamentoPX);
        }
        else if(direzione === "sinistra" && posizioneCaroselloProdRec > 0){
            setPosizioneCaroselloProdRec(posizioneCaroselloProdRec - spostamentoPX);
        }       
    }

    /* Ricerca dell'utente di una particolare sottocategoria di prodotti */
    const handlerCercaSottoCategoria = (NomeSottocategoria) => {
        //encoreURIComponent converte una stringa in un formato url ('Mobili e arredo per ufficio' -> "Mobili%20e%20arredo%20per%20ufficio")
        navigate(`/CatalogoProdotti?sottocategoria=${encodeURIComponent(NomeSottocategoria)}`);
    }



    return(
        <div id="esplora-trend">
            <div className="esplora-introduzione">
                <img src={stoffa} alt="stoffa"></img>
                <div className="testo-container">
                    <h2 className="esplora-title">Lasciati ispirare dai nostri prodotti</h2>
                    <p className="esplora-descrizione">Hai bisogno di un qualche suggerimento o di idee nuove per abbellire il tuo arredo o ottimizzare gli spazi in casa? Sei nel posto giusto: lasciati ispirare dai nuovi arrivi e cerca di individuare ciò che fa per te!</p>
                </div>
            </div>
            <div className="container-trend">
                <div className="esplora-sottocategorie">
                    <p className="esplora-subtitle">Tutte le nostre sottocategorie</p>
                    <div className="disposizione-elementi" ref={caroselloSottocategorieRef} style={{ transform: `translateX(-${posizioneCaroselloSottocategorie}px)`}}>
                        {sottocategorie.length === 0 && 
                            <div className="zero-elementi">
                                {caricamentoArray === true ? (
                                    <img className="loading-gif" src={loading} alt="caricamentoArray"></img>
                                ) : (
                                    <span>Nessun risultato ottenuto per i filtri che hai impostato </span>
                                )}
                            </div>
                        }
                        {sottocategorie.length !== 0 && sottocategorie.map((sottocategoria,index) => (
                                <div className="esplora-slot" key={index} onClick={() => handlerCercaSottoCategoria(sottocategoria.NomeSottoCategoria)}>
                                    <img src={sottocategoria.ImmagineUrl} alt="icona-sottocategoria"></img>
                                    <div className="slot-container">
                                        <p className={`nomeSlot`}>{sottocategoria.NomeSottoCategoria}</p>
                                    </div>
                                </div>
                        ))}
                    </div>
                    <div className={`freccia-sinistra sopra ${posizioneCaroselloSottocategorie <= 0 ? "frecciaDisabilitata" : ""}`} onClick={() => spostaCaroselloSottocategorie("sinistra")}>
                        <FaArrowCircleLeft />
                    </div>
                    <div className={`freccia-destra sopra ${posizioneCaroselloSottocategorie >= limiteCaroselloSottocategorie ? "frecciaDisabilitata" : ""}`} onClick={() => spostaCaroselloSottocategorie("destra")}>
                        <FaArrowCircleRight />
                    </div>
                </div>
                <div className="esplora-piueconomici">
                    <p className="esplora-subtitle">I più economici</p>
                    <div className="disposizione-elementi" ref={caroselloProdEcoRef} style={{ transform: `translateX(-${posizioneCaroselloProdEco}px)`}}>
                        {prodottiPiuEconomici.length === 0 && 
                            <div className="zero-elementi">
                                {caricamentoArray === true ? (
                                    <img className="loading-gif" src={loading} alt="caricamentoArray"></img>
                                ) : (
                                    <span>Nessun risultato ottenuto per i filtri che hai impostato </span>
                                )}
                            </div>
                        }
                        {prodottiPiuEconomici.length !== 0 && prodottiPiuEconomici.map((prodotto,index) => (
                            <Link to={`/CatalogoProdotti/id:${prodotto.id}`}>
                                <div className="esplora-slot" key={index}>
                                    <img src={prodotto.Immagine} alt="icona-prodotto"></img>
                                    <div className="slot-prezzo">
                                        <p>{prodotto.Prezzo}€</p>
                                    </div> 
                                    <div className="slot-container">
                                        <p className={`nomeSlot`}>{prodotto.NomeProdotto}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className={`freccia-sinistra sotto ${posizioneCaroselloProdEco <= 0 ? "frecciaDisabilitata" : ""}`} onClick={() => spostaCaroselloProdEco("sinistra")}>
                        <FaArrowCircleLeft />
                    </div>
                    <div className={`freccia-destra sotto ${posizioneCaroselloProdEco >= limiteCaroselloProdEco ? "frecciaDisabilitata" : ""}`} onClick={() => spostaCaroselloProdEco("destra")}>
                        <FaArrowCircleRight />
                    </div>
                </div>
                <div className="esplora-ultimiarrivi">
                    <p className="esplora-subtitle">Gli ultimi arrivi</p>
                    <div className="disposizione-elementi" ref={caroselloProdRecRef} style={{ transform: `translateX(-${posizioneCaroselloProdRec}px)`}}>
                        {prodottiPiuRecenti.length === 0 && 
                            <div className="zero-elementi">
                                {caricamentoArray === true ? (
                                    <img className="loading-gif" src={loading} alt="caricamentoArray"></img>
                                ) : (
                                    <span>Nessun risultato ottenuto per i filtri che hai impostato </span>
                                )}
                            </div>
                        }
                        {prodottiPiuRecenti.length !== 0 && prodottiPiuRecenti.map((prodotto,index) => (
                            <Link to={`/CatalogoProdotti/id:${prodotto.id}`}>
                                <div className="esplora-slot" key={index}>
                                    <img src={prodotto.Immagine} alt="icona-prodotto"></img>
                                    <div className="slot-container">
                                        <p className={`nomeSlot`}>{prodotto.NomeProdotto}</p>
                                    </div>
                                </div>
                            </Link>
                        ))} 
                    </div>
                    <div className={`freccia-sinistra sotto ${posizioneCaroselloProdRec <= 0 ? "frecciaDisabilitata" : ""}`} onClick={() => spostaCaroselloProdRec("sinistra")}>
                        <FaArrowCircleLeft />
                    </div>
                    <div className={`freccia-destra sotto ${posizioneCaroselloProdRec >= limiteCaroselloProdRec ? "frecciaDisabilitata" : ""}`} onClick={() => spostaCaroselloProdRec("destra")}>
                        <FaArrowCircleRight />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EsploraTrend;