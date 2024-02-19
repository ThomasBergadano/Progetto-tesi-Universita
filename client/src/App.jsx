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