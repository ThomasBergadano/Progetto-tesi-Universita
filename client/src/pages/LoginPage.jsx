import React from "react";
import Header from "../components/HeaderComponent"
import Footer from "../components/FooterComponent"
import "../styles/Login.css"

function Login() {
    return(
        <div id="login">
            <form className="login-form">
                <div className="email-input">
                    <label for="email-label">Email</label>
                    <input type="text" placeholder="Email" name="email" required/>
                </div>
                <div className="password-input">
                    <label for="password-label">Password</label>
                    <input type="text" placeholder="Enter Username" name="password" required/>
                </div>
                <button class="button-input"><span className="button-text">Login</span></button>
            </form>                
        </div>
    )
}

export default Login;