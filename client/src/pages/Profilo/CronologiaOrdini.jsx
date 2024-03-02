import React, { useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { auth } from "../../database/firebase"
import { doc, getDoc } from "firebase/firestore"
import db from "../../database/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import soggiorno from '../../assets/images/soggiorno.jpg'
import "../../styles/Profilo/CronologiaOrdini.css"
import emptyhistory from "../../assets/images/empty-history.png"


function CronologiaOrdini(){

    return(
        <div id="pagina-cronologia-ordini">
            <p className="page-info-title">CRONOLOGIA ORDINI</p>
            {false && (
                <div className="emptyhistory">
                    <img src={emptyhistory}></img>
                    <p>La tua cronologia degli ordini è vuota!</p>
                    <button className="btn-emptyhistory">Inizia con gli acquisti</button>
                </div>
            )}
            {true && (
                <div className="notemptyhistory">
                    <div className="singolo-acquisto">
                        <div className="immagine-prodotto-history">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="barra-verticale-history"/>
                        <div className="history">
                            <div className="history-informazione">
                                <div className="dataid-history">
                                    <p>Data ordine: 24/02/24</p>
                                    <p>Orario: 13:33</p>
                                    <p>ID ordine: Iv4DKmN3DSJN9</p>
                                </div>
                                <div className="prezzostatus-history">
                                    <p>Numero prodotti: </p>
                                    <p>Totale: 15€</p>
                                    <p>Status: Consegnato</p>
                                </div>
                            </div>
                            <div className="history-ricevuta">
                                <button className="btn-history-ricevuta">Stampa la ricevuta in PDF</button>
                                <button className="btn-history-feedback">Scrivici un feedback</button>
                            </div>
                        </div>
                    </div>
                    <div className="singolo-acquisto">
                        <div className="immagine-prodotto-history">
                            <img src={soggiorno} alt="icona-prodotto"></img>
                        </div>
                        <div className="barra-verticale-history"/>
                        <div className="history">
                            <div className="history-informazione">
                                <div className="dataid-history">
                                    <p>Data ordine: 24/02/24</p>
                                    <p>Orario: 13:33</p>
                                    <p>ID ordine: Iv4DKmN3DSJN9</p>
                                </div>
                                <div className="prezzostatus-history">
                                    <p>Numero prodotti: </p>
                                    <p>Totale: 15€</p>
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
            )}
        </div>
    )
}

export default CronologiaOrdini;