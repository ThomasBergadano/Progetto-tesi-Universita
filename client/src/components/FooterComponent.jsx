import React from "react"
import { Link } from 'react-router-dom'
import '../styles/Footer.css'
import lumialogo from "../assets/images/lumia-logo.svg"
import { FaLinkedin } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaPinterestSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";


function Footer() {
    const scrollToTop = () => {
        const scrollDuration = 500; //ms
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
        <footer>
            <div id="container">
                <div className="foot left-footer">
                    <img id="logo-footer" src={lumialogo} alt="Logo"></img>
                </div>
                <div className="foot center-footer">
                    <div className="center-one">
                        <div className="content">
                            <span>Scopri i nostri prodotti</span>
                            <div className="lista-link">
                                <Link to="/CatalogoProdotti" className="custom-link" onClick={scrollToTop}>Catalogo prodotti</Link>
                                <Link to="/Idee" className="custom-link" onClick={scrollToTop}>Idee e spunti</Link>
                            </div>
                        </div>
                    </div>
                    <div className="center-two">    
                        <div className="content">
                            <span>Aiuto e contatti</span>
                            <div className="lista-link">
                                    <Link to="/ChiSiamo" className="custom-link" onClick={scrollToTop}>Chi siamo</Link>
                                    <Link to="/AssistenzaClienti" className="custom-link" onClick={scrollToTop}>Assistenza clienti</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="foot right-footer">
                    <span>Seguici sui nostri social</span>
                    <div className="social-icon">
                        <div className="social-item">
                            <a href="https://www.linkedin.com/in/thomasbergadano/" target="_blank" rel="noopener noreferrer"><FaLinkedin className="custom-link"/></a>
                        </div>
                        <div className="social-item">
                            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><FaFacebookSquare className="custom-link"/></a>
                        </div>
                        <div className="social-item">
                            <a href="https://www.pinterest.it/" target="_blank" rel="noopener noreferrer"><FaPinterestSquare className="custom-link"/></a>
                        </div>
                        <div className="social-item">
                            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><FaInstagramSquare className="custom-link"/></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright">
                <span className="copyright-content">Copyright © 2024 Lumia Arredamenti - Tutti i diritti riservati</span>
            </div>
        </footer>
    )
}

export default Footer;