import React from "react";
import Header from "../components/HeaderComponent"
import Footer from "../components/FooterComponent"
import "../styles/Signin.css"

function Signin() {
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
                    <input type="text" placeholder="Email" name="email" required/>
                </div>
                <div className="password-input">
                    <label for="password-label">Password</label>
                    <input type="text" placeholder="Password" name="password" required/>
                </div>
                <div className="repeat-password-input">
                    <label for="repeat-password-label">Ripeti password</label>
                    <input type="text" placeholder="Ripeti password" name="repeat-password" required/>
                </div>
                <button class="button-input"><span className="button-text">Registrati</span></button>
            </form>                
        </div>
    )
}

export default Signin;