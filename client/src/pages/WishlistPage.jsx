import React, { useEffect } from "react"
import { useNavigate, Link } from 'react-router-dom'
import { auth } from "../database/firebase"
import { doc, getDoc } from "firebase/firestore"
import { onAuthStateChanged, signOut } from "firebase/auth"
import db from "../database/firebase"
import "../styles/WishlistPage.css"
import soggiorno from '../assets/images/soggiorno.jpg'
import { FaTrashAlt } from "react-icons/fa"
import emptywishlist from "../assets/images/empty-wishlist.png"

function Wishlist(){
    const navigate = useNavigate();

    useEffect(() => {
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
    }, []);


    return(
        <div id="wishlist">
            {false && (
                <div className="emptycart">
                    <img src={emptywishlist}></img>
                    <p>La tua wishlist è vuota</p>
                    <Link to="/CatalogoProdotti">
                        <button className="emptycart-button"><span>Vai a catalogo prodotti</span></button>
                    </Link>
                </div>
            )}
            {true && (<div className="wishlist-not-empty">
                <p className="wishlist-titolo">La mia lista dei desideri</p>
                
                <div className="divisore-wishlist"/>
                <div id="visualizzazione-prodotti">
                    <div className="ordina-prodotti">
                        <label className="label-sort">Ordina per</label>
                        <select name="ordina prodotti">
                            <option value="default">Seleziona ordinamento</option>
                            <option value="nome crescente">Nome (A-Z)</option>
                            <option value="nome decrescente">Nome (Z-A)</option>
                            <option value="prezzo crescente">Prezzo crescente</option>
                            <option value="prezzo decrescente">Prezzo decrescente</option>
                        </select>
                    </div>
                    <span className="numero-prodotti-disponibili">Hai 3 prodotti nella wishlist!</span>
                </div>
                <div className="divisore-wishlist"/>
                
                <div className="card-prodotto wishlist-product">
                    <div className="prodotto-img">
                        <img src={soggiorno} alt="icona-prodotto"></img>
                        <div className="rimuovi-da-wishlist">
                            <FaTrashAlt />
                        </div>
                        <div className="interagisci-prodotto-wishlist">
                            <button className="addtocart"><span>Aggiungi al carrello</span></button>
                        </div>
                    </div>
                    <div className="prodotto-info">
                        <p className="info1">nome prodotto</p>
                        <p className="info2">Set: nome set</p>
                        <p className="info3">xxx €</p>
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}

export default Wishlist;