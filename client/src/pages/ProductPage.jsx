import React, { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc, getDocs, setDoc, collection, query, where, getFirestore, addDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { auth } from "../database/firebase"
import db from "../database/firebase"
import soggiorno from '../assets/images/soggiorno.jpg'
import loading from "../assets/images/loading.gif"
import { FaRegHeart } from "react-icons/fa6"
import suonoWishlist from "../assets/sounds/bubble.mp3"
import suonoCarrello from "../assets/sounds/cash.mp3"
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

    /*Raccolto l'oggetto (il prodotto) cliccato dall'utente*/
    const [prodottoSingolo, setProdottoSingolo] = useState(null);

    useEffect(() => {
        /*Teletrasporto l'utente all'inizio della pagina appena viene fatto il rendering*/
        window.scrollTo(0, 0);

        /*Ottengo la wishlist dell'utente dal localstorage*/
        const savedStatusWishlist = localStorage.getItem(`${auth.currentUser.uid}_statusWishlist`);
        if(savedStatusWishlist){
            setStatusWishlist(JSON.parse(savedStatusWishlist));
        }
        else{
            setStatusWishlist({});
        }

        /*Ottengo il carrello dell'utente dal localstorage*/
        const savedStatusCarrello = localStorage.getItem(`${auth.currentUser.uid}_statusCarrello`);
        if(savedStatusCarrello){
            setStatusCarrello(JSON.parse(savedStatusCarrello));
        }
        else{
            setStatusCarrello({});
        }

        /*Operazione GET a Firebase per prendere e caricare le informazioni sul prodotto*/
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
                            setProdottoSingolo(prodottoDoc);
                        }
                    }
                }
            }
        }
        uploadProductInfo();
    }, [])
    


    /* GESTIONE WISHLIST*/
    const handlerAggiuntaInWishlist = async (e, idProdotto) => {
        e.preventDefault();
        e.stopPropagation(); //Quando clicco sul cuore, non voglio ascoltare il link esterno per andare nella pagina del prodotto
        
        try{
            if(auth.currentUser.email !== null){
                /*Faccio che cambiare il colore*/
                const updatedStatusWishlist = {
                    ...statusWishlist,
                    [idProdotto]: !statusWishlist[idProdotto]
                };
                setStatusWishlist(updatedStatusWishlist);
                const isProdottoInWishlist = statusWishlist[idProdotto];

                /*Salvo lo stato nel localStorage*/
                localStorage.setItem(`${auth.currentUser.uid}_statusWishlist`, JSON.stringify(updatedStatusWishlist));
                
                /*Aggiunta o rimozione del Prodotto dal database (Wishlist)*/
                if(!isProdottoInWishlist){
                    audioWishlistRef.current.play(); //Attivo suono!
                    await aggiuntaProdottoInWishlist(idProdotto);
                }
                else{
                    await rimozioneProdottoDaWishlist(idProdotto);
                }
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
            if(auth.currentUser.email !== null){
                /*Faccio che cambiare il colore*/
                const updatedStatusCarrello = {
                    ...statusCarrello,
                    [idProdotto]: !statusCarrello[idProdotto]
                };
                setStatusCarrello(updatedStatusCarrello);
                const isProdottoInCarrello = statusCarrello[idProdotto];
                
                /*Salvo lo stato nel localStorage*/
                localStorage.setItem(`${auth.currentUser.uid}_statusCarrello`, JSON.stringify(updatedStatusCarrello));

                /*Aggiunta o rimozione del Prodotto dal database (Carrello)*/
                if(!isProdottoInCarrello){
                    audioCarrelloRef.current.play(); //Attivo suono!
                    await aggiuntaProdottoInCarrello(idProdotto);
                }
                else{
                    await rimozioneProdottoDaCarrello(idProdotto);
                }
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


    return (
        <div id="pagina-prodotto">
            <div className="informazioni-prodotto">
                <div className="immagine-pagina-prodotto">
                    <img src={soggiorno} alt="icona-prodotto"></img>
                </div>
                <div className="caratteristiche-prodotto">
                    {prodottoSingolo === null ? (
                        <img className="loading-gif product-page" src={loading} alt="caricamento"></img>
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
                                    <button className={`aggiungi-carrello ${statusWishlist[prodottoSingolo.id] ? 'aggiunto': ''}`} onClick={(e) => handlerAggiuntaInCarrello(e, prodottoSingolo.id)}>Aggiungi al carrello</button>
                                ) : (
                                    <button className={`rimuovi-carrello ${statusWishlist[prodottoSingolo.id] ? 'aggiunto': ''}`} onClick={(e) => handlerAggiuntaInCarrello(e, prodottoSingolo.id)}>Rimuovi dal carrello</button>
                                )}
                                <audio ref={audioCarrelloRef} src={suonoCarrello}/>
                            </div>
                            <div className={`prodotto-in-wishlist inside ${statusWishlist[prodottoSingolo.id] ? 'aggiunto': ''}`} onClick={(e) => handlerAggiuntaInWishlist(e, prodottoSingolo.id)}>
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
            { true && (
                <div className="recensioni-prodotto">
                    <p className="recensioni-prodotto-sub1">Recensioni clienti</p>
                    <div className="recensioni-prodotto-container">
                        <p className="recensioni-prodotto-sub2">Non ci sono recensioni! Sii il primo a scriverne una!</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Product;