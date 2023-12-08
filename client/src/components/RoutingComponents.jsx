import React, { useEffect, useState } from 'react'
import Home from '../pages/HomePage.jsx'
import About from '../pages/AboutPage.jsx'
import CatalogoProdotti from '../pages/CatalogoProdottiPage.jsx'
import IdeeSpunti from '../pages/IdeeSpuntiPage.jsx'
import AssistenzaClienti from '../pages/AssistenzaClientiPage.jsx'
import Dashboard from '../pages/DashboardPage.jsx'
import Login from '../pages/LoginPage.jsx'
import Signin from '../pages/SigninPage.jsx'
import Profilo from '../pages/ProfilePage.jsx'
import Wishlist from '../pages/WishlistPage.jsx'
import Carrello from '../pages/CarrelloPage.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'

function RoutingComponents() {  
  return(
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/ChiSiamo" element={<About/>}></Route>
        <Route path="/CatalogoProdotti" element={<CatalogoProdotti/>}></Route>
        <Route path="/Idee" element={<IdeeSpunti/>}></Route>
        <Route path="/AssistenzaClienti" element={<AssistenzaClienti/>}></Route>
        <Route path="/Dashboard" element={<Dashboard/>}></Route>
        <Route path="/Login" element={<Login/>}></Route>
        <Route path="/Signin" element={<Signin/>}></Route>
        <Route path="/Profilo" element={<Profilo/>}></Route>
        <Route path="/Wishlist" element={<Wishlist/>}></Route>
        <Route path="/Carrello" element={<Carrello/>}></Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  )
}

function PublicElement({children}){
  return(
    <div>{children}</div>
  )
}

export default RoutingComponents;