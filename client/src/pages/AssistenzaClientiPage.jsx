import React, { useEffect, useState } from "react"
import "../styles/assistenzaclientipage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaUpload } from "react-icons/fa6";

function AssistenzaClienti() {
    const [rispostaAperta, setRispostaAperta] = useState(false);

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
                <span className="FAQ-title">FAQ</span>
                <p>Ecco le domande a noi solitamente più richieste. Nel caso non fossero abbastanza esaustive, avete la possibilità di contattarci utilizzando il form sottostante.</p>
                <div className="FAQ-item">
                    <div className="question" onClick = {() => apriRisposta("Domanda 1")} >Domanda 1</div>
                    {rispostaAperta === "Domanda 1" && <div className="answer">Risposta alla Domanda 1</div>}
                </div>
                <div className="FAQ-item">
                    <div className="question" onClick = {() => apriRisposta("Domanda 2")} >Domanda 2</div>
                    {rispostaAperta === "Domanda 2"&& <div className="answer">Risposta alla Domanda 1</div>}
                </div>
                <div className="FAQ-item">
                    <div className="question" onClick = {() => apriRisposta("Domanda 3")} >Domanda 3</div>
                    {rispostaAperta === "Domanda 3" && <div className="answer">Risposta alla Domanda 1</div>}
                </div>
                <div className="FAQ-item">
                    <div className="question" onClick = {() => apriRisposta("Domanda 4")} >Domanda 4</div>
                    {rispostaAperta === "Domanda 4" && <div className="answer">Risposta alla Domanda 1</div>}
                </div>
                <div className="FAQ-item">
                    <div className="question" onClick = {() => apriRisposta("Domanda 5")} >Domanda 5</div>
                    {rispostaAperta === "Domanda 5" && <div className="answer">Risposta alla Domanda 1</div>}
                </div>
                <div className="FAQ-item">
                    <div className="question" onClick = {() => apriRisposta("Domanda 6")} >Domanda 6</div>
                    {rispostaAperta === "Domanda 6" && <div className="answer">Risposta alla Domanda 1</div>}
                </div>
            </div>
            <div className="contattaci">
                <span className="contattaci-title">Contattaci</span>
                <p>Scrivici o contattaci per qualsiasi tipo di informazione. Saremo lieti di rispondere il prima possibile.</p>
                <div className="contattaci-section-block">
                    <div className="contattaci-section">
                        <div className="contattaci-contatti">
                            <span className="contattaci-titoletto">Contatti</span>
                            <p>Numero telefono: +39 XXX XXX XXXX</p>
                            <p>Email: lumiaarredamenti@lumiarr.com</p>
                        </div>
                        <div className="contattaci-dovesiamo">
                            <span className="contattaci-titoletto">Dove siamo</span>
                            <p>Via XXXXX N°31, Torino</p>
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
                            <label className="custom-file-upload">
                                <input className="input-file-upload" type="file"/>Carica file 
                                <FaUpload />
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