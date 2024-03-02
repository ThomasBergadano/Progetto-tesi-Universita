import React, { useState, useEffect } from "react"
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { doc, getDoc, getDocs, setDoc, collection, query, where, getFirestore, addDoc } from "firebase/firestore"
import db from "../database/firebase"
import soggiorno from '../assets/images/soggiorno.jpg'
import loading from "../assets/images/loading.gif"
import { FaRegHeart } from "react-icons/fa6"
import "../styles/ProductPage.css"



function Product(){
    /*Caricamento dei parametri (se esistono)*/
    const parametroUrl = window.location.href;
    const paramentro = parametroUrl.split("id:");
    let idParametro = "";
    if(paramentro.length > 1){
        idParametro = paramentro[1];
    }
    else{
        Navigate("/");
        return;
    }

    /*Raccolto l'oggetto (il prodotto) cliccato dall'utente*/
    const [prodottoObject, setProdottoObject] = useState(null);

    useEffect(() => {
        /*Teletrasporto l'utente all'inizio della pagina appena viene fatto il rendering*/
        window.scrollTo(0, 0);

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
                        /*console.log("ID prodotto da URL: ", idParametro);
                        console.log("ID prodotto rilevato: ",prodottoDoc.id);*/
                        if(idParametro === prodottoDoc.id){
                            setProdottoObject(prodottoDoc);
                        }
                    }
                }
            }
        }
        uploadProductInfo();
    }, [])
   
    return (
        <div id="pagina-prodotto">
            <div className="informazioni-prodotto">
                <div className="immagine-pagina-prodotto">
                    <img src={soggiorno} alt="icona-prodotto"></img>
                </div>
                <div className="caratteristiche-prodotto">
                    {prodottoObject === null ? (
                        <img className="loading-gif product-page" src={loading} alt="caricamento"></img>
                    ) : (
                        <>
                        <p className="dettagli"></p>
                        <p className="page-prod-nome">{prodottoObject.data().NomeProdotto}</p>
                        <p className="page-prod-set"><span className="nome-caratteristica">SET: </span>{prodottoObject.data().NomeSet}</p>
                        <p className="page-prod-prezzo">{prodottoObject.data().Prezzo}€</p>
                        <p className="page-prod-descrizione">{prodottoObject.data().Descrizione}</p>
                        <p className="page-prod-dimensioni"><span className="nome-caratteristica">DIMENSIONI: </span>{prodottoObject.data().Lunghezza}cm x {prodottoObject.data().Profondita}cm x {prodottoObject.data().Altezza}cm</p>
                        <p className="page-prod-colore"><span className="nome-caratteristica">COLORE: </span>{prodottoObject.data().Colore}</p>
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

/*
                        <div className="prodotto-in-wishlist">
                            <FaRegHeart />
                        </div>
                        */