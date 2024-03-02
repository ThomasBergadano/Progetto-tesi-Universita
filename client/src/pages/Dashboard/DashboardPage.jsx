import React, { useState, useEffect, useRef } from "react"
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { auth } from "../../database/firebase"
import { doc, getDoc, getDocs, setDoc, collection, query, where, getFirestore, addDoc } from "firebase/firestore"
import db from "../../database/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { FaUpload } from "react-icons/fa6"
import "../../styles/Dashboard/DashboardPage.css"
import { RiArrowDropRightLine } from "react-icons/ri"

function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    /*Array per il caricamento di categorie e sottocategorie*/
    const [categorie, setCategorie] = useState([]);
    const [sottocategorie, setSottoCategorie] = useState([]);

    /*Costanti per inserimento prodotti*/
    const [categoriaProdotto, setCategoriaProdotto] = useState("");
    const [sottocategoriaProdotto, setSottoCategoriaProdotto] = useState("");
    const [nomeProdotto, setNomeProdotto] = useState("");
    const [nomeSet, setNomeSet] = useState("");
    const [descrizioneProdotto, setDescrizioneProdotto] = useState("");
    const [prezzoProdotto, setPrezzoProdotto] = useState("");
    const [quantitaProdotto, setQuantitaProdotto] = useState("");
    const [altezzaProdotto, setAltezzaProdotto] = useState("");
    const [lunghezzaProdotto, setLunghezzaProdotto] = useState("");
    const [profonditaProdotto, setProfonditaProdotto] = useState("");
    const [coloreProdotto, setColoreProdotto] = useState("");
    const inserimentoProdottoRef = useRef(); /*Riferimento all'elemento nel DOM in modo da resettare gli input*/


    useEffect(() => {

        /*Teletrasporto l'utente all'inizio della pagina appena viene fatto il rendering*/
        window.scrollTo(0, 0);

        /*Gestione autorizzazone e permessi per accesso in /Dashboard*/
        onAuthStateChanged(auth, async (user) => {
            if(user) {
              const userUID = user.uid;
              const RiferimentoDocumentoUtente = await doc(db, 'Utenti', userUID);
              const DocumentoUtente = await getDoc(RiferimentoDocumentoUtente);
              
              if(DocumentoUtente.exists()){
                const ruoloUtente = DocumentoUtente.data().ruolo;
                if(ruoloUtente!=="Admin"){
                    navigate("/");
                }
              }
              else{
                console.log("L'utente che prova ad accedere in Dashboard non esiste");
                navigate("/");
              }
            }
            else {
                console.log("L'utente che prova ad accedere in Dashboard non è autenticato");
                navigate("/");
            }
        });
    }, []);



    return(
        <div id="dashboardpage">
            <nav className="nav-dashboard">
                <p className="nav-dashboard-title">Dashboard</p>
                <Link to="GestioneUtenti">
                    <div className={`link-nav-dashboard ${location.pathname === "/Dashboard/GestioneUtenti" ? "active" : ""}`}>
                        <p>Gestione Utenti</p>
                        <div className="dashboard-click-icon icon-gestioneutenti">
                            <RiArrowDropRightLine />
                        </div>
                    </div>
                </Link>
                <Link to="GestioneProdotti">
                    <div className={`link-nav-dashboard ${location.pathname === "/Dashboard/GestioneProdotti" ? "active" : ""}`}>
                        <p>Gestione Prodotti</p>
                        <div className="dashboard-click-icon icon-gestioneprodotti">
                            <RiArrowDropRightLine />
                        </div>
                    </div>
                </Link>
            </nav>

            <div className="dashboard-container">
                <Outlet/>
            </div>
        </div>
    )
}

export default Dashboard;