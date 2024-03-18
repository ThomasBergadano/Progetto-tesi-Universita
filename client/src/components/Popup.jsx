import React, { useState, useEffect }  from "react"
import { Link, useNavigate } from 'react-router-dom'
import { auth, googleAuthProvider } from "../database/firebase"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { doc, getDoc, getDocs, setDoc, collection, query, where, getFirestore, addDoc } from "firebase/firestore"
import db from "../database/firebase"
import "../styles/Popup.css"


function Popup() {

    let apriPopupBottone = document.querySelectorAll('[data-apri-popup]');
    let chiudiPopupBottone = document.querySelectorAll('[data-chiudi-popup]');
    let overlay = document.getElementById('overlay');
    
    apriPopupBottone.forEach(button => {
        button.addEventListener('click', () => {
            const popup = document.querySelector(button.dataset.apriPopup);
            apriPopup(popup);
        })
    })
    
    chiudiPopupBottone.forEach(button => {
        button.addEventListener('click', () => {
            const popup = button.closest('#popup');
            chiudiPopup(popup);
        })
    })
    
    overlay.addEventListener('click', () => {
        const popup = document.querySelectorAll('#popup.active');
        popup.forEach(popup=> {
            chiudiPopup(popup);
        })
    })
    
    function apriPopup(popup){
        if(popup == null) return
        if(error_handler()==5){
            /*Nome utente nel popup*/
            const nome_u = document.getElementById('nome-input').value;
            const output_nomeu = document.getElementById('nome_utente_popup');
            output_nomeu.innerHTML = nome_u;
            popup.classList.add('active');
            overlay.classList.add('active');
        }
    }
    
    function chiudiPopup(popup){
        if(popup == null) return
        popup.classList.remove('active');
        overlay.classList.remove('active');
    }

    return(
        <>
            <div className="popup" role="region">
                <h2>Ciao, <span id="nome_utente_popup"></span>!</h2>
                <button data-chiudi-popup class="chiudi_popup" type="button" aria-expanded="false" onClick="">X</button>
                <h3>Grazie per la registrazione a </h3>
                <p>I tuoi dati sono stati inseriti con successo!</p>
            </div>
            <div id="overlay"></div>
        </>
    )
}

export default Popup;