import React, { useEffect, useState } from 'react'
import Header from './HeaderComponent.jsx'
import Home from './HomeComponent.jsx'
import About from './AboutComponent.jsx'
import CatalogoProdotti from './CatalogoProdottiComponent.jsx'
import IdeeSpunti from './IdeeSpuntiComponent.jsx'
import AssistenzaClienti from './AssistenzaClientiComponent.jsx'
import Dashboard from './DashboardComponent.jsx'
import Login from './LoginComponent.jsx'
import Signin from './SigninComponent.jsx'
import Profilo from './ProfileComponent.jsx'
import Wishlist from './WishlistComponent.jsx'
import Carrello from './CarrelloComponent.jsx'
import Footer from './FooterComponent.jsx'
import { Route, Routes } from 'react-router-dom'

/* Autenticazione utente */
const USER_TYPES = {
  Admin: 'Administrator',
  Employee: 'Employee',
  Client: 'Client user',
  User: 'Unlogged user'
}
const CURRENT_USER_TYPES = USER_TYPES.User

function RoutingComponents() {  
  return(
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/ChiSiamo" element={<About/>}></Route>
        <Route path="*" element={<div>Page Not Found</div>}></Route>
      </Routes>
  )
}

function PublicElement({children}){
  return(
    <div>{children}</div>
  )
}

export default RoutingComponents; 