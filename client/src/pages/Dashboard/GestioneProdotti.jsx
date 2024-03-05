import React, { useState, useEffect, useRef } from "react"
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { auth } from "../../database/firebase"
import { doc, getDoc, getDocs, setDoc, collection, query, where, getFirestore, addDoc } from "firebase/firestore"
import db from "../../database/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { FaUpload } from "react-icons/fa6"
import "../../styles/Dashboard/GestioneProdotti.css"



function GestioneProdotti(){
    const navigate = useNavigate();
    const location = useLocation();

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
    const inserimentoProdottoRef = useRef(); /*Riferimento all'elemento nel DOM in modo da resettare gli input*/


    useEffect(() => {
        /*Teletrasporto l'utente all'inizio della pagina appena viene fatto il rendering*/
        window.scrollTo(0, 0);

        /*Caricamento delle categorie*/
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

    /*Funzione per l'aggiunta di un prodotto*/
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
            Immagine: "https://firebasestorage.googleapis.com/v0/b/lumia-arredamenti.appspot.com/o/ImmaginiProdotti%2Fsoggiorno.jpg?alt=media&token=cb742ae8-1ae7-40a5-87b4-64e96872d62b",
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
        <div id="pagina-gestione-prodotti">
            <div className="gestione-prodotti-title-container">
            <p className="gestione-prodotti-title">GESTIONE PRODOTTI</p>
            </div>
            <div className="container-gestione">
            
            {/*INSERISCI PRODOTTO - FORM PER INSERIRE UN NUOVO PRODOTTO*/}
            <form className="form-gestione-inserisci-prodotto" method="POST" ref={inserimentoProdottoRef}>
                <span className="titolo-form">Inserisci prodotto</span>

                <div className="container-form-inserisci-prodotto">
                    <div className="compila-form-inserisci-prodotto">
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
                            <input className="custom-file-upload-upload" type="file"/>
                            <FaUpload className="upload-icon"/>
                        </label>
                    </div>
                    <div className="divisore-inserisci-prodotto"/>
                    <button className="submit-gestione-prodotti1" onClick={(e) => AggiungiProdotto(e)}>Inserisci prodotto</button>
                </div>
            </form>

            {/*ELIMINA PRODOTTO - FORM PER CANCELLARE UN PRECISO PRODOTTO*/}
            <form className="form-gestione-elimina-prodotto" method="POST">
                <span className="titolo-form">Elimina prodotto</span>
                <div className="id-elimina-prodotto">
                    <label className="label-dashpage">Inserisci l'ID del prodotto: </label>
                    <input type="number" className="prodotti-input-form" placeholder="Profondità prodotto: cm" autoComplete="0" onChange={(e) => setProfonditaProdotto(e.target.value)} required/>
                </div>
                <div className="divisore-elimina-prodotto"/>
                <button className="submit-gestione-prodotti2">Elimina prodotto</button>
            </form>
            

            </div>
      </div>
    )
}

export default GestioneProdotti;