const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;
const login = require("../server/routes/login");

app.use(cors()); //Abilitiamo il CORS
app.use(express.json()); //Converte i json riceventi in oggetti
app.use(express.urlencoded({extended: true}));


app.get('/', (req, res) => { });

/* Autenticazione con login, qualunque tipo di richiesta viene gestita da 'login'*/
app.use('/Api/Login', login);

/* Il "catchall" server: se richiesto qualsiasi altro percorso rispetto alle app.get sopra, restituisci la tua pagina di default */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

