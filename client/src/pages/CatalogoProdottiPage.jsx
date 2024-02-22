import React, { useState, useEffect }  from "react"
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc, getDocs, setDoc, collection, query, where, getFirestore, addDoc } from "firebase/firestore"
import db from "../database/firebase"
import { FaRegHeart } from "react-icons/fa6"
import { FiShoppingCart } from "react-icons/fi"
import FilterFloatingButton from "../components/FilterFloatingButton"
import "../styles/CatalogoProdottiPage.css"
import soggiorno from '../assets/images/soggiorno.jpg'

function CatalogoProdotti() {
    const navigate = useNavigate();
    
    /*Caricamento dei prodotti*/
    const [showButton, setShowButton] = useState(false); //useState(true);
    const [numeroProdotti, setNumeroProdotti] = useState(0);
    const [prodotti, setProdotti] = useState([]); /*Array di prodotti*/
    const [prodottiVisualizzati, setProdottiVisualizzati] = useState(16);

    /*Array per il caricamento di categorie e sottocategorie*/
    const [categorie, setCategorie] = useState([]);
    const [sottocategorie, setSottoCategorie] = useState([]);

    /*Ordinamento dei prodotti*/
    const [opzioneOrdinamento, setOpzioneOrdinamento] = useState("default"); /*per la select dell'ordinamento*/

    /*Filtro dei prodotti*/
    const [filtro, setFiltro] = useState({
        nomeFiltrato: "",
        categoriaFiltrata: "all",
        sottoCategoriaFiltrata: "all",
        prezzoMinimo: "",
        prezzoMassimo: "",
        colore: "all",
        altezzaMinima: "",
        altezzaMassima: "",
        lunghezzaMinima: "",
        lunghezzaMassima: "",
        larghezzaMinima: "",
        larghezzaMassima: "",
    });


    useEffect(() => {
        /*Caricamento di tutti i prodotti durante il rendering di /CatalogoProdotti*/
        const uploadProducts = async() => {
            const prodottiArray = [];
            /*Ottengo riferimento alla raccolta Categoria*/
            const RiferimentoRaccoltaCategoria = collection(db, 'Categoria');
            const snapshotCategorie = await getDocs(RiferimentoRaccoltaCategoria);
            for(const categoriaDoc of snapshotCategorie.docs){

                /*Ottengo riferimento alla raccolta Sottocategoria*/
                const RiferimentoRaccoltaSottoCategoria = collection(categoriaDoc.ref, "SottoCategoria");
                const snapshotSottoCategorie = await getDocs(RiferimentoRaccoltaSottoCategoria);
                for(const sottocategoriaDoc of snapshotSottoCategorie.docs){

                    /*Ottengo riferimento alla raccolta Prodotti e inserisco nell'array*/
                    const RiferimentoRaccoltaProdotti = collection(sottocategoriaDoc.ref, "Prodotti");
                    const snapshotProdotti = await getDocs(RiferimentoRaccoltaProdotti);
                    if(snapshotProdotti.docs.length > 0){
                        for (const prodottoDoc of snapshotProdotti.docs) {

                            /*Voglio inserire nell'array sia l'id del documento che i campi del prodotto*/
                            const datiProdotto = prodottoDoc.data();
                            const prodottoConId = { id: prodottoDoc.id, ...datiProdotto }
                            prodottiArray.push(prodottoConId);
                        }
                    }
                }
            }

            setProdotti(prodottiArray);
            setNumeroProdotti(prodottiArray.length);
            console.log(prodottiArray);
        }
        uploadProducts();

        
        /*Caricamento delle categorie*/
        const fetchCategorie = async () => {
            const RiferimentoRaccoltaCategoria = collection(db, 'Categoria');
            const snapshotCategorie = await getDocs(RiferimentoRaccoltaCategoria);

            const arrayCategorie = [];
            for(const categorieDoc of snapshotCategorie.docs){
                arrayCategorie.push(categorieDoc.data().NomeCategoria);
            }

            setCategorie(arrayCategorie);
        }
        fetchCategorie();


        /*Gestione per l'apparizione del floating button per il filtro*/
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            /*const headerHeight = 0;*/
            const headerHeight = 151;
            const bottomThreshold = document.documentElement.scrollHeight - 300;
    
            const footer = document.querySelector('footer'); /*ottengo l'elemento del 'footer' dal CSS*/
            const footerTop = footer.getBoundingClientRect().top; /*ottengo altezza del borso superiore del footer*/
            const distanceToFooter = footerTop - window.innerHeight; /*Calcolo distanza tra footer e bordo inferiore della finestra visualizzata*/

            if (scrollPosition >= headerHeight && scrollPosition < bottomThreshold && distanceToFooter>0) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    /*Effetto del floating button filter per scrollare in cima alla pagina*/
    const scrollToTop = () => {
        const scrollDuration = 500;
        const scrollStep = -window.scrollY / (scrollDuration / 15);
        
        const scrollInterval = setInterval(() => {
            if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep);
            } else {
            clearInterval(scrollInterval);
            }
        }, 15);
    };
    
    /*Mostra altri 20 prodotti ogni volta che si preme il bottone "Mostra altri prodotti"*/
    const mostraAltriProdotti = async() => {
        setProdottiVisualizzati(prev => prev+20);
    }



    /* ----- ORDINAMENTO PRODOTTI ----- */
    const handlerOrdinamentoProdotti = async (e) => {
        setOpzioneOrdinamento(e.target.value);

        const prodottiOrdinati = [...prodotti]; /*Ordinamento su un array di copia*/

        if(e.target.value === "nome crescente"){
            prodottiOrdinati.sort((a,b) => a.NomeProdotto.localeCompare(b.NomeProdotto));
        }
        else if(e.target.value === "nome decrescente"){
            prodottiOrdinati.sort((b,a) => a.NomeProdotto.localeCompare(b.NomeProdotto)); /*b>a*/
        }
        else if(e.target.value === "prezzo crescente"){
            prodottiOrdinati.sort((a, b) => a.Prezzo - b.Prezzo);
        }
        else if(e.target.value === "prezzo decrescente"){
            prodottiOrdinati.sort((a,b) => b.Prezzo - a.Prezzo);
        }
        setProdotti(prodottiOrdinati);
    }



    /* ----- FILTRO PRODOTTI ----- */
    /* Aggiornamento dello stato delle opzioni del filtro*/
    const handlerFiltroNome = async (e) => {
        setFiltro({...filtro, nomeFiltrato: e.target.value});
    }
    const handlerFiltroCategoria = async (e) => {
        setFiltro({...filtro, categoriaFiltrata: e.target.value});

        /*Carico intanto l'array delle sottocategorie ogni volta che scelto una categoria*/
        const RiferimentoRaccoltaCategoria = collection(db, 'Categoria');
        const queryGetCategorie = query(RiferimentoRaccoltaCategoria, where('NomeCategoria', '==', e.target.value));
        const snapshotCategorie = await getDocs(queryGetCategorie);
        const arraySottocategorie = [];

        for(const categoriaDoc of snapshotCategorie.docs){ /*Tanto ne esisterà soltanto 1*/
            const RiferimentoRaccoltaSottoCategoria = collection(categoriaDoc.ref, "SottoCategoria");
            const sottoCategoriaSnapshot = await getDocs(RiferimentoRaccoltaSottoCategoria);

            for(const sottocategoriaDoc of sottoCategoriaSnapshot.docs){
                arraySottocategorie.push(sottocategoriaDoc.data().NomeSottoCategoria);
            }
        }
        setSottoCategorie(arraySottocategorie);
    }
    const handlerFiltroSottoCategoria = async (e) => {
        setFiltro({...filtro, sottoCategoriaFiltrata: e.target.value});
    }
    const handlerFiltroPrezzoMinimo= async (e) => {
        setFiltro({...filtro, prezzoMinimo: e.target.value});
    }
    const handlerFiltroPrezzoMassimo = async (e) => {
        setFiltro({...filtro, prezzoMassimo: e.target.value});
    }
    const handlerFiltroColore = async (e) => {
        setFiltro({...filtro, colore: e.target.value});
    }
    const handlerFiltroAltezzaMinima = async (e) => {
        setFiltro({...filtro, altezzaMinima: e.target.value});
    }
    const handlerFiltroAltezzaMassima = async (e) => {
        setFiltro({...filtro, altezzaMassima: e.target.value});
    }
    const handlerFiltroLunghezzaMinima = async (e) => {
        setFiltro({...filtro, lunghezzaMinima: e.target.value});
    }
    const handlerFiltroLunghezzaMassima = async (e) => {
        setFiltro({...filtro, lunghezzaMassima: e.target.value});
    }
    const handlerFiltroLarghezzaMinima = async (e) => {
        setFiltro({...filtro, larghezzaMinima: e.target.value});
    }
    const handlerFiltroLarghezzaMassima = async (e) => {
        setFiltro({...filtro, larghezzaMassima: e.target.value});
    }

    const handlerFiltro = async (e) => {
        e.preventDefault();

        const RiferimentoRaccoltaCategoria = collection(db, 'Categoria');
        let prodottiArray = [];
        let snapshotCategorie = null;
        let queryGetCategorie = null;
        let categoriaDoc = null;
        let RiferimentoRaccoltaSottoCategoria = null;
        let snapshotSottoCategorie = null;
        let queryGetSottoCategorie = null;

        /*Gestione della categoria e sottocategoria*/
        if(filtro.categoriaFiltrata === "all"){ //Prendo tutte le categorie -> tutti i prodotti
            snapshotCategorie = await getDocs(RiferimentoRaccoltaCategoria);

            for(const categoriaDoc of snapshotCategorie.docs){
                /*Ottengo riferimento ad ogni raccolta Sottocategoria*/
                const RiferimentoRaccoltaSottoCategoria = collection(categoriaDoc.ref, "SottoCategoria");
                const snapshotSottoCategorie = await getDocs(RiferimentoRaccoltaSottoCategoria);
                for(const sottocategoriaDoc of snapshotSottoCategorie.docs){

                    /*Ottengo riferimento alla raccolta Prodotti e inserisco nell'array*/
                    const RiferimentoRaccoltaProdotti = collection(sottocategoriaDoc.ref, "Prodotti");
                    const snapshotProdotti = await getDocs(RiferimentoRaccoltaProdotti);
                    if (snapshotProdotti.docs.length > 0) {
                        for (const prodottoDoc of snapshotProdotti.docs) {
                            prodottiArray.push(prodottoDoc.data());
                        }
                    }
                }
            }
        }
        if(filtro.categoriaFiltrata !== "all"){ //Prendo solo la categoria selezionata
            console.log("non all");
            queryGetCategorie = query(RiferimentoRaccoltaCategoria, where('NomeCategoria', '==', filtro.categoriaFiltrata));
            snapshotCategorie = await getDocs(queryGetCategorie);
            categoriaDoc = snapshotCategorie.docs[0];
            console.log(categoriaDoc.data().NomeCategoria);

            /*Gestione delle sottocategorie*/
            if(filtro.sottoCategoriaFiltrata === "all"){
                RiferimentoRaccoltaSottoCategoria = collection(categoriaDoc.ref, 'SottoCategoria');
                snapshotSottoCategorie = await getDocs(RiferimentoRaccoltaSottoCategoria);
                console.log("Dimensione snapshotsottoCategorie: ", snapshotSottoCategorie.size);
            }
            if(filtro.sottoCategoriaFiltrata !== "all"){
                RiferimentoRaccoltaSottoCategoria = collection(categoriaDoc.ref, 'SottoCategoria');
                queryGetSottoCategorie = query(RiferimentoRaccoltaSottoCategoria, where('NomeSottoCategoria', '==', filtro.sottoCategoriaFiltrata));
                snapshotSottoCategorie = await getDocs(queryGetSottoCategorie);
            }
            console.log("Dimensione snapshotsottoCategorie: ", snapshotSottoCategorie.size);
            for(const sottocategoriaDoc of snapshotSottoCategorie.docs){
                /*Ottengo riferimento alla raccolta Prodotti e inserisco nell'array*/
                const RiferimentoRaccoltaProdotti = collection(sottocategoriaDoc.ref, "Prodotti");
                const snapshotProdotti = await getDocs(RiferimentoRaccoltaProdotti);
                if (snapshotProdotti.docs.length > 0) {
                    for (const prodottoDoc of snapshotProdotti.docs) {
                        prodottiArray.push(prodottoDoc.data());
                    }
                }
            }
        }
        
        /*Filtro del nome*/
        if(filtro.nomeFiltrato !== ""){
            prodottiArray = prodottiArray.filter((prodotto) => prodotto.NomeProdotto.toLowerCase().includes(filtro.nomeFiltrato));
        }

        /*Filtro dei prezzi*/
        if(filtro.prezzoMinimo !== ""){
            prodottiArray = prodottiArray.filter((prodotto) => parseFloat(filtro.prezzoMinimo) <= prodotto.Prezzo);
        }
        if(filtro.prezzoMassimo !== ""){
            prodottiArray = prodottiArray.filter((prodotto) => parseFloat(filtro.prezzoMassimo) >= prodotto.Prezzo);
        }

        /*Filtro del colore*/
        if(filtro.colore !== "all"){
            prodottiArray = prodottiArray.filter((prodotto) => filtro.colore.toLowerCase() === prodotto.Colore.toLowerCase());
        }

        /*Filtro dell'altezza*/
        if(filtro.altezzaMinima !== ""){
            prodottiArray = prodottiArray.filter((prodotto) => parseFloat(filtro.altezzaMinima) <= prodotto.Altezza);
        }
        if(filtro.altezzaMassima !== ""){
            prodottiArray = prodottiArray.filter((prodotto) => parseFloat(filtro.altezzaMassima) >= prodotto.Prezzo);
        }

        /*Filtro della lunghezza*/
        if(filtro.lunghezzaMinima !== ""){
            prodottiArray = prodottiArray.filter((prodotto) => parseFloat(filtro.altezzaMinima) <= prodotto.Altezza);
        }
        if(filtro.lunghezzaMassima !== ""){
            prodottiArray = prodottiArray.filter((prodotto) => parseFloat(filtro.altezzaMassima) >= prodotto.Prezzo);
        }

        /*Filtro della profondità/larghezza*/
        if(filtro.larghezzaMinima !== ""){
            prodottiArray = prodottiArray.filter((prodotto) => parseFloat(filtro.larghezzaMinima) <= prodotto.Altezza);
        }
        if(filtro.larghezzaMassima !== ""){
            prodottiArray = prodottiArray.filter((prodotto) => parseFloat(filtro.larghezzaMassima) >= prodotto.Prezzo);
        }


        setProdotti(prodottiArray);
        setNumeroProdotti(prodottiArray.length);
    }


    return(
        <div id="catalogo">
            <div id="filter">
                <div className="filter-ricerca">
                    <div className="filtro-superiore">
                        <div className="nomeprodotto-cercaprodotto">
                            <label className="label-filter">Nome prodotto </label>
                            <input type="text" placeholder="Nome prodotto" autoComplete="Nome" onChange={(e) => handlerFiltroNome(e)}/>
                        </div>
                        <div className="categoria-cercaprodotto">
                            <label className="label-filter">Categoria </label>
                            <select name="categoria" onChange={(e) => handlerFiltroCategoria(e)}>
                                <option value="all">Tutte le categorie</option>
                                {categorie.map((categoria, index) => (
                                    <option key={index} value={categoria}>{categoria}</option>
                                ))}
                            </select>
                        </div>
                        <div className="sottocategoria-cercaprodotto">
                            <label className="label-filter">Sottocategoria</label>
                            <select name="sottocategoria" onChange={(e) => handlerFiltroSottoCategoria(e)}>
                                <option value="all">Tutte le sottocategorie</option>
                                {sottocategorie.map((sottocategoria, index) => (
                                    <option key={index} value={sottocategoria}>{sottocategoria}</option>
                                ))}
                                
                            </select>
                        </div>
                        <div className="prezzo-cercaprodotto">
                            <label className="label-filter">Prezzo (min/max) </label>
                            <div className="input-in-riga">
                                <input type="text" placeholder="Min €" autoComplete="0" onChange={(e) => handlerFiltroPrezzoMinimo(e)}/>
                                <input type="text" placeholder="Max €" autoComplete="200" onChange={(e) => handlerFiltroPrezzoMassimo(e)}/>
                            </div>
                        </div>
                    </div>
                    <div className="filtro-inferiore">
                        <div className="colore-cercaprodotto">
                            <label className="label-filter">Colore </label>
                            <select className="select-colore" name="colore" defaultValue="all" onChange={(e) => handlerFiltroColore(e)}>
                                    <option value="all">Tutti i colori</option>
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
                        <div className="altezza-cercaprodotto">
                            <label className="label-filter">Altezza (min/max) </label>
                            <div className="input-in-riga">
                                <input type="text" placeholder="Min (cm)" autoComplete="0" onChange={(e) => handlerFiltroAltezzaMinima(e)}/>
                                <input type="text" placeholder="Max (cm)" autoComplete="200" onChange={(e) => handlerFiltroAltezzaMassima(e)}/>
                            </div>
                        </div>
                        <div className="lunghezza-cercaprodotto">
                            <label className="label-filter">Lunghezza (min/max) </label>
                            <div className="input-in-riga">
                                <input type="text" placeholder="Min (cm)" autoComplete="0" onChange={(e) => handlerFiltroLunghezzaMinima(e)}/>
                                <input type="text" placeholder="Max (cm)" autoComplete="200" onChange={(e) => handlerFiltroLunghezzaMassima(e)}/>
                            </div>
                        </div>
                        <div className="profondita-cercaprodotto">
                            <label className="label-filter">Profondita (min/max) </label>
                            <div className="input-in-riga">
                                <input type="text" placeholder="Min (cm)" autoComplete="0" onChange={(e) => handlerFiltroLarghezzaMinima(e)}/>
                                <input type="text" placeholder="Max (cm)" autoComplete="200" onChange={(e) => handlerFiltroLarghezzaMassima(e)}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="filtro-bottone">
                    <button className="bottone-filtro" onClick={(e) => handlerFiltro(e)}>Cerca</button>
                </div>
            </div>
            
            <div id="visualizzazione-prodotti">
                <div className="ordina-prodotti">
                    <label className="label-sort">Ordina per</label>
                    <select name="ordina prodotti" value={opzioneOrdinamento} onChange={(e) => handlerOrdinamentoProdotti(e)}>
                        <option value="default">Seleziona ordinamento</option>
                        <option value="nome crescente">Nome (A-Z)</option>
                        <option value="nome decrescente">Nome (Z-A)</option>
                        <option value="prezzo crescente">Prezzo crescente</option>
                        <option value="prezzo decrescente">Prezzo decrescente</option>
                    </select>
                </div>
                <span className="numero-prodotti-disponibili">{numeroProdotti} Risultati</span>
            </div>

            <div className="cards-prodotti">
                {numeroProdotti === 0 && 
                    <div className="zero-prodotti">
                        <span>Nessun risultato ottenuto per i filtri che hai impostato </span>
                    </div>
                }
                {numeroProdotti !== 0 && prodotti.slice(0, prodottiVisualizzati).map((prodotto, index) => (
                    <div className="card-prodotto" key={index}>
                        <Link to={`/CatalogoProdotti/id:${prodotto.id}`}>
                            <div className="prodotto-img">
                                <img src={soggiorno} alt="icona-prodotto"></img>
                                <div className="interagisci-prodotto">

                                    <Link to="/Wishlist">
                                        <div className="prodotto-in-wishlist">
                                            <FaRegHeart />
                                        </div>
                                    </Link>
                                    <Link to="/Carrello">
                                        <div className="prodotto-in-carrello">
                                            <FiShoppingCart />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </Link>
                        <div className="prodotto-info">
                            <p className="info1">{String(prodotto.NomeProdotto)}</p>
                            <p className="info2">Set: {String(prodotto.NomeSet)}</p>
                            <p className="info3">{String(prodotto.Prezzo)}€</p>
                        </div>
                    </div>
                ))}
                {prodottiVisualizzati < numeroProdotti && (
                    <button className="mostra-altro-button" onClick={mostraAltriProdotti}>Mostra altri prodotti</button>
                )}
            </div>

            {showButton &&
                <Link to="/CatalogoProdotti" onClick={scrollToTop}>
                    <FilterFloatingButton/>
                </Link>
            }
        </div>
    )
}

export default CatalogoProdotti;