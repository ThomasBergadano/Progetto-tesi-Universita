import React, { useEffect } from "react"
import { useNavigate, Link } from 'react-router-dom'
import { auth } from "../database/firebase"
import db from "../database/firebase"
import { doc, getDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import emptycart from "../assets/images/empty-cart.svg"
import { FaPlus } from "react-icons/fa"
import { FaMinus } from "react-icons/fa"
import soggiorno from '../assets/images/soggiorno.jpg'
import removeitem from '../assets/images/removeitem.png'
import "../styles/CarrelloPage.css"


function Carrello(){
    const navigate = useNavigate();

    /*Gestione autorizzazone e permessi per accesso in /Dashboard*/
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
        

        <div id="carrello">
            {false && (
                <div className="emptycart">
                    <img src={emptycart}></img>
                    <p>Il tuo carrello è vuoto</p>
                    <Link to="/CatalogoProdotti">
                        <button className="emptycart-button"><span>Vai a catalogo prodotti</span></button>
                    </Link>
                </div>
            )}
            {true && (
                <div className="notempycart">
                    <div className="il-tuo-carrello">
                        <p className="carrello-titolo">Il tuo carrello</p>
                        <div className="divisore-acquisto"/>
                        <div className="prodotto-carrello">
                            <div className="immagine-prodotto-carrello">
                                <img src={soggiorno} alt="icona-prodotto"></img>
                            </div>
                            <div className="info-prodotti-carrello-left">
                                <p className="info-nome">Mensola in legno 20x180 abete</p>
                                <p className="info-carr">Set: <span>Fire</span></p>
                                <p className="info-carr">Misure: 20x180x30</p>
                                <div className="gestione-quantita">
                                    <div className="minus">
                                        <FaMinus/>
                                    </div>
                                    <textarea className="textarea-quantita" defaultValue={0}></textarea>
                                    <div className="plus">
                                        <FaPlus/>
                                    </div>
                                </div>
                            </div>
                            <div className="info-prodotti-carrello-right">
                                <div className="quantita-prodotto">
                                    <div className="prezzo-singolo">
                                        <p>15€</p>
                                    </div>
                                </div>
                                <div className="rimuovi-prodotto-carrello">
                                    <img src={removeitem}></img>
                                    <span>Rimuovi</span>
                                </div>
                            </div>
                        </div>

                        <div className="prodotto-carrello">
                            <div className="immagine-prodotto-carrello">
                                <img src={soggiorno} alt="icona-prodotto"></img>
                            </div>
                            <div className="info-prodotti-carrello-left">
                                <p className="info-nome">Mensola in legno 20x180 abete</p>
                                <p className="info-carr">Set: <span>Fire</span></p>
                                <p className="info-carr">Misure: 20x180x30</p>
                                <div className="gestione-quantita">
                                    <div className="minus">
                                        <FaMinus/>
                                    </div>
                                    <textarea className="textarea-quantita" defaultValue={0}></textarea>
                                    <div className="plus">
                                        <FaPlus/>
                                    </div>
                                </div>
                            </div>
                            <div className="info-prodotti-carrello-right">
                                <div className="quantita-prodotto">
                                    <div className="prezzo-singolo">
                                        <p>15€</p>
                                    </div>
                                </div>
                                <div className="rimuovi-prodotto-carrello">
                                    <img src={removeitem}></img>
                                    <span>Rimuovi</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sommario-ordine">
                        <p className="sommario-subtitle">Sommario dell'ordine</p>
                        <div className="costo-totale">
                            <p>Totale</p>
                            <p className="sommario-costo-totale">15€</p>
                        </div>
                        <div className="divisore-sommario"/>
                        <Link to="/Carrello/Checkout">
                            <button className="notemptycart-button"><span>Procedi al checkout</span></button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Carrello;