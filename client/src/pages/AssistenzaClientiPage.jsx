import React, { useEffect, useState } from "react"
import "../styles/assistenzaclientipage.css"
import { FaUpload } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import faqimage from "../assets/images/faq2.png"
import email from "../assets/images/email.png"

function AssistenzaClienti() {
    const [rispostaAperta, setRispostaAperta] = useState(false);

    /*Teletrasporto l'utente all'inizio della pagina appena viene fatto il rendering*/
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const apriRisposta = (domanda) => {
        if(rispostaAperta === domanda){ /*Voglio permettere alla domanda ritirare la risposta, cliccando 2 volte*/
            setRispostaAperta(null);
        }
        else{
            setRispostaAperta(domanda);
        }
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
                            <p>Numero telefono: +39 922 143 2397</p>
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
                        <form className="assistenza-form">
                            <input type="name" className="assistenza-input" placeholder="Nome" autoComplete="nome" onChange={null}/>
                            <input type="surname" className="assistenza-input" placeholder="Cognome" autoComplete="cognome" onChange={null}/>
                            <input type="email" className="assistenza-input" placeholder="Email" autoComplete="email" onChange={null}/>
                            <input type="phone" className="assistenza-input" placeholder="Numero" autoComplete="phone" onChange={null}/>
                            <input type="city" className="assistenza-input" placeholder="Città" autoComplete="city" onChange={null}/>
                            <textarea className="assistenza-textarea" placeholder="Inserisci il tuo messaggio qui"></textarea>
                            <label className="assistenza-allegato">
                                <input className="assistenza-allegato-upload" type="file"/>
                                <FaUpload className="upload-icon"/>
                            </label>
                            <button className="submit-assistenza">Invia messaggio</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssistenzaClienti;