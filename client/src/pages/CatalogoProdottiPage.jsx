import React from "react";
import it from '../assets/images/it.png'
import en from '../assets/images/en.png'

function CatalogoProdotti() {
    return(
        <div>
            <div id="catalogo">
                <p>CatalogoProdottiComponent</p>
                <img src={it} alt="ITA"/>
                <img src={en} alt="ENG"/>
                <p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p><p>  .</p>
            </div>
        </div>
    )
}

export default CatalogoProdotti;