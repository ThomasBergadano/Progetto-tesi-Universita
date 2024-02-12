import React, { useState, useEffect }  from "react"
import { Link, useNavigate } from 'react-router-dom'
import FilterFloatingButton from "../components/FilterFloatingButton"
import "../styles/CatalogoProdottiPage.css"

function CatalogoProdotti() {
    /*Variabili e costanti*/
    const [showButton, setShowButton] = useState(true); //useState(false);
    const [numeroProdotto, setNumeroProdotti] = useState(0);

    /*Gestione per l'apparizione del floating button per il filtro*/
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            /*const headerHeight = 151;*/
            const headerHeight = 0;
            const bottomThreshold = document.documentElement.scrollHeight - 300;
    
            const footer = document.querySelector('footer'); /*ottengo l'elemento del 'footer' dal CSS*/
            const footerTop = footer.getBoundingClientRect().top; /*ottengo altezza del borso superiore del footer*/
            const distanceToFooter = footerTop - window.innerHeight; /*Calcolo distanza tra footer e bordo inferiore della finestra visualizzata*/

            if (scrollPosition >= headerHeight && scrollPosition < bottomThreshold && distanceToFooter>0) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };
    
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    /*Effetto del floating button filter per scollare in cima alla pagina*/
    const scrollToTop = () => {
        const scrollDuration = 500;
        const scrollStep = -window.scrollY / (scrollDuration / 15);
        
        const scrollInterval = setInterval(() => {
            if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep);
            } else {
            clearInterval(scrollInterval);
            }
        }, 15);
    };
    


    return(
        <div id="catalogo">

            <div id="filter">
                <div className="filter-ricerca">
                    <div className="filtro-superiore">
                        <div className="nomeprodotto-cercaprodotto">
                            <label className="label-filter">Nome prodotto </label>
                            <input type="text" placeholder="Nome prodotto" autoComplete="Nome" required/>
                        </div>
                        <div className="categoria-cercaprodotto">
                            <label className="label-filter">Categoria </label>
                            <select name="categoria">
                                <option value="s">Seleziona la categoria</option>
                            </select>
                        </div>
                        <div className="sottocategoria-cercaprodotto">
                            <label className="label-filter">Sottocategoria</label>
                            <select name="sottocategoria">
                                <option value="s">Seleziona la sottocategoria</option>
                            </select>
                        </div>
                        <div className="prezzo-cercaprodotto">
                            <label className="label-filter">Prezzo (min/max) </label>
                            <div className="input-in-riga">
                                <input type="text" placeholder="Min €" autoComplete="0" required/>
                                <input type="text" placeholder="Max €" autoComplete="200" required/>
                            </div>
                        </div>
                    </div>
                    <div className="filtro-inferiore">
                        <div className="colore-cercaprodotto">
                            <label className="label-filter">Colore </label>
                            <select name="colore">
                                <option value="s">Seleziona il colore</option>
                            </select>
                        </div>
                        <div className="altezza-cercaprodotto">
                            <label className="label-filter">Altezza (min/max) </label>
                            <div className="input-in-riga">
                                <input type="text" placeholder="Min (cm)" autoComplete="0" required/>
                                <input type="text" placeholder="Max (cm)" autoComplete="200" required/>
                            </div>
                        </div>
                        <div className="lunghezza-cercaprodotto">
                            <label className="label-filter">Lunghezza (min/max) </label>
                            <div className="input-in-riga">
                                <input type="text" placeholder="Min (cm)" autoComplete="0" required/>
                                <input type="text" placeholder="Max (cm)" autoComplete="200" required/>
                            </div>
                        </div>
                        <div className="profondita-cercaprodotto">
                            <label className="label-filter">Profondita (min/max) </label>
                            <div className="input-in-riga">
                                <input type="text" placeholder="Min (cm)" autoComplete="0" required/>
                                <input type="text" placeholder="Max (cm)" autoComplete="200" required/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="filtro-bottone">
                    <button className="bottone-filtro">Cerca</button>
                </div>
            </div>
            
            <div id="visualizzazione-prodotti">
                <div className="ordina-prodotti">
                    <label className="label-sort">Ordina per</label>
                    <select name="ordina prodotti">
                        <option value="s">ordina per</option>
                    </select>
                </div>
                <span className="numero-prodotti-disponibili">{numeroProdotto} Risultati</span>
            </div>

            <div className="blocchi">
                <div className="blocco">

                </div>
                <div className="blocco">

                </div>
                <div className="blocco">

                </div>
                <div className="blocco">
                    
                </div>
            </div>
            <p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p>
            <p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p>
            <p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p>
            <p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p>
            {showButton &&
                <Link to="/CatalogoProdotti" onClick={scrollToTop}>
                    <FilterFloatingButton/>
                </Link>
            }
        </div>
    )
}

export default CatalogoProdotti;

/*

                <select className="select-categoria" name="categoria">
                    <option value="s">Seleziona il colore</option>
                </select>

                */