import React, { useState, useEffect } from "react"
import { useNavigate, Link } from 'react-router-dom'
import { auth } from "../database/firebase"
import db from "../database/firebase"
import { doc, getDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import "../styles/CheckoutPage.css"

import emptycart from "../assets/images/empty-cart.svg"
import { FaPlus } from "react-icons/fa"
import { FaMinus } from "react-icons/fa"
import soggiorno from '../assets/images/soggiorno.jpg'
import removeitem from '../assets/images/removeitem.png'
import GooglePay from "../assets/images/metodi-pagamento/GooglePay.png"
import MasterCard from "../assets/images/metodi-pagamento/MasterCard.png"
import PayPal from "../assets/images/metodi-pagamento/PayPal.png"
import visa from "../assets/images/metodi-pagamento/VISA.png"
import postepay from "../assets/images/metodi-pagamento/postepay.png"
import pp from "../assets/images/metodi-pagamento/pp.jpg"



function Checkout() {
    const [metodoPagamento, setMetodoPagamento] = useState("carta_di_credito");

    const handlerMetodoPagamento = (e) => {
        setMetodoPagamento(e.target.value);
    };

    return(
        <div id="checkout">
            <div className="checkout-containter">
                <div className="informazioni-checkout">
                    <div className="checkout-spedizione">
                        <div className="spedizione-sx">
                            <p className="checkout-titolo">Indirizzo di spedizione ed info</p>
                            <p className="checkout-info b">Nome e Cognome: <span>Nome Cognome</span></p>
                            <p className="checkout-info">Numero di telefono: <span>3867256819</span></p>
                            <p className="checkout-info">Città e provincia: <span>Roma, Italy, 00048</span></p>
                            <p className="checkout-info">Indirizzo: <span>Via Longhena 34</span></p>
                        </div>
                        <div className="spedizione-dx">
                            <button className="modifica-dati-check"><span>Modifica dati</span></button>
                        </div>
                    </div>
                    <div className="checkout-pagamento">
                        <p className="checkout-titolo">Modalità di pagamento</p>
                        <div className="metodo-pagamento-select">
                            <div className="payment-item">
                                <label>
                                    <input type="radio" value="carta_di_credito" checked={metodoPagamento === "carta_di_credito"} onChange={(e) => handlerMetodoPagamento(e)}/>
                                    <span>Carta di Credito/Debito</span>
                                </label>
                                <img className="payment-img" src={visa}/>
                                <img className="payment-img" src={MasterCard}/>
                                <img className="payment-img-postepay" src={pp}/>
                            </div>
                            <div className="payment-item">
                                <label>
                                    <input type="radio" value="paypal" checked={metodoPagamento === "paypal"} onChange={(e) => handlerMetodoPagamento(e)}/>
                                    <span>PayPal</span>
                                </label>
                                <img className="payment-img-paypal" src={PayPal}/>        
                            </div>
                            <div className="payment-item" >
                                <label>
                                    <input type="radio" value="googlepay" checked={metodoPagamento === "googlepay"} onChange={(e) => handlerMetodoPagamento(e)}/>
                                    <span>Google Pay</span>
                                </label>
                                <img className="payment-img-googlepay" src={GooglePay}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="riepilogo-ordine">
                    <p className="riepilogo-subtitle">Riepilogo dell'ordine</p>
                    <div className="costo-totale-checkout">
                        <p>Costo prodotti</p>
                        <p className="riepilogo-costo-totale">24,00€</p>
                    </div>
                    <div className="costo-totale-checkout">
                        <p>Spese di trasporto</p>
                        <p className="riepilogo-spese-trasporto">15,00€</p>
                    </div>
                    <div className="somma-totale">
                        <p>Somma totale</p>
                        <p className="riepilogo-somma-totale">39,00€</p>
                    </div>
                    <div className="divisore-riepilogo"/>
                    <button className="ordina-button"><span>ORDINA</span></button>
                </div>
            </div>
        </div>
    )
}

export default Checkout;

/*
                        <select className="metodo-pagamentt">
                            <option value="cartaCredito">Carta di Credito/Debito</option>
                            <option value="paypal">PayPal</option>
                            <option value="googlePay">Google Pay</option>
                        </select>
                        <div className="pagamenti-icon">
                            <img src={visa} alt="Carta di Credito/Debito" />
                            <img src={PayPal} alt="PayPal" />
                            <img src={GooglePay} alt="Google Pay" />
                        </div>
                        */