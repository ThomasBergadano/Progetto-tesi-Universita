const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors()); // Aggiungi questa linea per abilitare CORS

app.get('/api/utenti', (req, res) => {
  const users = ["User-one", "User-two", "User-three"];
  res.json({ "users": users });
});

/* Il "catchall" server: se richiesto qualsiasi altro percorso rispetto alle app.get sopra, restituisci la tua pagina di default */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


/*--------------------------------- COMMENTI ---------------------------------*/
/*
NPM
info: Non è strettamente necessario installare Node.js per sviluppare applicazioni React, ma spesso si fa perché Node.js fornisce npm (Node Package Manager), uno strumento che semplifica la gestione delle dipendenze e il processo di sviluppo.
      React è solitamente gestito attraverso npm, che consente di installare, aggiornare e gestire le dipendenze del progetto. npm è incluso nell'installazione di Node.js. Quindi, quando installi Node.js, ottieni anche npm.


NODEMON
prompt: npm i nodemon -D
info: helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.
      (sostanzialmente appena aggiorno il codice, questo tool mi fa il re-run dell'applicazione in automatico)


La linea commentata app.use(express.static(path.join(__dirname, 'client/build'))); è comune quando si serve un'applicazione React con Express. Questa riga consente a Express di servire i file statici dalla cartella client/build, che è la cartella di produzione di un'applicazione React dopo che è stato eseguito il processo di build.
In questo modo, quando il client accede alla tua applicazione React, il server risponde con l'index.html e altri file statici necessari per avviare l'app React nel browser del client. Successivamente, l'app React gestisce le interazioni lato client e può fare richieste API al server quando necessario.

app.use(express.static(path.join(__dirname, 'client/build')));


Un sito web tipicamente ha una sola porta associata al protocollo standard utilizzato, che è la porta 80 per HTTP e la porta 443 per HTTPS. Quindi, quando gli utenti accedono a un sito web tramite il loro browser, di solito non è necessario specificare la porta nell'URL. Ad esempio:

http://www.miosito.com (corrisponde a http://www.miosito.com:80)
https://www.miosito.com (corrisponde a https://www.miosito.com:443)
Se un utente tenta di accedere a un sito web specificando una porta diversa, ad esempio http://www.miosito.com:3000, il server risponderà di solito con un errore o con una pagina non trovata. Questo perché il server web di solito è configurato per ascoltare solo su determinate porte (come la 80 per HTTP o la 443 per HTTPS) e non su porte casuali.



CORS:
Definizione: CORS, acronimo di Cross-Origin Resource Sharing, è una politica di sicurezza implementata dai browser web. Questa politica impedisce alle pagine web di fare richieste a un dominio diverso da quello da cui è stata caricata la pagina stessa. La politica CORS è un meccanismo di sicurezza fondamentale per evitare attacchi da parte di terze parti non autorizzate.

const corsOptions = {
  origin: 'http://localhost:your-client-port',
};
app.use(cors(corsOptions));
*/