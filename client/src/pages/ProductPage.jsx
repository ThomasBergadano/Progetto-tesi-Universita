import React, { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc, getDocs, setDoc, collection, query, where, getFirestore, addDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { auth } from "../database/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import db from "../database/firebase"
import soggiorno from '../assets/images/soggiorno.jpg'
import loading from "../assets/images/loading.gif"
import { FaRegHeart } from "react-icons/fa6"
import suonoWishlist from "../assets/sounds/bubble.mp3"
import suonoCarrello from "../assets/sounds/cash.mp3"
import loading_product from "../assets/images/loading.gif"
import "../styles/ProductPage.css"


function Product(){
    const navigate = useNavigate();

    /*Status dei bottoni aggiungi in wishlist e carrello (selezionati e non selezionati)*/
    const [statusWishlist, setStatusWishlist] = useState({});
    const [statusCarrello, setStatusCarrello] = useState({});

    /*Effetto audio*/
    const audioWishlistRef = useRef();
    const audioCarrelloRef = useRef();

    /*Caricamento dei parametri (se esistono)*/
    const parametroUrl = window.location.href;
    const parametro = parametroUrl.split("id:");
    let idParametro = "";
    if(parametro.length > 1){
        idParametro = parametro[1];
    }
    else{
        navigate("/");
        return;
    }

    /*Raccolgo l'oggetto (il prodotto) cliccato dall'utente*/
    const [prodottoSingolo, setProdottoSingolo] = useState(null);

    /*Costanti per le recensioni ed il form*/
    const formRecensioni = useRef();
    const [messaggioRecensioneUtente, setMessaggioRecensione] = useState("");
    const [elencoRecensioniProdotto, setElencoRecensioniProdotto] = useState([]);
    const [caricamentoRecensioni, setCaricamentoRecensioni] = useState(true);

    /*Costanti per l'ottenimento della data attuale*/
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2,'0');
    const month = String(currentDate.getMonth()+1).padStart(2,'0');
    const year = String(currentDate.getFullYear()).slice(2);
    const dataFormattata = `${day}/${month}/${year}`;

    /*Informazioni sull'utente*/
    const [oggettoUtente, setOggettoUtente] = useState("");


    useEffect(() => {
        /*Teletrasporto l'utente all'inizio della pagina appena viene fatto il rendering*/
        window.scrollTo(0, 0);

        /*Recupero il nome e cognome dell'utente*/
        onAuthStateChanged(auth, async (user) => {
            if(user) {
                const userUID = user.uid;
                const RiferimentoDocumentoUtente = await doc(db, 'Utenti', userUID);
                const DocumentoUtente = await getDoc(RiferimentoDocumentoUtente);

                if(DocumentoUtente.exists()){
                    setOggettoUtente(DocumentoUtente.data());
                }
            }
        });

        /*Ottengo la wishlist dell'utente dal localstorage*/
        const savedStatusWishlist = localStorage.getItem(`${auth.currentUser?.uid}_statusWishlist`);
        if(savedStatusWishlist){
            setStatusWishlist(JSON.parse(savedStatusWishlist));
        }
        else{
            setStatusWishlist({});
        }

        /*Ottengo il carrello dell'utente dal localstorage*/
        const savedStatusCarrello = localStorage.getItem(`${auth.currentUser?.uid}_statusCarrello`);
        if(savedStatusCarrello){
            setStatusCarrello(JSON.parse(savedStatusCarrello));
        }
        else{
            setStatusCarrello({});
        }

        /*Operazione GET a Firebase per prendere e caricare le informazioni sul prodotto e recensioni*/
        const uploadProductInfo = async() => {
            const RiferimentoRaccoltaCategoria = collection(db, "Categoria");
            const snapshotCategorie = await getDocs(RiferimentoRaccoltaCategoria);

            for(const categoriaDoc of snapshotCategorie.docs){
                const RiferimentoRaccoltaSottocategoria = collection(categoriaDoc.ref, "SottoCategoria");
                const snapshotSottoCategorie = await getDocs(RiferimentoRaccoltaSottocategoria);

                for(const sottocategoriaDoc of snapshotSottoCategorie.docs){
                    const RiferimentoRaccoltaProdotti = collection(sottocategoriaDoc.ref, "Prodotti");
                    const snapshotProdotti = await getDocs(RiferimentoRaccoltaProdotti);

                    for(const prodottoDoc of snapshotProdotti.docs){
                        if(idParametro === prodottoDoc.id){
                            //const datiProdotto = prodottoDoc.data();
                            //const prodottoConId = { id: prodottoDoc.id, ...datiProdotto }
                            setProdottoSingolo(prodottoDoc);
                        }
                    }
                }
            }

            /*Caricamento delle recensioni dal db*/
            const arrayRecensioni = [];
            const RiferimentoRaccoltaRecensioni = collection(db, 'Recensioni');
            const queryGetRecensioni = query(RiferimentoRaccoltaRecensioni, where('ProdottoID', '==', idParametro));
            const snapshotRecensioni = await getDocs(queryGetRecensioni);

            for(const RecensioniDoc of snapshotRecensioni.docs){
                const RiferimentoRecensioniProdotto = collection(RecensioniDoc.ref, "RecensioniProdotto");
                const snapshotRecensioniProdotto = await getDocs(RiferimentoRecensioniProdotto);

                for(const RecensioneProdottoDoc of snapshotRecensioniProdotto.docs){
                    let commentoProdotto = RecensioneProdottoDoc.data().Commento;
                    if(commentoProdotto !== ""){
                        arrayRecensioni.push(RecensioneProdottoDoc.data());
                    }
                }
            }

            setElencoRecensioniProdotto(arrayRecensioni);
            //console.log("Recensioni: ", arrayRecensioni);
            setCaricamentoRecensioni(false);
        }
        uploadProductInfo();
    }, [])
    


    /* GESTIONE WISHLIST*/
    const handlerAggiuntaInWishlist = async (e, idProdotto) => {
        e.preventDefault();
        e.stopPropagation(); //Quando clicco sul cuore, non voglio ascoltare il link esterno per andare nella pagina del prodotto

        try{
            if(auth.currentUser && auth.currentUser.email){
                let statusWishlist = JSON.parse(localStorage.getItem(`${auth.currentUser?.uid}_statusWishlist`));               
                const ProdottoIncluso = statusWishlist ? statusWishlist.hasOwnProperty(idProdotto) : false;
    
                if(!statusWishlist){
                    statusWishlist = {};
                }
    
                if(!ProdottoIncluso){
                    statusWishlist[idProdotto] = { quantita: 1 };
                }
                else{
                    delete statusWishlist[idProdotto];
                }
    
                localStorage.setItem(`${auth.currentUser.uid}_statusWishlist`, JSON.stringify(statusWishlist));
                setStatusWishlist(statusWishlist);
    
                if(!ProdottoIncluso){
                    audioWishlistRef.current.play();
                    await aggiuntaProdottoInWishlist(idProdotto);
                }
                else{
                    await rimozioneProdottoDaWishlist(idProdotto);
                }
            }
            else{
                navigate("/Login")
            }
        }
        catch(error){ /*Entro qui se non sono loggato e sto provando a mettere qualcosa tra i preferiti*/
            navigate("/Login");
        }
    }

    const aggiuntaProdottoInWishlist = async(idProdotto) => {
        const idUtente = auth.currentUser.uid;
        const RiferimentoRaccoltaGestione = collection(db, 'Gestione');
        const queryGetGestione = query(RiferimentoRaccoltaGestione, where('TipoGestione', '==', 'Wishlist'));
        const shapshotGestione = await getDocs(queryGetGestione);

        for(const gestioneDoc of shapshotGestione.docs){
            const RiferimentoRaccoltaWishlist = collection(gestioneDoc.ref, "Wishlist");
            const queryGetUserWishlist = query(RiferimentoRaccoltaWishlist, where('IDUtente', '==', idUtente));
            const shapshotWishlist = await getDocs(queryGetUserWishlist);

            for(const wishlistDoc of shapshotWishlist.docs){
                console.log("ID documenti wishlist: ",wishlistDoc.id);
                console.log("prodotto aggiunto:", idProdotto);
                await updateDoc(wishlistDoc.ref,{
                    ElencoProdotti: arrayUnion(idProdotto)
                });
            }
        }
    }
    const rimozioneProdottoDaWishlist = async(idProdotto) => {
        const idUtente = auth.currentUser.uid;
        const RiferimentoRaccoltaGestione = collection(db, 'Gestione');
        const queryGetGestione = query(RiferimentoRaccoltaGestione, where('TipoGestione', '==', 'Wishlist'));
        const shapshotGestione = await getDocs(queryGetGestione);

        for(const gestioneDoc of shapshotGestione.docs){
            const RiferimentoRaccoltaWishlist = collection(gestioneDoc.ref, "Wishlist");
            const queryGetUserWishlist = query(RiferimentoRaccoltaWishlist, where('IDUtente', '==', idUtente));
            const shapshotWishlist = await getDocs(queryGetUserWishlist);
            
            for(const wishlistDoc of shapshotWishlist.docs){
                await updateDoc(wishlistDoc.ref,{
                    ElencoProdotti: arrayRemove(idProdotto)
                });
                console.log("prodotto rimosso:", idProdotto);
            }
        }
    }

    /*GESTIONE CARRELLO*/
    const handlerAggiuntaInCarrello = async (e, idProdotto) => {
        e.preventDefault();
        e.stopPropagation(); //Quando clicco sul carrello, non voglio ascoltare il link esterno per andare nella pagina del prodotto
        
        try{
            if(auth.currentUser && auth.currentUser.email){
                /*Gestisco il carrello nel local storage*/
                let statusCarrello = JSON.parse(localStorage.getItem(`${auth.currentUser?.uid}_statusCarrello`));               
                const ProdottoIncluso = statusCarrello ? statusCarrello.hasOwnProperty(idProdotto) : false;

                if(!statusCarrello){
                    statusCarrello = {};
                }

                if(!ProdottoIncluso){
                    statusCarrello[idProdotto] = { quantita: 1 };
                }
                else{
                    delete statusCarrello[idProdotto];
                }

                /*Salvo lo stato nel localStorage*/
                localStorage.setItem(`${auth.currentUser.uid}_statusCarrello`, JSON.stringify(statusCarrello));
                setStatusCarrello(statusCarrello);

                /*Aggiunta o rimozione del Prodotto dal database (Carrello)*/
                if(!ProdottoIncluso){
                    audioCarrelloRef.current.play(); //Attivo il suono!
                    await aggiuntaProdottoInCarrello(idProdotto);
                }
                else{
                    await rimozioneProdottoDaCarrello(idProdotto);
                }
            }
            else{
                navigate("/Login")
            }
        }
        catch(error){
            navigate("/Login");
        }
    }

    const aggiuntaProdottoInCarrello = async(idProdotto) => {
        const idUtente = auth.currentUser.uid;

        const RiferimentoRaccoltaGestione = collection(db, 'Gestione');
        const queryGetGestione = query(RiferimentoRaccoltaGestione, where('TipoGestione', '==', 'Carrello'));
        const shapshotGestione = await getDocs(queryGetGestione);

        for(const gestioneDoc of shapshotGestione.docs){
            const RiferimentoRaccoltaCarrello = collection(gestioneDoc.ref, "Carrello");
            const queryGetUserCarrello = query(RiferimentoRaccoltaCarrello, where('IDUtente', '==', idUtente));
            const shapshotCarrello = await getDocs(queryGetUserCarrello);
            
            for(const carrelloDoc of shapshotCarrello.docs){
                const RiferimentoRaccoltaCarrelloProdotti = collection(carrelloDoc.ref, "CarrelloElencoProdotti");
                
                const carrelloProdottoDoc = await addDoc(RiferimentoRaccoltaCarrelloProdotti,{
                    IDProdotto: idProdotto,
                    Quantita: 1,
                });

            }
        }
    }
    const rimozioneProdottoDaCarrello = async(idProdotto) => {
        const idUtente = auth.currentUser.uid;

        const RiferimentoRaccoltaGestione = collection(db, 'Gestione');
        const queryGetGestione = query(RiferimentoRaccoltaGestione, where('TipoGestione', '==', 'Carrello'));
        const shapshotGestione = await getDocs(queryGetGestione);

        for(const gestioneDoc of shapshotGestione.docs){
            const RiferimentoRaccoltaCarrello = collection(gestioneDoc.ref, "Carrello");
            const queryGetUserCarrello = query(RiferimentoRaccoltaCarrello, where('IDUtente', '==', idUtente));
            const shapshotCarrello = await getDocs(queryGetUserCarrello);

            for(const carrelloDoc of shapshotCarrello.docs){
                const RiferimentoRaccoltaCarrelloProdotti = collection(carrelloDoc.ref, "CarrelloElencoProdotti");
                const queryGetCarrelloElencoProdotti = query(RiferimentoRaccoltaCarrelloProdotti, where('IDProdotto', '==', idProdotto));
                const snapshotCarrelloElencoProdotti = await getDocs(queryGetCarrelloElencoProdotti);

                for(const carrelloElencoProdottiDoc of snapshotCarrelloElencoProdotti.docs){
                    await deleteDoc(carrelloElencoProdottiDoc.ref);
                }
            }
        }
    }

    const invioRecensione = async(e) => {
        e.preventDefault();
        let nuovaRecensione = {};

        if(!auth.currentUser){
            navigate("/Login");
            return;
        }
        
        /*Creazione della recensione nel Database*/
        const arrayRecensioni = [];
        const RiferimentoRaccoltaRecensioni = collection(db, 'Recensioni');
        const queryGetRecensioni = query(RiferimentoRaccoltaRecensioni, where('ProdottoID', '==', prodottoSingolo.id));
        const snapshotRecensioni = await getDocs(queryGetRecensioni);

        for(const RecensioniDoc of snapshotRecensioni.docs){
            const RiferimentoRecensioniProdotto = collection(RecensioniDoc.ref, "RecensioniProdotto");

            nuovaRecensione = {
                Commento: messaggioRecensioneUtente,
                UtenteID: auth.currentUser.uid,
                DataCommento: dataFormattata,
                NomeUtente: oggettoUtente.nome,
                CognomeUtente: oggettoUtente.cognome,
            };

            const nuovaRecensioneProdottoDoc = await addDoc(RiferimentoRecensioniProdotto, nuovaRecensione);
        }

        setElencoRecensioniProdotto(arrayRecensioniVecchio => arrayRecensioniVecchio.concat(nuovaRecensione));
        setMessaggioRecensione("");
        //formRecensioni.current.reset();
    }



    return (
        <div id="pagina-prodotto">
            <div className="informazioni-prodotto">
                <div className="immagine-pagina-prodotto">
                    <img src={soggiorno} alt="icona-prodotto"></img>
                </div>
                <div className="caratteristiche-prodotto">
                    {prodottoSingolo === null ? (
                        <img className="loading-gif product-page" src={loading_product} alt="caricamento"></img>
                    ) : (
                        <>
                        <p className="dettagli"></p>
                        <p className="page-prod-nome">{prodottoSingolo.data().NomeProdotto}</p>
                        <p className="page-prod-set"><span className="nome-caratteristica">SET: </span>{prodottoSingolo.data().NomeSet}</p>
                        <p className="page-prod-prezzo">{prodottoSingolo.data().Prezzo}€</p>
                        <p className="page-prod-descrizione">{prodottoSingolo.data().Descrizione}</p>
                        <p className="page-prod-dimensioni"><span className="nome-caratteristica">DIMENSIONI: </span>{prodottoSingolo.data().Lunghezza}cm x {prodottoSingolo.data().Profondita}cm x {prodottoSingolo.data().Altezza}cm</p>
                        <p className="page-prod-colore"><span className="nome-caratteristica">COLORE: </span>{prodottoSingolo.data().Colore}</p>
                        <div className="page-prod-buttons">
                            <div className="aggiunta-carrello">
                                {!statusCarrello[prodottoSingolo.id] ? (
                                    <button className={`aggiungi-carrello ${statusCarrello[prodottoSingolo.id] ? 'aggiunto': ''}`} onClick={(e) => handlerAggiuntaInCarrello(e, prodottoSingolo.id)}>Aggiungi al carrello</button>
                                ) : (
                                    <button className={`rimuovi-carrello ${statusCarrello[prodottoSingolo.id] ? 'aggiunto': ''}`} onClick={(e) => handlerAggiuntaInCarrello(e, prodottoSingolo.id)}>Rimuovi dal carrello</button>
                                )}
                                <audio ref={audioCarrelloRef} src={suonoCarrello}/>
                            </div>
                            <div className={`prodotto-in-wishlist inside ${statusWishlist.hasOwnProperty(prodottoSingolo.id) ? 'aggiunto': ''}`} onClick={(e) => handlerAggiuntaInWishlist(e, prodottoSingolo.id)}>
                                <FaRegHeart />
                                <audio ref={audioWishlistRef} src={suonoWishlist}/>
                            </div>
                        </div>
                        <div className="page-prod-assistenza">
                            <Link to="/AssistenzaClienti"><p>Serve assistenza?</p></Link>
                        </div>
                        </>
                    )}
                </div>
            </div>
            <div className="recensioni-prodotto">
                <p className="recensioni-prodotto-sub1">Recensioni clienti</p>
                <div className="container-recensioni-notempty">
                    <div className="recensione-paragrafo">
                        <p className="recensione-invito">Hai un parere sul prodotto? Scrivi cosa ne pensi!</p>
                        <textarea className="recensione-textarea" placeholder="Inserisci un parere su questo prodotto!" value={messaggioRecensioneUtente} onChange={(e) => setMessaggioRecensione(e.target.value)}  ref={formRecensioni}/>
                        <button className="invia-recensione" onClick={(e) => invioRecensione(e)}>Invia recensione</button>

                        <div className="recensione-divisore"/>
                        
                        <>
                        { caricamentoRecensioni === true ? ( 
                            <div className="caricamento-carrello-list">
                                <img className="loading-gif-recensioni" src={loading} alt="caricamento"></img>
                            </div>
                        ) : (
                            <>
                            { elencoRecensioniProdotto.length === 0  && (
                                <div className="container-recensioni-empty">
                                    <p className="recensioni-prodotto-sub2">Non ci sono recensioni, sii il primo a scriverne una!</p>
                                </div>
                            )}
                            
                            { elencoRecensioniProdotto.length !== 0 && elencoRecensioniProdotto.map((recensione, index) => (
                                <div className="recensione-utente" key={index}>
                                    <div className="recensione-informazioni">
                                        <p className="recensione-nome-utente">{recensione.NomeUtente} {recensione.CognomeUtente}</p>
                                        <p className="recensione-data">{recensione.DataCommento}</p>
                                    </div>
                                    <p>{recensione.Commento}</p>
                                </div>
                            ))}  
                            </>
                        )}
                        </>            
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Product;