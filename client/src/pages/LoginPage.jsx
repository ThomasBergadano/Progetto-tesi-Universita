import React, { useState, useEffect }  from "react"
import Header from "../components/HeaderComponent"
import Footer from "../components/FooterComponent"
import "../styles/Login.css"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Login() {
    //const history = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const Accedi = async(e) =>{
        e.preventDefault();
        try{
            console.log('La mia richiesta:', { email, password });
            const response = await axios.post("http://localhost:3000/Api/Login",{
                email, password
            });

            if(response.data === "login_confirm"){
                console.log("Login riuscito");
                alert(`Richiesta ricevuta: ${email}, ${password}`);
            }
        }
        catch(e){
            console.error("Errore durante il login:", e);
        }
    }

    return(
        <div id="login">
            <form className="login-form" method="POST">
                <div className="email-input">
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" placeholder="Email" name="email" onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="password-input">
                    <label htmlFor="password">Password</label>
                    <input type="text" id="password" placeholder="Enter Username" name="password" onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button className="button-input" onClick={(e) => Accedi(e)}><span className="button-text">Login</span></button>
            </form>
        </div>
    )
}

export default Login;