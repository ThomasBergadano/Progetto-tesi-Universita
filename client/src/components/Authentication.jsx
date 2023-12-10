import React, { useState } from "react";
import { auth } from "../database/firebase"
import {createUserWithEmailAndPassword} from "firebase/auth" //metodo

function Authentication() {
    /*Variabili e funzioni per la creazione di un utente*/
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const signIn = async() => {
        await createUserWithEmailAndPassword(auth, email, password)
    };


    return(
        <div id="signin">
            <form className="signin-form">
                <div className="first-name-input">
                    <label for="first-name-label">Nome:</label>
                    <input type="text" placeholder="Nome" name="first-name" required/>
                </div>
                <div className="last-name-input">
                    <label for="last-name-label">Cognome</label>
                    <input type="text" placeholder="Cognome" name="last-name" required/>
                </div>
                <div className="email-input">
                    <label for="email-label">Email</label>
                    <input type="text" placeholder="Email" name="email" onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="password-input">
                    <label for="password-label">Password</label>
                    <input type="password" placeholder="Password" name="password" onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <div className="repeat-password-input">
                    <label for="repeat-password-label">Ripeti password</label>
                    <input type="text" placeholder="Ripeti password" name="repeat-password" required/>
                </div>
                <button class="button-input" onClick={signIn}><span className="button-text">Registrati</span></button>
            </form>                
        </div>
    )
}

export { Authentication };