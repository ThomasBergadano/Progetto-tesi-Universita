import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from 'react-router-dom'
import { auth } from "../database/firebase"
import { doc, getDoc, getDocs, setDoc, collection, query, where, getFirestore, addDoc } from "firebase/firestore"
import db from "../database/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { FaUpload } from "react-icons/fa6"
import "../styles/DashboardPage.css"

function Dashboard() {
    const navigate = useNavigate();
    /*Array per il caricamento di categorie e sottocategorie*/
    const [categorie, setCategorie] = useState([]);
    const [sottocategorie, setSottoCategorie] = useState([]);

    /*Costanti per inserimento prodotti*/
    const [categoriaProdotto, setCategoriaProdotto] = useState("");
    const [sottocategoriaProdotto, setSottoCategoriaProdotto] = useState("");
    const [nomeProdotto, setNomeProdotto] = useState("");
    const [nomeSet, setNomeSet] = useState("");
    const [descrizioneProdotto, setDescrizioneProdotto] = useState("");
    const [prezzoProdotto, setPrezzoProdotto] = useState("");
    const [quantitaProdotto, setQuantitaProdotto] = useState("");
    const [altezzaProdotto, setAltezzaProdotto] = useState("");
    const [lunghezzaProdotto, setLunghezzaProdotto] = useState("");
    const [profonditaProdotto, setProfonditaProdotto] = useState("");
    const [coloreProdotto, setColoreProdotto] = useState("");
    const inserimentoProdottoRef = useRef(null); /*Riferimento all'elemento nel DOM in modo da resettare gli input*/


    /*Gestione autorizzazone e permessi per accesso in /Dashboard*/
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if(user) {
              const userUID = user.uid;
              const RiferimentoDocumentoUtente = await doc(db, 'Utenti', userUID);
              const DocumentoUtente = await getDoc(RiferimentoDocumentoUtente);
              
              if(DocumentoUtente.exists()){
                const ruoloUtente = DocumentoUtente.data().ruolo;
                if(ruoloUtente!=="Admin"){
                    navigate("/");
                }
              }
              else{
                console.log("L'utente che prova ad accedere in Dashboard non esiste");
                navigate("/");
              }
            }
            else {
                console.log("L'utente che prova ad accedere in Dashboard non è autenticato");
                navigate("/");
            }
        });
    }, []);

    /*Caricamento delle categorie*/
    useEffect(() => {
        const fetchCategorie = async () => {
            const RiferimentoRaccoltaCategoria = collection(db, 'Categoria');
            const categorieSnapshot = await getDocs(RiferimentoRaccoltaCategoria);

            const arrayCategorie = [];
            for(const categorieDoc of categorieSnapshot.docs){
                arrayCategorie.push(categorieDoc.data().NomeCategoria);
            }

            setCategorie(arrayCategorie);
        };

        fetchCategorie();
    }, []);

    /*Caricamento delle sottocategorie a runtime in base alla categoria selezionata*/
    const handlerCambioCategoria = async (e) => {
        setCategoriaProdotto(e.target.value); 
        
        const RiferimentoRaccoltaCategoria = collection(db, 'Categoria');
        const queryGetCategoria = query(RiferimentoRaccoltaCategoria, where('NomeCategoria', '==', e.target.value));
        const categorieSnapshot = await getDocs(queryGetCategoria);
        const arraySottocategorie = [];

        for(const categoriaDoc of categorieSnapshot.docs){ /*Tanto ne esisterà soltanto 1*/
            const RiferimentoRaccoltaSottoCategoria = collection(categoriaDoc.ref, "SottoCategoria");
            const sottoCategoriaSnapshot = await getDocs(RiferimentoRaccoltaSottoCategoria);

            for(const sottocategoriaDoc of sottoCategoriaSnapshot.docs){ /*Se in futuro non funziona, usare la forEach*/
                arraySottocategorie.push(sottocategoriaDoc.data().NomeSottoCategoria);
            }
        }

        setSottoCategorie(arraySottocategorie);
        console.log(arraySottocategorie);
    }

    /*Firestore: FUNZIONI DI INSERIMENTO*/
    const AggiungiProdotto = async(e) => {
        e.preventDefault();

        /*Identifico documento Categoria in cui inserire il nuovo documento*/
        const RiferimentoRaccoltaCategoria = collection(db, 'Categoria');
        const queryGetCategoria = query(RiferimentoRaccoltaCategoria, where('NomeCategoria', '==', categoriaProdotto));
        const categorieSnapshot = await getDocs(queryGetCategoria);

        const categoriaDoc = categorieSnapshot.docs[0];
        const infoDocumentoCategoria = categoriaDoc.data();
        console.log("ID della Categoria ottenuta: ", categoriaDoc.id);
        console.log("NomeCategoria ottenuto: ", infoDocumentoCategoria.NomeCategoria);

        /*Identifico documento SottoCategoria in cui inserire il nuovo documento*/
        const RiferimentoRaccoltaSottoCategoria = collection(categoriaDoc.ref, 'SottoCategoria');
        const queryGetSottoCategoria = query(RiferimentoRaccoltaSottoCategoria, where('NomeSottoCategoria', '==', sottocategoriaProdotto));
        const sottoCategorieSnapshot = await getDocs(queryGetSottoCategoria);

        const sottoCategoriaDoc = sottoCategorieSnapshot.docs[0];
        const infoDocumentoSottoCategoria = sottoCategoriaDoc.data();
        console.log("ID della Categoria ottenuta: ", sottoCategoriaDoc.id);
        console.log("NomeCategoria ottenuto: ", infoDocumentoSottoCategoria.NomeSottoCategoria);

        /*Ottengo riferimento alla raccolta Prodotti e INSERIMENTO*/
        const RiferimentoRaccoltaProdotti = collection(sottoCategoriaDoc.ref, 'Prodotti');

            /*Controllo se esiste già un prodotto con quel nome*/
        const queryEsisteProdotto = query(RiferimentoRaccoltaProdotti, where('NomeProdotto', '==', nomeProdotto));
        const prodottiEsistentiSnapshot = await getDocs(queryEsisteProdotto);

        if(!prodottiEsistentiSnapshot.empty){
            console.log("Esiste già un prodotto con lo stesso nome");
            return;
        }

        const ProdottoDoc = await addDoc(RiferimentoRaccoltaProdotti, {
            NomeProdotto: nomeProdotto,
            NomeSet: nomeSet || "",
            Descrizione: descrizioneProdotto,
            Prezzo: parseFloat(prezzoProdotto),
            Quantita: parseInt(quantitaProdotto),
            Altezza: parseFloat(altezzaProdotto),
            Lunghezza: parseFloat(lunghezzaProdotto),
            Profondita: parseFloat(profonditaProdotto),
            Colore: coloreProdotto,
            Immagine: "www",
        });
        
        setNomeProdotto("");
        setNomeSet("");
        setDescrizioneProdotto("");
        setPrezzoProdotto(0);
        setQuantitaProdotto(0);
        setAltezzaProdotto(0);
        setLunghezzaProdotto(0);
        setProfonditaProdotto(0);
        setColoreProdotto("");
        inserimentoProdottoRef.current.reset(); /*Resetto i campi input appena compilati*/

        console.log("Prodotto appena creato: ", ProdottoDoc.id);
    }


    return(
        <div id="dashboardpage">
            <div id="gestione-utenti">
                <label type="text" className="label-gestione">GESTIONE UTENTI</label>
                <form className="form-gestione-utenti aggiorna-ruolo" method="POST">
                    <span className="titolo-form">Cambia ruolo</span>
                    <div className="email-aggiorna-ruolo">
                        <label className="label-dashpage">Scrivi l'email dell'utente: </label>
                        <input type="email" className="dashboard-input-form" placeholder="Email" autoComplete="email" onChange={null}/>
                    </div>
                    <div className="ruolo-aggiorna-ruolo">
                        <label className="label-dashpage">Scegli il ruolo: </label>
                        <select className="select-aggiorna-ruolo" name="userType" defaultValue="User">
                            <option value="Admin">Admin</option>
                            <option value="Employee">Employee</option>
                            <option value="Client">Client</option>
                            <option value="User">User</option>
                        </select>
                    </div>
                    <div className="divisore-aggiorna-ruolo"/>
                    <button className="submit-dashboard sub-1">Aggiorna ruolo</button>
                </form>
            </div>

            <div id="gestione-prodotti">
                <label type="text" className="label-gestione">GESTIONE PRODOTTI</label>
                <form className="form-gestione-inserisci-prodotto" method="POST" ref={inserimentoProdottoRef}>
                    <span className="titolo-form">Inserisci prodotto</span>

                    <div className="container-form-inserisci-prodotto">
                        <div className="inserisci-prodotto-colonna-sx">
                            <div className="categoria-inserisci-prodotto">
                                <label className="label-dashpage">Scegli la categoria del prodotto: </label>
                                <select className="select-categoria" name="categoria" value={categoriaProdotto} onChange={(e) => handlerCambioCategoria(e)}>
                                    <option value="">Seleziona un elemento</option>
                                    {categorie.map((categoria, index) => (
                                        <option key={index} value={categoria}>{categoria}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="sottocategoria-inserisci-prodotto">
                                <label className="label-dashpage">Scegli la sottocategoria del prodotto: </label>
                                <select className="select-sottocategoria" name="sottocategoria" value={sottocategoriaProdotto} onChange={(e) => setSottoCategoriaProdotto(e.target.value)}>
                                    <option value="">Seleziona un elemento</option>
                                    {sottocategorie.map((sottocategoria, index) => (
                                        <option key={index} value={sottocategoria}>{sottocategoria}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="nomeprodotto-inserisci-prodotto">
                                <label className="label-dashpage">Inserisci il nome del prodotto: </label>
                                <input type="text" className="prodotti-input-form" placeholder="Nome prodotto" autoComplete="Nome prodotto" onChange={(e) => setNomeProdotto(e.target.value)} required/>
                            </div>
                            <div className="nomeset-inserisci-prodotto">
                                <label className="label-dashpage">Inserisci, se esiste, il set del prodotto: </label>
                                <input type="text" className="prodotti-input-form" placeholder="Set prodotto" autoComplete="Set prodotto" onChange={(e) => setNomeSet(e.target.value)} required/>
                            </div>
                            <div className="colore-inserisci-prodotto">
                                <label className="label-dashpage">Seleziona il colore primario: </label>
                                <select className="select-colore" name="colore" defaultValue="Rosso" onChange={(e) => setColoreProdotto(e.target.value)} required>
                                    <option value="Rosso">Rosso</option>
                                    <option value="Marrone">Marrone</option>
                                    <option value="Arancione">Arancione</option>
                                    <option value="Giallo">Giallo</option>
                                    <option value="Verde">Verde</option>
                                    <option value="Azzurro">Azzurro</option>
                                    <option value="Blu">Blu</option>
                                    <option value="Viola">Viola</option>
                                    <option value="Rosa">Rosa</option>
                                    <option value="Grigio">Grigio</option>
                                    <option value="Bianco">Bianco</option>
                                    <option value="Nero">Nero</option>
                                </select>
                            </div>
                            <div className="descrizione-inserisci-prodotto">
                                <label className="label-dashpage">Inserisci una descrizione del prodotto: </label>
                                <textarea className="descrizione-textarea prodotti-input-form" placeholder="Inserisci il tuo messaggio qui" onChange={(e) => setDescrizioneProdotto(e.target.value)} required></textarea>
                            </div>
                        </div>
                        <div className="inserisci-prodotto-colonna-dx">
                            <div className="prezzo-inserisci-prodotto">
                                <label className="label-dashpage">Inserisci il prezzo del prodotto: </label>
                                <input type="number" className="prodotti-input-form" placeholder="Prezzo prodotto: €" autoComplete="0" onChange={(e) => setPrezzoProdotto(e.target.value)} required/>
                            </div>
                            <div className="quantita-inserisci-prodotto">
                                <label className="label-dashpage">Inserisci la quantità del prodotto (pz.): </label>
                                <input type="number" className="prodotti-input-form" placeholder="Quantità prodotto: QTY" autoComplete="0" onChange={(e) => setQuantitaProdotto(e.target.value)} required/>
                            </div>
                            <div className="altezza-inserisci-prodotto">
                                <label className="label-dashpage">Inserisci l'altezza del prodotto (in cm): </label>
                                <input type="number" className="prodotti-input-form" placeholder="Altezza prodotto: cm" autoComplete="0" onChange={(e) => setAltezzaProdotto(e.target.value)} required/>
                            </div>
                            <div className="lunghezza-inserisci-prodotto">
                                <label className="label-dashpage">Inserisci la lunghezza del prodotto (in cm): </label>
                                <input type="number" className="prodotti-input-form" placeholder="Lunghezza prodotto: cm" autoComplete="0" onChange={(e) => setLunghezzaProdotto(e.target.value)} required/>
                            </div>
                            <div className="profondita-inserisci-prodotto">
                                <label className="label-dashpage">Inserisci la profondita del prodotto (in cm): </label>
                                <input type="number" className="prodotti-input-form" placeholder="Profondità prodotto: cm" autoComplete="0" onChange={(e) => setProfonditaProdotto(e.target.value)} required/>
                            </div>
                            <label className="custom-file-upload">
                                <input className="input-file-upload" type="file"/><span>Carica immagine</span>
                                <FaUpload />
                            </label>
                        </div>
                        <div className="divisore-inserisci-prodotto"/>
                        <button className="submit-dashboard sub-2" onClick={(e) => AggiungiProdotto(e)}>Inserisci prodotto</button>
                    </div>
                </form>

                <form className="form-gestione-elimina-prodotto" method="POST">
                    <span className="titolo-form">Elimina prodotto</span>
                    <div className="email-aggiorna-ruolo">
                        <label className="label-dashpage">Scrivi l'email dell'utente: </label>
                        <input type="email" className="jbjmhb" placeholder="Email" autoComplete="email" onChange={null}/>
                    </div>
                    <div className="ruolo-aggiorna-ruolo">
                        <label className="label-dashpage">Scegli il ruolo: </label>
                        <select className="select-aggiorna-ruolo" name="userType" defaultValue="User">
                            <option value="Admin">Admin</option>
                            <option value="Employee">Employee</option>
                            <option value="Client">Client</option>
                            <option value="User">User</option>
                        </select>
                    </div>
                    <div className="divisore-elimina-prodotto"/>
                    <button className="submit-dashboard sub-3">Elimina prodotto</button>
                </form>
            </div>
        </div>
    )
}

export default Dashboard;