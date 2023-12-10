const express = require('express');
const router = express.Router(); //router diventa la nostra piccola App

router
    .route('/')
    .get(async(req, res) => { 
        res.send("Sei nel login");
    })
    .post(async(req, res) => { 
        const{email,password} = req.body
      
        try{
          console.log('Richiesta ricevuta:', { email, password });
          res.json("login_confirm");
        }
        catch(e){
          console.error(e);
          res.status(500).json("Errore durante il login");
        }
    })

module.exports = router;