import React, { useState, useEffect }  from "react"
import it from '../assets/images/it.png'
import en from '../assets/images/en.png'
import lucciola from  '../assets/images/Lucciola.png'
import furniture from  '../assets/images/furniture.png'
import aesthetic2 from  '../assets/images/aesthetic2.png'
import { Link } from "react-router-dom";
import '../styles/HomePage.css'

function Home() {
    return(
        <div>
            <div id="homepage">
                <div id="hero-image">
                    <img src={ furniture } alt="Hero Image"/>
                    <span className="hero-image-phrase1">Accomodati,</span>
                    <span className="hero-image-phrase2">Sentiti a casa!</span>
                    <Link to="/CatalogoProdotti">
                        <button className="button-hero-image">Scopri i nostri prodotti</button>
                    </Link>
                </div>

                <div id="categorie-prodotti">
                    <span>Ecco cosa puoi trovare da noi</span>
                    <span>Ecco cosa puoi trovare da noi</span>
                    <div className="categoria1">
                        <div className="categoria"> 

                        </div>
                    </div>
                    <div className="categoria2">
                        <div className="categoria"> 

                        </div>
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

                <div id="categorie-prodotti">
                    <div className="categoria1">
                        <div className="categoria"> 

                        </div>
                    </div>
                    <div className="categoria2">
                        <div className="categoria"> 

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;