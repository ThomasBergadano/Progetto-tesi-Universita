import React, { useState, useEffect }  from "react"
import { Authentication } from "../components/Authentication"
import "../styles/Signup.css"

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
        <div id="signup">
            <form className="signup-form">
                <div className="first-name-input">
                    <label for="first-name-label">Nome:</label>
                    <input type="text" placeholder="Nome" name="first-name" onChange={(e) => setNome(e.target.value)} required/>
                </div>
                <div className="last-name-input">
                    <label for="last-name-label">Cognome</label>
                    <input type="text" placeholder="Cognome" name="last-name" onChange={(e) => setCognome(e.target.value)} required/>
                </div>
                <div className="email-input">
                    <label for="email-label">Email</label>
                    <input type="text" placeholder="Email" name="email" onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="password-input">
                    <label for="password-label">Password</label>
                    <input type="password" placeholder="Password" name="password" onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button class="button-input" onClick={Registrati}><span className="button-text">Registrati</span></button>
            </form>                
        </div>
    )
}

export default Signup;

/* <Authentication/> */
/*
<div className="repeat-password-input">
    <label for="repeat-password-label">Ripeti password</label>
    <input type="text" placeholder="Ripeti password" name="repeat-password" required/>
</div>
*/
/*

*/
