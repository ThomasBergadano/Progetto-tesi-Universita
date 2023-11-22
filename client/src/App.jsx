import React, { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [backendData, setBackendData] = useState([]);

  useEffect(() => { 
    fetch('http://localhost:3000/api/utenti') 
      .then(res => res.json()) 
      //.then(text => console.log(text)); 
      .then(data => { setBackendData(data); }) 
      .catch(error => console.error('Errore nella richiesta fetch:', error));
  },[])
  

  return (
    <>
      <h1>Vite + React</h1>
      <h1>Sto modificando</h1>
      {(typeof backendData.users === 'undefined') ? (
        <p>Loading</p>
      ) : (
        backendData.users.map((user, i) => (
          <p key={i}>{user}</p>
        ))
      )
      }
    </>
  )
}

export default App

/*
return (
  <>
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
    </div>
    <h1>Vite + React</h1>
    <h1>Sto modificando</h1>
    {(typeof backendData.users === 'undefined') ? (
      <p>Loading</p>
    ) : (
      backendData.users.map((user, i) => (
        <p key={i}>{user}</p>
      ))
    )
    }
  </>
)*/