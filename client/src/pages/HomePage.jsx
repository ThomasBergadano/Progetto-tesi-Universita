import React, { useState, useEffect, useRef }  from "react"
import { Link, useNavigate } from "react-router-dom"
import db from "../database/firebase"
import { auth } from "../database/firebase"
import { doc, getDoc, getDocs, setDoc, collection, query, where, getFirestore, addDoc } from "firebase/firestore"

import furniture from  '../assets/images/furniture.png'
import aesthetic2 from  '../assets/images/aesthetic2.png'
import newsletter from "../assets/images/newsletter.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import '../styles/HomePage.css'

function Home() {
    const [emailNewsletter, setEmailNewsletter] = useState("");
    const newsLetterForm = useRef();
    const navigate = useNavigate();

    /*Costanti per l'ottenimento della data attuale*/
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2,'0');
    const month = String(currentDate.getMonth()+1).padStart(2,'0');
    const year = String(currentDate.getFullYear()).slice(2);
    const dataFormattata = `${day}/${month}/${year}`;

    /*Array per il caricamento di categorie e sottocategorie*/
    const [categorie, setCategorie] = useState([]);
    const [sottocategorie, setSottoCategorie] = useState([]);


    useEffect(() => {
        /*Teletrasporto l'utente all'inizio della pagina appena viene fatto il rendering*/
        window.scrollTo(0, 0);

        /*Caricamento delle categorie*/
        const fetchCategorie = async () => {
            const RiferimentoRaccoltaCategoria = collection(db, 'Categoria');
            const snapshotCategorie = await getDocs(RiferimentoRaccoltaCategoria);

            const arrayCategorie = [];
            const arraySottocategorie = [];

            for(const categoriaDoc of snapshotCategorie.docs){
                arrayCategorie.push(categoriaDoc.data());

                /*Caricamento delle sottocategorie*/
                const RiferimentoRaccoltaSottoCategoria = collection(categoriaDoc.ref, "SottoCategoria");
                const sottoCategoriaSnapshot = await getDocs(RiferimentoRaccoltaSottoCategoria);
    
                for(const sottocategoriaDoc of sottoCategoriaSnapshot.docs){
                    arraySottocategorie.push(sottocategoriaDoc.data().NomeSottoCategoria);
                }
            }

            setCategorie(arrayCategorie);
            setSottoCategorie(arraySottocategorie);
        }
        fetchCategorie();
    }, [])


    /*Inserimento dello user nella newsletter*/ 
    const handlerNewsletter = async(e) => {
        e.preventDefault();

        /*Controllo se sono autenticato*/
        if(!auth.currentUser){
            navigate("/Login");
            return;
        }

        /*Controllo se l'utente ha inserito l'email*/
        if(!emailNewsletter){
            alert("Inserisci un indirizzo email valido");
            return;
        }
        
        /*Controllo se l'email inserita è uguale a quella dell'utente. 
        Non c'è bisogno di controllare in fb authentication se la mail esista o meno, perchè se l'utente è 
        loggato significa che la mail sarà registrata di sicuro*/
        if(auth.currentUser.email !== emailNewsletter){
            alert("Hai inserito una mail non tua!");
            setEmailNewsletter("");
            newsLetterForm.current.reset();
            return;
        }
        
        /*Inserimento utente nella raccolta "Newsletter" di firebase, controllando che l'utente non si sia già registrato*/
        const riferimentoRaccoltaNewsletter = collection(db, "Newsletter");
        
        const queryIfUtenteRegistrato = query(riferimentoRaccoltaNewsletter, where('UserID', '==', auth.currentUser.uid))
        const UtenteEsistenteSnapshot = await getDocs(queryIfUtenteRegistrato);
        if(!UtenteEsistenteSnapshot.empty){
            alert("Ti sei già registrato!");
            setEmailNewsletter("");
            newsLetterForm.current.reset();
            return;
        }
        
        const NewsletterUserDocument = await addDoc(riferimentoRaccoltaNewsletter, {
            UserID: auth.currentUser.uid,
            dataRegistrazione: dataFormattata,
        });
        alert("Ben fatto, ti sei registrato alla newsletter");

        
        setEmailNewsletter("");
        newsLetterForm.current.reset();
    }

    /* Ricerca dell'utente di una particolare categoria di prodotti */
    const handlerCercaCategoria = (NomeCategoria) => {
        //encoreURIComponent converte una stringa in un formato url ('Mobili e arredo per ufficio' -> "Mobili%20e%20arredo%20per%20ufficio")
        navigate(`/CatalogoProdotti?categoria=${encodeURIComponent(NomeCategoria)}`);
    }


    return(
        <div id="homepage">
            <div id="hero-image">
                <img src={ furniture } alt="Hero Image"/>
                <span className="hero-image-phrase1">Accomodati,</span>
                <span className="hero-image-phrase2">Sentiti a casa!</span>
                <Link to="/CatalogoProdotti">
                    <button className="button-hero-image">Scopri i nostri prodotti</button>
                </Link>
            </div>

            <div id="newsletter">
                <div className="shoutout-newsletter">
                    <p className="newsletter-title">Iscriviti alla newsletter</p>
                    <p className="newsletter-description">Vuoi rimanere sempre aggiornato sulle ultime novità, offerte esclusive e tendenze nel mondo dell'arredamento? Iscriviti alla nostra newsletter e sarai il primo a scoprire le ultime collezioni, suggerimenti per l'arredamento e promozioni speciali! Riceverai direttamente nella tua casella di posta elettronica le nostre migliori proposte, pensate apposta per te.</p>
                    <form className="newsletter-form" method="post" ref={newsLetterForm}>
                        <input type="email" className="newsletter-input-form" placeholder="Inserisci il tuo indirizzo email" autoComplete="email" onChange={(e) => setEmailNewsletter(e.target.value)}/>
                        <button className="newsletter-btn" onClick={(e) => handlerNewsletter(e)}>Iscriviti</button>
                    </form>
                </div>
                <div className="image-newsletter">
                    <img src={newsletter} alt="newsletter-image"/>
                </div>
            </div>

            <div id="presentazione-categorie">
                <div className="presentazione-categorie-titolo">
                    <p>Scopri le nostre categorie</p>
                </div>
                <div className="presentazione-categorie-cards">
                    {categorie.map((categoria, index) => (
                        <div className="card-categoria" key={index}>
                            <div className="card-categoria-nome">
                                <p>{categoria.NomeCategoria}</p>
                            </div>
                            <div className="categoria-img">
                                <img src={categoria.ImmagineUrl} alt="immagine-categoria"></img>
                                <button className="cerca-categoria" onClick={() => handlerCercaCategoria(categoria.NomeCategoria)}>
                                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div id="advice-section">
                <img src={ aesthetic2 } alt="Advice section"/>
                <span className="advice-section-span">Vuoi sapere di più su di noi?</span>
                <span className="advice-section-span-small">Cerchermo di fornirti tutte le informazioni che cerchi</span>
                <Link to="/ChiSiamo">
                    <button className="button-advice-section">Scopri chi siamo</button>
                </Link>
            </div>
        </div>
    )
}

export default Home;