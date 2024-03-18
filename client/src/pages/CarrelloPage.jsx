import React, { useState, useEffect, useRef }  from "react"
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc, getDocs, setDoc, collection, query, where, getFirestore, addDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { auth } from "../database/firebase"
import db from "../database/firebase"
import { onAuthStateChanged } from "firebase/auth"
import emptycart from "../assets/images/empty-cart.svg"
import { FaPlus } from "react-icons/fa"
import { FaMinus } from "react-icons/fa"
import soggiorno from '../assets/images/soggiorno.jpg'
import removeitem from '../assets/images/removeitem.png'
import "../styles/CarrelloPage.css"
import loading from "../assets/images/loading.gif"
import happypop from "../assets/sounds/happypop.mp3"
import reduce from "../assets/sounds/reduce.mp3"
import delete_product from "../assets/sounds/delete.mp3"



function Carrello(){
    const navigate = useNavigate();

    /*Caricamento dei prodotti del carrello*/
    const [carrelloUtente, setCarrelloUtente] = useState([]);
    const [caricamentoArray, setCaricamentoArray] = useState(true);

    /*Costanti per la somma del prezzo dei prodotti*/
    const [prezzoTotale, setPrezzoTotale] = useState(0.00);
    const [quantitaTotale, setQuantitaTotale] = useState(0);

    /*Ottengo il carrello dal localStorage*/
    const [statusCarrello, setStatusCarrello] = useState({});
    
    /*Informazioni dell'utente*/
    const [oggettoUtente, setOggettoUtente] = useState("");
    const [nomeUtente, setNomeUtente] = useState(0);

    /*Effetto audio*/
    const audioIncrementaQuantita = useRef();
    const audioDecrementaQuantita = useRef();
    const audioTogliProdottoDalCarrello = useRef();


    /*Gestione autorizzazone e permessi per accesso in /Dashboard*/
    useEffect(() => {
        /*Teletrasporto l'utente all'inizio della pagina appena viene fatto il rendering*/
        window.scrollTo(0, 0);
    
        /*Gestione permessi tramite l'autenticazione*/
        onAuthStateChanged(auth, async (user) => {
            if(user) {
              const userUID = user.uid;
              const RiferimentoDocumentoUtente = await doc(db, 'Utenti', userUID);
              const DocumentoUtente = await getDoc(RiferimentoDocumentoUtente);

              if(DocumentoUtente.exists()){
                setOggettoUtente(DocumentoUtente.data());
                const ruoloUtente = DocumentoUtente.data().ruolo;
                if(ruoloUtente==="User"){
                    navigate("/Login");
                }
              }
              else{
                console.log("L'utente che prova ad accedere in Profile non esiste");
                navigate("/Login");
              }
            }
            else {
                /*Quando l'utente fa logout da questa pagina, lo porto nella home anzichè nel login*/
                console.log("L'utente che prova ad accedere in Wishlist non è autenticato");
                navigate("/");
            }
        });

        /*Ottengo il carrello dell'utente dal localstorage*/
        const savedStatusCarrello = localStorage.getItem(`${auth.currentUser.uid}_statusCarrello`);
        if(savedStatusCarrello){
            setStatusCarrello(JSON.parse(savedStatusCarrello));
        }
        else{
            setStatusCarrello({});
        }


        const uploadCarrello = async() => {
        /*Caricamento di tutti i prodotti all'interno del carrello*/
            /*Prima ottengo gli ID dei prodotti nel carrello*/
            const prodottiCarrelloUtente = [];
            const carrelloArray = [];
            let prezzoTotaleProvvisorio = 0;
            let quantitaProdottiTotaleProvvisoria = 0;
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
                    const snapshotCarrelloElencoProdotti = await getDocs(RiferimentoRaccoltaCarrelloProdotti);

                    for(const carrelloProdottiDoc of snapshotCarrelloElencoProdotti.docs){
                        let idProdotto = carrelloProdottiDoc.data().IDProdotto;
                        let quantita = carrelloProdottiDoc.data().Quantita;
                        if(idProdotto !== ""){
                            const item = {idProdotto, quantita};
                            prodottiCarrelloUtente.push(item);
                        }
                    }
                }
            }

            /*Infine cerco quei prodotti e inserisco le loro informazioni nel mio array di stato*/
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
                        for(const prodottoDoc of snapshotProdotti.docs) {
                            /*Se prodotto ID è dentro il carrello, allora lo aggiungo nel nuovo array con tt i dati*/
                            const prodottoNelCarrello = prodottiCarrelloUtente.find(item => item.idProdotto === prodottoDoc.id);
                            if(prodottoNelCarrello){
                                const datiProdotto = prodottoDoc.data();
                                const prodottoConId = { id: prodottoDoc.id, quantitaUtente: prodottoNelCarrello.quantita, ...datiProdotto };
                                carrelloArray.push(prodottoConId);
                                prezzoTotaleProvvisorio += parseFloat((prodottoDoc.data().Prezzo * prodottoNelCarrello.quantita).toFixed(2));
                                quantitaProdottiTotaleProvvisoria += prodottoNelCarrello.quantita;
                            }
                        }
                    }
                }
            }
            setPrezzoTotale(prezzoTotaleProvvisorio);
            setQuantitaTotale(quantitaProdottiTotaleProvvisoria);
            setCarrelloUtente(carrelloArray);
            setCaricamentoArray(false);
        }
        uploadCarrello();
    }, []);
    


    /*Gestisco la quantità di un dato prodotto*/
    const riduciQuantita = async(e, prodotto) => {
        e.preventDefault();
        const idUtente = auth.currentUser.uid;
        if(prodotto.quantitaUtente === 1){
            return;
        }
        else{
            if(audioDecrementaQuantita.current){
                audioDecrementaQuantita.current.play();
            }

            const RiferimentoRaccoltaGestione = collection(db, 'Gestione');
            const queryGetGestione = query(RiferimentoRaccoltaGestione, where('TipoGestione', '==', 'Carrello'));
            const shapshotGestione = await getDocs(queryGetGestione);

            for(const gestioneDoc of shapshotGestione.docs){
                const RiferimentoRaccoltaCarrello = collection(gestioneDoc.ref, "Carrello");
                const queryGetUserCarrello = query(RiferimentoRaccoltaCarrello, where('IDUtente', '==', idUtente));
                const shapshotCarrello = await getDocs(queryGetUserCarrello);

                for(const carrelloDoc of shapshotCarrello.docs){
                    const RiferimentoRaccoltaCarrelloProdotti = collection(carrelloDoc.ref, "CarrelloElencoProdotti");
                    const queryGetProdottoNelCarrello = query(RiferimentoRaccoltaCarrelloProdotti, where('IDProdotto', '==', prodotto.id));
                    const snapshotCarrelloElencoProdotti = await getDocs(queryGetProdottoNelCarrello);
                    
                    for(const carrelloProdottiDoc of snapshotCarrelloElencoProdotti.docs){
                        /*Aggiorno in tempo reale la quantità nell'interfaccia*/
                        const prodottoIndex = carrelloUtente.findIndex(item => item.id === prodotto.id);
                        if(prodottoIndex !== -1) {
                            /*Riduco la quantità dall'array attuale*/
                            const carrelloUtenteAggiornato = [...carrelloUtente];
                            carrelloUtenteAggiornato[prodottoIndex].quantitaUtente -= 1;
                            setCarrelloUtente(carrelloUtenteAggiornato);
                            
                            /*Riduco la quantità nel database*/
                            updateDoc(carrelloProdottiDoc.ref, {
                                Quantita: carrelloUtenteAggiornato[prodottoIndex].quantitaUtente,
                            })
                            
                            /*Riduco il prezzo totale!*/
                            const prezzoTotaleAggiornato = (parseFloat(prezzoTotale) - parseFloat(prodotto.Prezzo)).toFixed(2);
                            setPrezzoTotale(prezzoTotaleAggiornato);
                            break;
                        }    
                    }
                }
            }
        }
    }

    const aumentaQuantita = async(e, prodotto) => {
        e.preventDefault();
        const idUtente = auth.currentUser.uid;

        /*Effetto audio*/
        if(audioIncrementaQuantita.current){
            audioIncrementaQuantita.current.play();
        }

        const RiferimentoRaccoltaGestione = collection(db, 'Gestione');
        const queryGetGestione = query(RiferimentoRaccoltaGestione, where('TipoGestione', '==', 'Carrello'));
        const shapshotGestione = await getDocs(queryGetGestione);

        for(const gestioneDoc of shapshotGestione.docs){
            const RiferimentoRaccoltaCarrello = collection(gestioneDoc.ref, "Carrello");
            const queryGetUserCarrello = query(RiferimentoRaccoltaCarrello, where('IDUtente', '==', idUtente));
            const shapshotCarrello = await getDocs(queryGetUserCarrello);

            for(const carrelloDoc of shapshotCarrello.docs){
                const RiferimentoRaccoltaCarrelloProdotti = collection(carrelloDoc.ref, "CarrelloElencoProdotti");
                const queryGetProdottoNelCarrello = query(RiferimentoRaccoltaCarrelloProdotti, where('IDProdotto', '==', prodotto.id));
                const snapshotCarrelloElencoProdotti = await getDocs(queryGetProdottoNelCarrello);

                for(const carrelloProdottiDoc of snapshotCarrelloElencoProdotti.docs){
                    /*Aggiorno in tempo reale la quantità nell'interfaccia*/
                    const prodottoIndex = carrelloUtente.findIndex(item => item.id === prodotto.id);
                    if(prodottoIndex !== -1) {
                        /*Riduco la quantità dall'array attuale*/
                        const carrelloUtenteAggiornato = [...carrelloUtente];
                        carrelloUtenteAggiornato[prodottoIndex].quantitaUtente += 1;
                        setCarrelloUtente(carrelloUtenteAggiornato);
                        
                        /*Riduco la quantità nel database*/
                        updateDoc(carrelloProdottiDoc.ref, {
                            Quantita: carrelloUtenteAggiornato[prodottoIndex].quantitaUtente,
                        })

                        /*Riduco il prezzo totale!*/
                        const prezzoTotaleAggiornato = (parseFloat(prezzoTotale) + parseFloat(prodotto.Prezzo)).toFixed(2);
                        setPrezzoTotale(prezzoTotaleAggiornato);
                        break;
                    }
                }
            }
        }
    }

    const togliProdottoDalCarrello = async(e, prodotto) =>{
        e.preventDefault();

        /*Attivo il suono*/
        if(audioTogliProdottoDalCarrello.current){
            audioTogliProdottoDalCarrello.current.play();
        }

        /*Aggiorno lo stato nel localStorage (anche per cambiare colore)*/
        const updatedStatusCarrello = {
            ...statusCarrello,
            [prodotto.id]: !statusCarrello[prodotto.id]
        };
        setStatusCarrello(updatedStatusCarrello);
        
        localStorage.setItem(`${auth.currentUser.uid}_statusCarrello`, JSON.stringify(updatedStatusCarrello));

        /*Elimino da tutto il resto*/
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
                const queryGetCarrelloElencoProdotti = query(RiferimentoRaccoltaCarrelloProdotti, where('IDProdotto', '==', prodotto.id));
                const snapshotCarrelloElencoProdotti = await getDocs(queryGetCarrelloElencoProdotti);

                /*Rimuovo il prodotto proprio nel DB*/
                for(const carrelloElencoProdottiDoc of snapshotCarrelloElencoProdotti.docs){
                    await deleteDoc(carrelloElencoProdottiDoc.ref);
                }

                /*Rimuovo il prodotto dall'array attualmente mostrato nell'interfaccia*/
                const carrelloUtenteAggiornato = carrelloUtente.filter(item => item.id !== prodotto.id);
                setCarrelloUtente(carrelloUtenteAggiornato);

                /*Riduco il prezzo totale*/
                const prezzoTotaleAggiornato = (parseFloat(prezzoTotale) - (parseFloat(prodotto.Prezzo)*prodotto.quantitaUtente)).toFixed(2);
                setPrezzoTotale(prezzoTotaleAggiornato);
            }
        }
    }




    
    return(
        <div id="carrello">
            {carrelloUtente.length === 0 && (
                <>
                { caricamentoArray === true ? ( 
                    <div className="notempycart">
                        <div className="il-tuo-carrello-loading">
                            <p className="carrello-titolo">Il tuo carrello</p>
                            <div className="divisore-acquisto"/>
                            <div className="caricamento-carrello-list">
                                <img className="loading-gif" src={loading} alt="caricamento"></img>
                            </div>
                        </div>
                        <div className="sommario-ordine-loading">
                            <p className="sommario-subtitle">Sommario dell'ordine</p>
                            <div className="caricamento-carrello-sum">
                                <img className="loading-gif" src={loading} alt="caricamento"></img>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="emptycart"> {/*Se dopo il caricamento non ci sono prodotti*/}
                        <img src={emptycart}></img>
                        <p>Il tuo carrello è vuoto</p>
                        <Link to="/CatalogoProdotti">
                            <button className="emptycart-button"><span>Vai a catalogo prodotti</span></button>
                        </Link>
                    </div>
                )}
                </>
            )}
            {carrelloUtente.length !== 0 && (
                <div className="notempycart">
                    <div className="il-tuo-carrello">
                        <p className="carrello-titolo">Il tuo carrello</p>
                        <div className="divisore-acquisto"/>
                        {carrelloUtente.length !== 0 && carrelloUtente.map((prodotto, index) => (
                            <div className="prodotto-carrello" key={index}>
                                <div className="immagine-prodotto-carrello">
                                    <img src={prodotto.Immagine} alt="icona-prodotto"></img>
                                </div>
                                <div className="info-prodotti-carrello-left">
                                    <p className="info-nome">{prodotto.NomeProdotto}</p>
                                    <p className="info-carr">Set: <span>{prodotto.NomeSet}</span></p>
                                    <p className="info-carr">Misure: {prodotto.Altezza}x{prodotto.Lunghezza}x{prodotto.Profondita}</p>
                                    <div className="gestione-quantita">
                                        <div className="minus" onClick={(e) => riduciQuantita(e, prodotto)}>
                                            <FaMinus/>
                                            <audio ref={audioDecrementaQuantita} src={reduce}></audio>
                                        </div>
                                        <textarea className="textarea-quantita" defaultValue={prodotto.quantitaUtente}></textarea>
                                        <div className="plus" onClick={(e) => aumentaQuantita(e, prodotto)}>
                                            <FaPlus/>
                                            <audio ref={audioIncrementaQuantita} src={happypop}></audio>
                                        </div>
                                    </div>
                                </div>
                                <div className="info-prodotti-carrello-right">
                                    <div className="quantita-prodotto">
                                        <div className="prezzo-singolo">
                                            <p>{prodotto.Prezzo}€</p>
                                        </div>
                                    </div>
                                    <div className="rimuovi-prodotto-carrello" onClick={(e) => togliProdottoDalCarrello(e, prodotto)}>
                                        <img src={removeitem}></img>
                                        <span>Rimuovi</span>
                                        <audio ref={audioTogliProdottoDalCarrello} src={delete_product}></audio>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="sommario-ordine">
                        <p className="sommario-subtitle">Sommario dell'ordine</p>
                        <div className="costo-totale">
                            <p>Totale</p>
                            <p className="sommario-costo-totale">{parseFloat(prezzoTotale).toFixed(2)} €</p>
                        </div>
                        <div className="divisore-sommario"/>
                        <Link to="/Carrello/Checkout" state={{prezzoTotale: parseFloat(prezzoTotale).toFixed(2)}}>
                            <button className="notemptycart-button"><span>Procedi al checkout</span></button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Carrello;