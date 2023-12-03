import React from "react";
import '../styles/Footer.css'

function Footer() {
    return(
        <footer>
            <div id="container">
                <div className="foot left-footer">
                    Left footer
                </div>
                <div className="foot center-footer">
                    <div className="center-one">
                        <div className="content">
                            Centro-sinistra
                        </div>
                    </div>
                    <div className="center-two">
                        <div className="content">
                            Centro-destra
                        </div>
                    </div>
                </div>
                <div className="foot right-footer">
                    Right footer
                </div>
            </div>
            <div className="copyright">
                <span className="copyright-content">Copyright © 2023 Lumia - Tutti i diritti riservati</span>
            </div>
        </footer>
    )
}

export default Footer;