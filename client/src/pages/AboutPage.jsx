import React, { useState, useEffect }  from "react"
import responsabile from "../assets/images/responsabile.png"
import lumialogo from "../assets/images/lumia-logo.svg"
import "../styles/AboutPage.css"
import stanza1 from "../assets/images/stanza1.png"
import stanza2 from "../assets/images/stanza2.png"

function About(){

    /*Teletrasporto l'utente all'inizio della pagina appena viene fatto il rendering*/
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return(
        <div id="aboutpage">
            <div className="chi-siamo">
                <h2 className="sottotitolo-chi-siamo"><span>LUMIA</span>, cosa sei?</h2>
                <p>Benvenuti in Lumia, un e-commerce nato e sviluppato tra la fine del 2023 ed inizio 2024, in particolare siamo un sito di rivendita online di mobili ed arredamento, sia per interni che per giardino.  Crediamo fermamente che la tua casa dovrebbe essere più di un semplice luogo dove vivere: dovrebbe essere una rappresentazione di te stesso, della tua creatività e della tua salute. Siamo qui per trasformare le tue visioni in realtà. <br/>Benvenuti in Lumia, dove il tuo sogno di arredare diventa realtà.</p>
            </div>
            <div className="chi-siamo2">
                
            </div>
            <div className="about-riga4">
                <div className="responsabile">
                    <img className="img-responsabile" src={responsabile} alt="immagine-responsabile"></img>
                    <div className="responsabile-info">
                        <span className="responsabile-nome">Nome Cognome</span>
                        <span>Titolare dell'azienda</span>
                    </div>
                </div>
                <div className="responsabile">
                    <img className="img-responsabile" src={responsabile} alt="immagine-responsabile"></img>
                    <div className="responsabile-info">
                        <span className="responsabile-nome">Nome Cognome</span>
                        <span>Titolare dell'azienda</span>
                    </div>
                </div> 
                <div className="responsabile">
                    <img className="img-responsabile" src={responsabile} alt="immagine-responsabile"></img>
                    <div className="responsabile-info">
                        <span className="responsabile-nome">Nome Cognome</span>
                        <span>Titolare dell'azienda</span>
                    </div>
                </div> 
            </div>
            <div className="about-riga2">
                <p>"La tua casa dovrebbe raccontare la storia di chi sei, ed essere una collezione di ciò che ami."</p>
                <p>"La semplicità è l'ultima sofisticazione."</p>
                <p>"Il buon design è visivamente potente, intellettualmente elegante e, soprattutto, senza tempo."</p>
            </div>
            <div className="about-riga3">
                <div className="riga3-immagini">
                    <div className="riga3-immagine1">
                        <img src={stanza1} alt="stanza1" />
                    </div>
                    <div className="riga3-immagine2">
                        <img src={stanza2} alt="stanza2" />
                    </div>
                </div>
                <div className="box-obiettivo">
                    <span className="sottotitolo-obiettivo">Il nostro obiettivo</span>
                    <p>Crediamo che il buon design vada oltre l'estetica: deve essere funzionale, sostenibile e riflettere le vostre esigenze individuali. Ci impegniamo a offrire prodotti di alta qualità che soddisfino questi criteri, lavorando con fornitori affidabili e sostenibili per garantire che ogni pezzo sia realizzato con cura e attenzione ai dettagli. Vogliamo essere il vostro compagno di fiducia nel viaggio verso una casa più bella e funzionale, offrendo ispirazione e prodotti di qualità superiore.</p>
                    <p>Ci impegniamo costantemente a rimanere al passo con le ultime tendenze nel mondo dell'arredamento e dell'interior design, offrendo una vasta gamma di stili e opzioni per soddisfare ogni gusto e preferenza. Vogliamo che la vostra esperienza con noi sia sempre stimolante, con nuovi arrivi e collezioni che vi ispirano ad aggiornare e trasformare i vostri spazi abitativi.</p>
                </div>
            </div>

            <div className="about-riga5">
                <div className="indirizzi">
                    <span className="span-indirizzi">Indirizzi e recapiti</span>
                    <span>Via XXXXX N°31, Torino</span>
                    <span>+39 XXX XXX XXXX</span>
                    <span>lumiaarredamenti@lumiarr.com</span>
                </div>
                <div className="orari">
                    <span className="span-orari">Orari negozio: </span>
                    <span className="orario-negozio">LUN-VEN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 08:30 - 13:30, 14:30 - 18:30</span>
                    <span className="orario-negozio">SAB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 08:30 - 12:30, 13:30 - 16:30</span>
                    <span className="orario-negozio">DOM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; CHIUSO</span>
                </div>
            </div>  
        </div>
    )
}

export default About;

/*
            <div className="about-intro">
                <h2 className="sottotitolo-chi-siamo"><span>LUMIA</span>, cosa sei?</h2>
                <p>Benvenuti in Lumia, un e-commerce nato e sviluppato tra la fine del 2023 ed inizio 2024, in particolare siamo un sito di rivendita online di mobili ed arredamento, sia per interni che per giardino.  Crediamo fermamente che la tua casa dovrebbe essere più di un semplice luogo dove vivere: dovrebbe essere una rappresentazione di te stesso, della tua creatività e della tua salute. Siamo qui per trasformare le tue visioni in realtà. <br/>Benvenuti in Lumia, dove il tuo sogno di arredare diventa realtà.</p>
            </div>
            */