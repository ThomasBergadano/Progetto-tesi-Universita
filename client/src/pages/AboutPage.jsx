import React from "react"
import lumia2 from "../assets/images/Lumia2.png"
import responsabile from "../assets/images/responsabile.png"
import "../styles/AboutPage.css"

function About() {
    return(
        <div id="aboutpage">
            <div className="about-riga1">
                <div className="chi-siamo">
                    <span className="sottotitolo-chi-siamo">Chi siamo?</span>
                    <p>"Attraverso le nebbie del tempo, emerge una storia intrecciata di avventure e misteri. Un viaggiatore solitario si addentra nella foresta, affrontando sfide e scoprendo segreti nascosti. Le foglie cadute sotto i suoi passi narrano storie dimenticate, mentre il vento sussurra antiche melodie. Nell'oscurità della notte, la luna veglia silenziosa, rivelando un mondo di possibilità infinite."</p>
                </div>
                <div className="about-logo">
                    <img className="lumia-about" src={lumia2} alt="Logo"></img>
                </div>
            </div>

            <div className="about-riga2">
                <p>"La tua casa dovrebbe raccontare la storia di chi sei, ed essere una collezione di ciò che ami"</p>
                <p>"Il buon design è visivamente potente, intellettualmente elegante e, soprattutto, senza tempo"</p>
            </div>

            <div className="about-riga3">
                <div className="riga3-immagini">
                    <div className="riga3-immagine1">

                    </div>
                    <div className="riga3-immagine2">

                    </div>
                </div>
                <div className="box-obiettivo">
                    <span className="sottotitolo-obiettivo">Il nostro obiettivo</span>
                    <p>"Attraverso le nebbie del tempo, emerge una storia intrecciata di avventure e misteri. Un viaggiatore solitario si addentra nella foresta, affrontando sfide e scoprendo segreti nascosti. Le foglie cadute sotto i suoi passi narrano storie dimenticate, mentre il vento sussurra antiche melodie. Nell'oscurità della notte, la luna veglia silenziosa, rivelando un mondo di possibilità infinite."</p>
                    <p>"Attraverso le nebbie del tempo, emerge una storia intrecciata di avventure e misteri. Un viaggiatore solitario si addentra nella foresta, affrontando sfide e scoprendo segreti nascosti. Le foglie cadute sotto i suoi passi narrano storie dimenticate, mentre il vento sussurra antiche melodie. Nell'oscurità della notte, la luna veglia silenziosa, rivelando un mondo di possibilità infinite."</p>
                </div>
            </div>

            <div className="about-riga4">
                <div className="responsabile">
                    <img className="img-responsabile" src={responsabile} alt="immagine-responsabile"></img>
                    <div className="responsabile-info">
                        <span className="responsabile-nome">Nome Cognome</span>
                        <span>CEO dell'azienda, in attività da 10 anni</span>
                    </div>
                </div>
                <div className="responsabile">
                    <img className="img-responsabile" src={responsabile} alt="immagine-responsabile"></img>
                    <div className="responsabile-info">
                        <span className="responsabile-nome">Nome Cognome</span>
                        <span>Vice direttore, opeativo dal 2018</span>
                    </div>
                </div> 
                <div className="responsabile">
                    <img className="img-responsabile" src={responsabile} alt="immagine-responsabile"></img>
                    <div className="responsabile-info">
                        <span className="responsabile-nome">Nome Cognome</span>
                        <span>Possiede una quota del 20% della società</span>
                    </div>
                </div> 
            </div>

            <div className="about-riga5">
                <div className="indirizzi">
                    <span className="span-indirizzi">Indirizzi e recapiti</span>
                    <span>Via XXXXX N°31, Torino</span>
                    <span>+39 XXX XXX XXXX</span>
                    <span>lumiaarredamenti@lumiarr.com</span>
                </div>
                <div className="orari">
                    <span className="span-orari">Orari negozio: </span>
                    <span className="orario-negozio">LUN-VEN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 08:30 - 13:30, 14:30 - 18:30</span>
                    <span className="orario-negozio">SAB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 08:30 - 12:30, 13:30 - 16:30</span>
                    <span className="orario-negozio">DOM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; CHIUSO</span>
                </div>
            </div>  
        </div>
    )
}

export default About;