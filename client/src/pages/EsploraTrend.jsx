import React, { useState, useEffect, useRef }  from "react"
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc, getDocs, setDoc, collection, query, where, getFirestore, addDoc } from "firebase/firestore"
import db from "../database/firebase"
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import soggiorno from '../assets/images/soggiorno.jpg'
import stoffa from '../assets/images/stoffa.png'
import '../styles/EsploraTrend.css'

function EsploraTrend() {
    /*Stato e riferimenti per il carosello delle Sottocategorie*/
    const [posizioneCaroselloSottocategorie, setPosizioneCaroselloSottocategorie] = useState(0);
    const caroselloSottocategorieRef = useRef(null);
    const [limiteCaroselloSottocategorie, setLimiteCaroselloSottocategorie] = useState(10);

    /*Stato e riferimenti per il carosello dei Prodotti più Economici*/
    const [posizioneCaroselloProdEco, setPosizioneCaroselloProdEco] = useState(0);
    const caroselloProdEcoRef = useRef(null);
    const [limiteCaroselloProdEco, setLimiteCaroselloProdEco] = useState(10);

    /*Stato e riferimenti per il carosello dei Prodotti più Recenti*/
    const [posizioneCaroselloProdRec, setPosizioneCaroselloProdRec] = useState(0);
    const caroselloProdRecRef = useRef(null);
    const [limiteCaroselloProdRec, setLimiteCaroselloProdRec] = useState(10);

    

    useEffect(() => {
        /*Teletrasporto l'utente all'inizio della pagina appena viene fatto il rendering*/
        window.scrollTo(0, 0);

        /*Setto a 0 la posizione (asse x) di ciascun carosello*/
        const handlerPosizioneCarosello = () => {
            setPosizioneCaroselloSottocategorie(0);
            setPosizioneCaroselloProdEco(0);
            setPosizioneCaroselloProdRec(0);
        }

        handlerPosizioneCarosello();
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
                        <div className="esplora-slot">
                            <img style={{ backgroundColor:"red" }}></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                        <img style={{ backgroundColor:"red" }}></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img style={{ backgroundColor:"red" }}></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
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
                        <div className="esplora-slot">
                            <img style={{ backgroundColor:"red" }}></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                        <img style={{ backgroundColor:"red" }}></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img style={{ backgroundColor:"red" }}></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
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
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="esplora-slot">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
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