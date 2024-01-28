import React, { useEffect, useState } from 'react'
import RoutingComponents from './components/RoutingComponents.jsx'

function App() {  
  useEffect(() => {
      document.title = 'Lumia Arredamenti';
  }, []);

  return(
      <RoutingComponents/>
  )
}

export default App; 



/*
  /*CHIAMATA JSON DA SERVER*/
  /*const [backendData, setBackendData] = useState([]);
  useEffect(() => { 
    fetch('http://localhost:3000/api/utenti') 
      .then(res => res.json()) 
      //.then(text => console.log(text)); 
      .then(data => { setBackendData(data); }) 
      .catch(error => console.error('Errore nella richiesta fetch:', error));
  },[])
*/

/*
    return () => {
      document.title = 'Lumia Arredamenti'; //Titolo che verrà utilizzato nel caso in cui il componente App venisse smontato (=se e quando, per qualsiasi ragione, il DOM venisse modificato)
    };
*/