import React, { useEffect } from "react"
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { auth } from "../../database/firebase"
import { doc, getDoc } from "firebase/firestore"
import db from "../../database/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import "../../styles/Profilo/ProfilePage.css"
import { RiArrowDropRightLine } from "react-icons/ri"

function Profilo(){
    const navigate = useNavigate();
    const location = useLocation();

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
                /*Tentativo di accesso da parte di un utente non autenticato*/
                console.log("L'utente che prova ad accedere in Profile non è autenticato");
                navigate("/Login");
            }
        });
    }, []);

    return(
        <div id="pagina-profilo">
            <nav className="nav-profilo">
                <p className="nav-profilo-title">Il mio account</p>
                <Link to="InformazioniPersonali">
                    <div className={`link-nav-profilo ${location.pathname === "/Profilo/InformazioniPersonali" ? "active" : ""}`}>
                        <p>Informazioni personali</p>
                        <div className="profilo-click-icon icon-informazionipersonali">
                            <RiArrowDropRightLine />
                        </div>
                    </div>
                </Link>
                <Link to="CambioPassword">
                    <div className={`link-nav-profilo ${location.pathname === "/Profilo/CambioPassword" ? "active" : ""}`}>
                        <p>Cambio password</p>
                        <div className="profilo-click-icon icon-cambiopassword">
                            <RiArrowDropRightLine />
                        </div>
                    </div>
                </Link>
                <Link to="CronologiaOrdini">
                    <div className={`link-nav-profilo ${location.pathname === "/Profilo/CronologiaOrdini" ? "active" : ""}`}>
                        <p>Cronologia ordini</p>
                        <div className="profilo-click-icon icon-cronologiaordini">
                            <RiArrowDropRightLine />
                        </div>
                    </div>
                </Link>
            </nav>
            
            <div className="profilo-container">
                <Outlet/>
            </div>
        </div>
    )
}

export default Profilo;