import React, { useState, useEffect }  from "react"
import { Link } from 'react-router-dom'
/*import { Authentication } from "../components/Authentication"*/
import "../styles/Signup.css"
import { IoHome } from "react-icons/io5";

function Signup() {
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function Registrati(e){
        e.preventDefault();
        try{
            await axios.post("http://localhost:8000/Signup",{
                nome, cognome, email, password
            })
        }
        catch(e){
            console.log(e);
        }
    }

    return(
        <div id="full-page">
            <div id="signup">
                <h2>Crea un account</h2>
                <p className="link-to-login">Hai già un account? <Link to="/Login"><span className="accedi">Accedi</span></Link></p>
                <form className="signup-form">
                    <div className="name-inputs">
                        <div className="first-name-input">
                            <label htmlFor="first-name" className="label">Nome</label>
                            <input type="text" className="half-form" placeholder="Nome" name="first-name" onChange={(e) => setNome(e.target.value)} required/>
                        </div>
                        <div className="last-name-input">
                            <label htmlFor="last-name">Cognome</label>
                            <input type="text" className="half-form" placeholder="Cognome" name="last-name" onChange={(e) => setCognome(e.target.value)} required/>
                        </div>
                    </div>
                    <div className="email-input">
                        <label htmlFor="email" className="label">Email</label>
                        <input type="email" className="full-form" placeholder="Email" name="email" onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className="passwords-section-input">
                        <div className="password-in">
                            <label htmlFor="password" className="label">Password</label>
                            <input type="password" className="half-form" placeholder="Password" name="password" onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        <div className="repeat-password-input">
                            <label htmlFor="repeat-password" className="label">Ripeti password</label>
                            <input type="password" className="half-form" placeholder="Ripeti password" name="ripeti-password" onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                    </div>
                    <div className="phone-number-input">
                        <label htmlFor="phone" className="label">Numero di telefono</label>
                        <input type="tel" className="half-form" placeholder="000 000 0000" name="phone" onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                </form>
                <button class="button-signup" onClick={Registrati}><span className="button-text">Registrati</span></button>           
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

export default Signup;

/*
    <div className="phone-input-container">
    <select defaultValue="+39" className="prefisso-paesi">
        <option value="+39">Italia (+39) </option>
        <option value="+33" data-label="Francia">(+33) Francia</option>
        <option value="+49">Germania (+49)</option>
        <option value="+386">Slovenia (+386)</option>
        <option value="+43">Austria (+43)</option>
        <option value="+41">Svizzera (+41)</option>
        <option value="+377">Monaco (+377)</option>
        <option value="+378">San Marino (+378)</option>
        <option value="+39">Città del Vaticano (+39)</option>
        <option value="+376">Andorra (+376)</option>
        <option value="+352">Lussemburgo (+352)</option>
        <option value="+356">Malta (+356)</option>
        <option value="+377">Monaco (+377)</option>
        <option value="+34">Spagna (+34)</option>
        <option value="+351">Portogallo (+351)</option>
        <option value="+31">Paesi Bassi (+31)</option>
        <option value="+32">Belgio (+32)</option>
        <option value="+44">Regno Unito (+44)</option>
    </select>
    <input type="tel" className="half-form" placeholder="000 000 0000" name="phone" onChange={(e) => setEmail(e.target.value)} required/>
</div>
*/

/* <Authentication/> */
/*
<div className="repeat-password-input">
    <label for="repeat-password-label">Ripeti password</label>
    <input type="text" placeholder="Ripeti password" name="repeat-password" required/>
</div>
*/
/*

*/
