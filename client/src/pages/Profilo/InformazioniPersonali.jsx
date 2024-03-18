import React, { useEffect, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { auth } from "../../database/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import db from "../../database/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import "../../styles/Profilo/InformazioniPersonali.css"

function InformazioniPersonali(){
    const navigate = useNavigate();
    
    /*Informazioni dell'utente*/
    const [oggettoUtente, setOggettoUtente] = useState("");
    const [emailDB, setEmailUtente] = useState("");

    /*Mostrare il form quando l'utente vuole modificare i suoi dati*/
    const [formModificaDati, setFormModificaDati] = useState("inattivo"); //attivo o inattivo

    /*Dati utente ricavati dal form*/
    const [cognomeUtente, setCognome] = useState("");
    const [nomeUtente, setNome] = useState("");
    const [emailForm, setEmailForm] = useState("");
    const [nazioneUtente, setNazione] = useState("");
    const [provinciaUtente, setProvincia] = useState("");
    const [comuneUtente, setComune] = useState("");
    const [CAPUtente, setCAP] = useState("");
    const [indirizzoResidenzaUtente, setIndirizzoResidenza] = useState("");
    const [numeroCivicoUtente, setNumeroCivico] = useState("");
    const [numeroTelefonoUtente, setTelefono] = useState("");


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userUID = user.uid;
                setEmailUtente(user.email);
                const RiferimentoDocumentoUtente = doc(db, 'Utenti', userUID);
                const DocumentoUtente = await getDoc(RiferimentoDocumentoUtente);
    
                if (DocumentoUtente.exists()) {
                    setOggettoUtente(DocumentoUtente.data());
                } else {
                    navigate("/Login");
                }
            } else {
                navigate("/Login");
            }
        });
    
        // Ritorna una funzione di cleanup per disiscriversi quando il componente si smonta
        return () => unsubscribe();
    }, []);

    const mostraForm = (e) => {
        e.preventDefault();
        setFormModificaDati("attivo");
    }

    const AggiornaDati = async(e) => {
        e.preventDefault();
        const idUtente = auth.currentUser.uid;
        const RiferimentoDocumentoUtente = doc(db, 'Utenti', idUtente);
        const DocumentoUtente = await getDoc(RiferimentoDocumentoUtente);

        updateDoc(DocumentoUtente.ref, {
            nome: nomeUtente ? nomeUtente : oggettoUtente.nome,
            cognome: cognomeUtente ? cognomeUtente : oggettoUtente.cognome,
            email: emailForm ? emailForm : emailDB,
            ruolo: oggettoUtente.ruolo,
            Nazione: nazioneUtente ? nazioneUtente : oggettoUtente.Nazione,
            Provincia: provinciaUtente ? provinciaUtente : oggettoUtente.Provincia,
            Comune: comuneUtente ? comuneUtente : oggettoUtente.Comune,
            CAP: CAPUtente ? CAPUtente : oggettoUtente.CAP,
            IndirizzoResidenza: indirizzoResidenzaUtente ? indirizzoResidenzaUtente : oggettoUtente.IndirizzoResidenza,
            NumeroCivico: numeroCivicoUtente ? numeroCivicoUtente : oggettoUtente.NumeroCivico,
            numeroTelefono: numeroTelefonoUtente ? numeroTelefonoUtente : oggettoUtente.numeroTelefono,
        })
        nascondiForm(e);
    }

    const nascondiForm = (e) => {
        e.preventDefault();
        setFormModificaDati("inattivo");
    }

    
    return(
        <div id="pagina-informazioni-personali">
            <p className="page-info-title">INFORMAZIONI PERSONALI</p>
            {formModificaDati === "inattivo" && (
                    <>
                    <div className="container-informazioni">
                        <div className="informazioni-gruppo1">
                            <div className="informazione-personale">
                                <div className="informazione-specifica">
                                    <p>Nome:</p>
                                </div>
                                <div className="informazione-contenuto">
                                    <p>{oggettoUtente.nome} {oggettoUtente.cognome}</p>
                                </div>
                            </div>
                            <div className="informazione-personale">
                                <div className="informazione-specifica">
                                    <p>Email:</p>
                                </div>
                                <div className="informazione-contenuto">
                                    <p>{emailDB}</p>
                                </div>
                            </div>
                            <div className="informazione-personale">
                                <div className="informazione-specifica">
                                    <p>Telefono:</p>
                                </div>
                                <div className="informazione-contenuto">
                                    <p>+39 {oggettoUtente.numeroTelefono}</p>
                                </div>
                            </div>
                        </div>
                        <div className="informazioni-gruppo2">
                            <div className="informazione-personale">
                                <div className="informazione-specifica">
                                    <p>Nazione:</p>
                                </div>
                                <div className="informazione-contenuto">
                                    <p>{oggettoUtente.Nazione ? oggettoUtente.Nazione : nazioneUtente}</p>
                                </div>
                            </div>
                            <div className="informazione-personale">
                                <div className="informazione-specifica">
                                    <p>Provincia:</p>
                                </div>
                                <div className="informazione-contenuto">
                                    <p>{oggettoUtente.Provincia ? oggettoUtente.Provincia : provinciaUtente}</p>
                                </div>
                            </div>
                            <div className="informazione-personale">
                                <div className="informazione-specifica">
                                    <p>Comune:</p>
                                </div>
                                <div className="informazione-contenuto">
                                    <p>{oggettoUtente.Comune ? oggettoUtente.Comune : comuneUtente}</p>
                                </div>
                            </div>
                            <div className="informazione-personale">
                                <div className="informazione-specifica">
                                    <p>CAP:</p>
                                </div>
                                <div className="informazione-contenuto">
                                    {
                                        (oggettoUtente.CAP !== "") ? (
                                            <p>{oggettoUtente.CAP ? oggettoUtente.CAP : CAPUtente}</p>
                                        ) : (
                                            <p></p>
                                        )

                                    }
                                </div>
                            </div>
                            <div className="informazione-personale">
                                <div className="informazione-specifica">
                                    <p>Indirizzo:</p>
                                </div>
                                <div className="informazione-contenuto">
                                    <p>{oggettoUtente.IndirizzoResidenza ? oggettoUtente.IndirizzoResidenza : indirizzoResidenzaUtente} {oggettoUtente.NumeroCivico ? oggettoUtente.NumeroCivico : numeroCivicoUtente}</p>
                                </div>
                            </div>
                        </div>
                        <div className="modifica-informazioni-personali">
                            <button className="btn-modifica-informazioni-personali" onClick={(e) => mostraForm(e)}>Modifica</button>
                        </div>
                    </div>
                    </>
                )}

            {formModificaDati === "attivo" && (
                <>
                    <form className="form-profilo-modifica-dati" method="POST">
                        <div className="profilo-modifica-nome">
                            <div className="prf-modifica-nome">
                                <label htmlFor="first-name" className="label">Nome</label>
                                <input type="text" className="profilo-half-form" placeholder={oggettoUtente.nome} name="nome" onChange={(e) => setNome(e.target.value)} />
                            </div>
                            <div className="prf-modifica-cognome">
                                <label htmlFor="last-name">Cognome</label>
                                <input type="text" className="profilo-half-form" placeholder={oggettoUtente.cognome} name="cognome" onChange={(e) => setCognome(e.target.value)} />
                            </div>
                        </div>

                        <div className="profilo-email-input">
                            <label htmlFor="email" className="label">Email</label>
                            <input type="email" className="profilo-full-form" placeholder={emailDB} name="email" autoComplete="email" onChange={(e) => setEmailForm(e.target.value)} />
                        </div>

                        <div className="profilo-indirizzo-input1">
                            <div className="first-name-input">
                                <label htmlFor="first-name" className="label">Nazione</label>
                                <input type="text" className="profilo-half-form" placeholder={oggettoUtente.Nazione ? oggettoUtente.Nazione : "Nazione"} name="Nazione" onChange={(e) => setNazione(e.target.value)} />
                            </div>
                            <div className="prf-modifica-provincia">
                                <label htmlFor="last-name">Provincia</label>
                                <input type="text" className="profilo-half-form" placeholder={oggettoUtente.Provincia ? oggettoUtente.Provincia : "Provincia"} name="Provincia" onChange={(e) => setProvincia(e.target.value)} />
                            </div>
                        </div>
                        
                        <div className="profilo-indirizzo-input2">
                            <div className="first-name-input">
                                <label htmlFor="first-name" className="label">Comune</label>
                                <input type="text" className="profilo-half-form" placeholder={oggettoUtente.Comune ? oggettoUtente.Comune : "Comune"} name="Comune" onChange={(e) => setComune(e.target.value)} />
                            </div>
                            <div className="prf-modifica-CAP">
                                <label htmlFor="last-name">CAP</label>
                                <input type="text" className="profilo-half-form" placeholder={oggettoUtente.CAP ? oggettoUtente.CAP : "CAP"} name="CAP" onChange={(e) => setCAP(e.target.value)} />
                            </div>
                        </div>

                        <div className="profilo-indirizzo-input3">
                            <div className="first-name-input">
                                <label htmlFor="first-name" className="label">Indirizzo residenza</label>
                                <input type="text" className="profilo-half-form" placeholder={oggettoUtente.IndirizzoResidenza ? oggettoUtente.IndirizzoResidenza : "Indirizzo residenza"} name="first-name" onChange={(e) => setIndirizzoResidenza(e.target.value)} />
                            </div>
                            <div className="prf-modifica-numcivico">
                                <label htmlFor="last-name">Numero civico</label>
                                <input type="text" className="profilo-half-form" placeholder={oggettoUtente.numeroCivico ? oggettoUtente.numeroCivico : "Numero civico"} name="last-name" onChange={(e) => setNumeroCivico(e.target.value)}/>
                            </div>
                        </div>

                        <div className="profilo-modifica-numero">
                            <label className="label-dashpage">Numero di telefono: </label>
                            <input type="text" className="profilo-full-form" placeholder={oggettoUtente.numeroTelefono ? oggettoUtente.numeroTelefono : "0000000000"} autoComplete="Nome prodotto" onChange={(e) => setTelefono(e.target.value)} />
                        </div>
                    </form>
                    <div className="mostra-informazioni-personali">
                        <button className="btn-mostra-informazioni-personali" onClick={(e) => AggiornaDati(e)}>Aggiorna</button>
                    </div>
                </>
            )}
            
        </div>
    )
}

export default InformazioniPersonali;