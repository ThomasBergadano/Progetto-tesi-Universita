import React, { useState, useEffect, useRef }  from "react"
import { Link, useNavigate } from 'react-router-dom'
import { FaUpload } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import faqimage from "../assets/images/faq2.png"
import email from "../assets/images/email.png"
import error from "../assets/images/error.webp"
import spuntaverde from "../assets/images/spuntaverde.png"
import "../styles/assistenzaclientipage.css"



function AssistenzaClienti() {
    /*Costanti per le domande-risposte a tendina*/
    const [rispostaAperta, setRispostaAperta] = useState(false);

    /*Input per il form*/
    const contattaciForm = useRef();
    const [nome_assistenza, setNome_assistenza] = useState("");
    const [cognome_assistenza, setCognome_assistenza] = useState("");
    const [email_assistenza, setEmail_assistenza] = useState("");
    const [numero_assistenza, setNumero_assistenza] = useState("");
    const [citta_assistenza, setCitta_assistenza] = useState("");
    const [messaggio_assistenza, setMessaggio_assistenza] = useState("");
    const [allegato_assistenza, setAllegato_assistenza] = useState(null);


    /*Costanti per la gestione del popup*/
    const [popupActivated, setPopupActivated] = useState(false);
    const [tipoPopup, setTipoPopup] = useState(""); //tipoPopup = successo/errore
    const [messaggiErrore, setMessaggiErrore] = useState([]);



    /*Teletrasporto l'utente all'inizio della pagina appena viene fatto il rendering*/
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    /*Quando il popup è attivo, io non voglio che l'utente possa scrollare*/
    useEffect(() => {
        if (popupActivated) {
            document.body.style.overflow = 'hidden';
            document.getElementById('assistenzaclientipage').style.overflow = 'hidden';

        } else {
            document.body.style.overflow = 'auto';
            document.getElementById('assistenzaclientipage').style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [popupActivated]);

    /*Funzione per l'apertura o chiusura delle tendine per la FAQ*/
    const apriRisposta = (domanda) => {
        if(rispostaAperta === domanda){ /*Voglio permettere alla domanda ritirare la risposta, cliccando 2 volte*/
            setRispostaAperta(null);
        }
        else{
            setRispostaAperta(domanda);
        }
    }

    /*Funzione per il controllo degli errori*/
    const controlloCampiForm = (e) => {
        const aggiungiMessaggiErrore = [];
        const pattern=/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        const onlyLetters = /^[a-zA-Z]+$/;
        setTipoPopup("successo");

        if(nome_assistenza === "" || cognome_assistenza === "" || email_assistenza === "" || numero_assistenza === "" || citta_assistenza === "" || messaggio_assistenza === ""){
            aggiungiMessaggiErrore.push("Alcuni campi sono stati lasciati vuoti");
            setTipoPopup("errore");
        }
        else{
            if(nome_assistenza.length < 3 || !nome_assistenza.match(onlyLetters)){
                aggiungiMessaggiErrore.push("Il nome inserito non è valido");
                setTipoPopup("errore");
            }
            if(cognome_assistenza.length < 3 || !cognome_assistenza.match(onlyLetters)){
                aggiungiMessaggiErrore.push("Il cognome inserito non è valido");
                setTipoPopup("errore");     
            }
            if(!email_assistenza.match(pattern)){
                aggiungiMessaggiErrore.push("Formato dell'email errato");
                setTipoPopup("errore");
            }
            if(isNaN(numero_assistenza) || numero_assistenza.length < 10){
                aggiungiMessaggiErrore.push("Il numero di telefono deve contenere solo numeri ed avere 10 cifre");
                setTipoPopup("errore");
            }
        }
        setMessaggiErrore([...messaggiErrore, ...aggiungiMessaggiErrore]);
        setPopupActivated(true);
    }

    /*Funzione per chiusura del popup in caso di errore*/
    const continuaPopup = (e) => {
        setTipoPopup("");
        setMessaggiErrore([]);
        setPopupActivated(false);

        setNome_assistenza("");
        setCognome_assistenza("");
        setEmail_assistenza("");
        setNumero_assistenza("");
        setCitta_assistenza("");
        setMessaggio_assistenza("");
        setAllegato_assistenza("");
        contattaciForm.current.reset();
    }

    



    return(
        <div id="assistenzaclientipage">
            <div className="FAQ">
                <img src={faqimage} alt="faq-image"/>
                <span className="FAQ-title">FAQ</span>
                <p>Benvenuti alla nostra sezione FAQ, dove troverete risposte alle domande più comuni. Se non trovate quello che state cercando, non esitate a contattarci tramite il modulo sottostante. Siamo qui per aiutarvi!</p>
                <div className="FAQ-item">
                    <div className="question" onClick = {() => apriRisposta("Domanda 1")}>Non ho ricevuto nessuna conferma per il mio ordine, cosa devo fare?</div>
                    {rispostaAperta === "Domanda 1" ? <FaChevronUp className="icon-question-up" /> : <FaChevronDown className="icon-question-down"/>}
                    {rispostaAperta === "Domanda 1" && <div className="answer">Le conferme degli ordini vengono spedite automaticamente tramite email entro qualche minuto dalla conclusione dell'ordine. Se non hai ricevuto niente è provabile che si sia verificato un inconveniente tecnico. In questo caso non esitare a contattarci, ti manderemo l´email di conferma manualmente.</div>}
                </div>
                <div className="FAQ-item">
                    <div className="question" onClick = {() => apriRisposta("Domanda 2")}>Come posso contattare il servizio clienti di Lumia in caso di domande o problemi?</div>
                    {rispostaAperta === "Domanda 2" ? <FaChevronUp className="icon-question-up" /> : <FaChevronDown className="icon-question-down"/>}
                    {rispostaAperta === "Domanda 2"&& <div className="answer">Per contattare il nostro servizio clienti, puoi utilizzare diversi canali. Puoi inviarci un'email all'indirizzo bthomasb2001@gmail.com, chiamarci al numero +39 257 948 2341 o utilizzare il modulo di contatto sul nostro sito web. Siamo disponibili per assisterti e rispondere alle tue domande dal lunedì al venerdì dalle 9:00 alle 18:00.</div>}
                </div>
                <div className="FAQ-item">
                    <div className="question" onClick = {() => apriRisposta("Domanda 3")}>Quali sono le opzioni di pagamento disponibili su Lumia?</div>
                    {rispostaAperta === "Domanda 3" ? <FaChevronUp className="icon-question-up" /> : <FaChevronDown className="icon-question-down"/>}
                    {rispostaAperta === "Domanda 3" && <div className="answer">Offriamo diverse opzioni di pagamento per rendere l'esperienza di acquisto più comoda per i nostri clienti. Accettiamo pagamenti con carta di credito (Visa, Mastercard, Postepay), PaylPal e GooglePay. Tutti i pagamenti sono sicuri e protetti.</div>}
                </div>
                <div className="FAQ-item">
                    <div className="question" onClick = {() => apriRisposta("Domanda 4")}>Fornite assistenza per l'assemblaggio dei mobili?</div>
                    {rispostaAperta === "Domanda 4" ? <FaChevronUp className="icon-question-up" /> : <FaChevronDown className="icon-question-down"/>}
                    {rispostaAperta === "Domanda 4" && <div className="answer">Sì, offriamo assistenza per l'assemblaggio dei mobili acquistati da noi. Ogni articolo viene fornito con istruzioni dettagliate per l'assemblaggio, ma se hai bisogno di assistenza aggiuntiva, non esitare a contattarci. Possiamo metterti in contatto con professionisti dell'assemblaggio nella tua zona o fornirti assistenza telefonica.</div>}
                </div>
                <div className="FAQ-item">
                    <div className="question" onClick = {() => apriRisposta("Domanda 5")}>Quali sono i tempi di spedizione?</div>
                    {rispostaAperta === "Domanda 5" ? <FaChevronUp className="icon-question-up" /> : <FaChevronDown className="icon-question-down"/>}
                    {rispostaAperta === "Domanda 5" && <div className="answer">I tempi di spedizione vanno in media dai 10 ai 40 giorni lavorativi. Al cliente vorremmo offrire la massima qualità possibile e nel miglior modo possibile. Inoltre, più si è distanti da Torino, ad esempio se si è in un alto Paese o in una regione fuoi dal Piemonte, più vorrebbe richiederci tempo.</div>}
                </div>
                <div className="FAQ-item">
                    <div className="question" onClick = {() => apriRisposta("Domanda 6")}>Quali sono le politiche di privacy e sicurezza del vostro sito?</div>
                    {rispostaAperta === "Domanda 6" ? <FaChevronUp className="icon-question-up" /> : <FaChevronDown className="icon-question-down"/>}
                    {rispostaAperta === "Domanda 6" && <div className="answer">La tua privacy e sicurezza sono di massima importanza per noi. Abbiamo implementato rigorose politiche e procedure per garantire la massima protezione delle tue informazioni personali. Presso la nostra azienda, adottiamo misure di sicurezza avanzate per prevenire l'accesso non autorizzato, l'uso improprio o la divulgazione dei tuoi dati.</div>}
    
                </div>
            </div>
            <div className="contattaci">
                <img src={email} alt="faq-image"/>
                <span className="contattaci-title">Contattaci</span>
                <p>Scrivici o contattaci per qualsiasi tipo di informazione. Saremo lieti di rispondere il prima possibile. La vostra richiesta verrà ricevuta da noi sottoforma di email.</p>
                <div className="contattaci-section-block">
                    <div className="contattaci-section">
                        <div className="contattaci-contatti">
                            <span className="contattaci-titoletto">Recapiti</span>
                            <p>Numero telefono: +39 333 333 3333</p>
                            <p>Email: lumiaarredamenti@lumiarr.com</p>
                        </div>
                        <div className="contattaci-dovesiamo">
                            <span className="contattaci-titoletto-b">Dove siamo</span>
                            <p>Via Andrea Cesalpino, 55, Torino</p>
                            <p>CAP: 12923 (TO)</p>
                            <p>Italia, Piemonte</p>
                        </div>
                    </div>

                    <div className="assistenza-form-container">
                        <form className="assistenza-form" method="POST" ref={contattaciForm}>
                            <input type="name" className="assistenza-input" placeholder="Nome" autoComplete="nome" onChange={(e) => setNome_assistenza(e.target.value)}/>
                            <input type="surname" className="assistenza-input" placeholder="Cognome" autoComplete="cognome" onChange={(e) => setCognome_assistenza(e.target.value)}/>
                            <input type="email" className="assistenza-input" placeholder="Email" autoComplete="email" onChange={(e) => setEmail_assistenza(e.target.value)}/>
                            <input type="phone" className="assistenza-input" placeholder="Numero" autoComplete="phone" onChange={(e) => setNumero_assistenza(e.target.value)}/>
                            <input type="city" className="assistenza-input" placeholder="Città" autoComplete="city" onChange={(e) => setCitta_assistenza(e.target.value)}/>
                            <textarea className="assistenza-textarea" placeholder="Inserisci il tuo messaggio qui" onChange={(e) => setMessaggio_assistenza(e.target.value)}/>
                            <label className="assistenza-allegato">
                                <input className="assistenza-allegato-upload" type="file" onChange={(e) => setAllegato_assistenza(e.target.value)}/>
                                <FaUpload className="upload-icon"/>
                            </label>
                        </form>
                        <button className="submit-assistenza" onClick={(e) => controlloCampiForm(e)}>Invia messaggio</button>
                    </div>
                </div>
            </div>


            {/*Messaggio popup*/}
            { popupActivated && 
                <>
                {
                    (tipoPopup === "successo") && 
                    <>
                        <div className="popup popupsignuppage">
                            <h2>Ti ringraziamo per aver contattato l'assistenza.</h2>
                            <p>Ti risponderemo via email il prima possibile!</p>
                            <img className="popup-signup-img" src={spuntaverde} alt="conferma invio assistenza"/>
                            <button className="popup-signup-btn" type="button" onClick={(e) => continuaPopup(e)}>Ok</button>
                        </div>
                        <div id="overlay"></div>
                    </>
                }
                {
                    (tipoPopup === "errore") && 
                    <>
                        <div className="popup popupsignuppage-error">
                            <h2>Errore in "Contattaci":</h2>
                            <img className="popup-croce-negativa" src={error} alt="conferma login"/>
                            <ul>
                                {messaggiErrore.map((messaggio, index) => (
                                    <li key={index}>{messaggio}</li>
                                ))}
                            </ul>
                            <button className="modifica-signup-btn" type="button" onClick={(e) => continuaPopup(e)}>Modifica</button>
                        </div>
                        <div id="overlay"></div>
                    </>
                }
                </>
            }
        </div>
    )
}

export default AssistenzaClienti;