import React, { useState, useEffect, useRef }  from "react"
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc, getDocs, setDoc, collection, query, where, getFirestore, addDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { auth } from "../database/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import db from "../database/firebase"
import "../styles/WishlistPage.css"
import soggiorno from '../assets/images/soggiorno.jpg'
import { FaTrashAlt } from "react-icons/fa"
import emptywishlist from "../assets/images/empty-wishlist.png"
import loading from "../assets/images/loading.gif"

function Wishlist(){
    const navigate = useNavigate();
    
    /*Status nel localStorage di wishlist e carrello*/
    const [statusWishlist, setStatusWishlist] = useState({});
    const [statusCarrello, setStatusCarrello] = useState({});

    /*Caricamento dei prodotti presenti nella wishlist*/
    const [prodottiInWishlist, setProdottiInWishlist] = useState([]);
    const [caricamentoArray, setCaricamentoArray] = useState(true);

    /*Ordinamento dei prodotti*/
    const [opzioneOrdinamento, setOpzioneOrdinamento] = useState("default");



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
                const ruoloUtente = DocumentoUtente.data().ruolo;
                if(ruoloUtente==="User"){
                    navigate("/Login");
                }
                else{
                    /*Recupero la wishlist dell'utente dal localstorage*/
                    const savedStatusWishlist = localStorage.getItem(`${auth.currentUser.uid}_statusWishlist`);
                    if (savedStatusWishlist) {
                        setStatusWishlist(JSON.parse(savedStatusWishlist));
                    }
                    else{
                        setStatusWishlist({});
                    }

                    /*Recupero il carrello dell'utente dal localstorage*/
                    const statusCarrello = localStorage.getItem(`${auth.currentUser.uid}_statusCarrello`);
                    if(statusCarrello){
                        setStatusCarrello(JSON.parse(statusCarrello));
                    }
                    else{
                        setStatusCarrello({});
                    }
                }
              }
              else{
                console.log("L'utente che prova ad accedere in Profile non esiste");
                navigate("/Login");
              }
              uploadProductsFromWishlist(userUID);
            }
            else {
                /*Quando l'utente fa logout da questa pagina, lo porto nella home anzichè nel login*/
                console.log("L'utente che prova ad accedere in Wishlist non è autenticato");
                navigate("/");
            }
        });

        /*Caricamento dei prodotti presenti nella wishlist*/
        const uploadProductsFromWishlist = async(idUtente) => {
            const prodottiArrayID = [];
            const prodottiArrayDati = [];

            const RiferimentoRaccoltaGestione = collection(db, 'Gestione');
            const queryGetGestione = query(RiferimentoRaccoltaGestione, where('TipoGestione', '==', 'Wishlist'));
            const shapshotGestione = await getDocs(queryGetGestione);

            for(const gestioneDoc of shapshotGestione.docs){
                const RiferimentoRaccoltaWishlist = collection(gestioneDoc.ref, "Wishlist");
                const queryGetUserWishlist = query(RiferimentoRaccoltaWishlist, where('IDUtente', '==', idUtente));
                const shapshotWishlist = await getDocs(queryGetUserWishlist);

                for(const wishlistDoc of shapshotWishlist.docs){
                    const ElencoProdottiDB = wishlistDoc.data().ElencoProdotti;
                    prodottiArrayID.push(...ElencoProdottiDB);
                }
                console.log("Elenco dei prodotti (ID only): ", prodottiArrayID);
            }

            /*Array con gli ID interessati ottenuti. Ora prendo i loro dati dentro catalogo prodotti*/
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

                            /*Se prodotto ID è dentro i preferiti, allora lo aggiungo nel nuovo array con tt i dati*/
                            if(prodottiArrayID.includes(prodottoDoc.id)){
                                const datiProdotto = prodottoDoc.data();
                                const prodottoConId = { id: prodottoDoc.id, ...datiProdotto }
                                prodottiArrayDati.push(prodottoConId);
                            }
                        }
                    }
                }
            }
            setProdottiInWishlist(prodottiArrayDati);
            setCaricamentoArray(false);
        }
        //uploadProductsFromWishlist();
    }, []);


    const handlerRimozioneDaWishlist = async (e, idProdotto) => {
        e.preventDefault();
        e.stopPropagation();

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
                setProdottiInWishlist(prevState => prevState.filter(prodotto => prodotto.id !== idProdotto));

                /*Aggiorno il localStorage*/
                const updatedStatusWishlist = { ...statusWishlist };
                delete updatedStatusWishlist[idProdotto];
                setStatusWishlist(updatedStatusWishlist);

                localStorage.setItem(`${auth.currentUser.uid}_statusWishlist`, JSON.stringify(updatedStatusWishlist));
            }
        }
    }

    /* ----- ORDINAMENTO PRODOTTI ----- */
    const handlerOrdinamentoProdotti = async (e) => {
        setOpzioneOrdinamento(e.target.value);

        const prodottiOrdinati = [...prodottiInWishlist]; /*Ordinamento su un array di copia*/

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
        setProdottiInWishlist(prodottiOrdinati);
    }




    return(
        <div id="wishlist">
            <div className="wishlist-not-empty">
                <p className="wishlist-titolo">La mia lista dei desideri</p>
                
                <div className="divisore-wishlist"/>
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
                    <span className="numero-prodotti-disponibili">Hai {prodottiInWishlist.length} prodotti nella wishlist!</span>
                </div>
                <div className="divisore-wishlist"/>
                
                <div className="mylist-wishlist">
                    {prodottiInWishlist.length === 0 && 
                        <div className="zero-prodottiwishlist">
                            {caricamentoArray === true ? (
                                <img className="loading-gif" src={loading} alt="caricamento"></img>
                            ) : (
                                <div className="emptywishlist">
                                    <img src={emptywishlist}></img>
                                    <p>La tua wishlist è vuota</p>
                                    <Link to="/CatalogoProdotti">
                                        <button className="emptywishlist-button"><span>Vai a catalogo prodotti</span></button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    }
                    {prodottiInWishlist.length !== 0 && prodottiInWishlist.map((prodotto, index) => (
                        <div className="card-prodotto wishlist-product" key={index}>
                            <div className="prodotto-img">
                                <img src={prodotto.Immagine} alt="icona-prodotto"></img>
                                <div className="rimuovi-da-wishlist" onClick={(e) => handlerRimozioneDaWishlist(e,prodotto.id)}>
                                    <FaTrashAlt />
                                </div>
                                <div className="interagisci-prodotto-wishlist">
                                    <button className="addtocart"><span>Aggiungi al carrello</span></button>
                                </div>
                            </div>
                            <div className="prodotto-info">
                                <p className="info1">{String(prodotto.NomeProdotto)}</p>
                                <p className="info2">Set: {String(prodotto.NomeSet)}</p>
                                <p className="info3">{String(prodotto.Prezzo)}€</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Wishlist;