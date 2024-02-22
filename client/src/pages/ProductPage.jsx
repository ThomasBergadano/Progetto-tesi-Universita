import { useState, useEffect } from "react"
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import soggiorno from '../assets/images/soggiorno.jpg'
import { FaRegHeart } from "react-icons/fa6"
import "../styles/ProductPage.css"


function Product(){
   
    return (
        <div id="pagina-prodotto">
            <div className="informazioni-prodotto">
                <div className="immagine-pagina-prodotto">
                    <img src={soggiorno} alt="icona-prodotto"></img>
                </div>
                <div className="caratteristiche-prodotto">
                    <p className="dettagli"></p>
                    <p className="page-prod-nome">Nome del prodotto ahdslkfjnrkjsdnfm</p>
                    <p className="page-prod-set"><span className="nome-caratteristica">SET: </span>fusgnmldfnmg</p>
                    <p className="page-prod-prezzo">10,20€</p>
                    <p className="page-prod-descrizione">Questo copripiumino grigio chiaro a tinta unita dona uno stile rilassante alla camera da letto e si abbina facilmente ad altri colori. Realizzato in puro cotone, ti offre una sensazione di freschezza naturale e un sonno confortevole.</p>
                    <p className="page-prod-dimensioni"><span className="nome-caratteristica">DIMENSIONI: </span>Lunghezza x Larghezza x Altezza</p>
                    <p className="page-prod-colore"><span className="nome-caratteristica">COLORE: </span>Grigio</p>
                    <div className="page-prod-buttons">
                        <div className="aggiunta-carrello">
                            <button className="aggiungi-carrello">Aggiungi al carrello</button>
                        </div>
                        <div className="prodotto-in-wishlist inside">
                            <FaRegHeart />
                        </div>
                    </div>
                    <div className="page-prod-assistenza">
                        <Link to="/AssistenzaClienti"><p>Serve assistenza?</p></Link>
                    </div>
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

/*
                        <div className="prodotto-in-wishlist">
                            <FaRegHeart />
                        </div>
                        */