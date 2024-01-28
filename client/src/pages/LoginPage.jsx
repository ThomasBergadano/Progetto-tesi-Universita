import React, { useState, useEffect }  from "react"
import { Link } from 'react-router-dom'
import axios from "axios"
import "../styles/Login.css"
import { IoHome } from "react-icons/io5";
import logo from '../assets/images/Lucciola.png'

function Login() {
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
        <div id="full-page">
            <div id="login">
                <h2>Accedi!</h2>
                <p className="link-to-signup">Non hai ancora un account? <Link to="/Signup"><span className="crea-account">Crea un nuovo account</span></Link></p>
                <form className="login-form" method="POST">
                    <div className="email-input">
                        <label htmlFor="email" className="label">Email</label>
                        <input type="text" className="input-form" placeholder="Email" name="email" onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className="password-input">
                        <label htmlFor="password" className="label">Password</label>
                        <input type="password" className="input-form" placeholder="Password" name="password" onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    <input type="checkbox" id="myCheckbox" name="myCheckbox"></input>
                    <label htmlFor="myCheckbox" className="checkbox-label">Ricordami</label>
                    <Link to="/Login"><span className="password-dimenticata">Password dimenticata?</span></Link>
                    <button className="button-login" onClick={(e) => Accedi(e)}><span>Login</span></button>
                </form>
            </div>
            <Link to="/">
                <div className="icon-container">
                    <div className="icon-home">
                        <IoHome/>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default Login;

/*
    <img id="logo" src={logo} alt="Logo"></img>
*/