import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Header from '../components/HeaderComponent'
import Footer from '../components/FooterComponent'
import Home from '../pages/HomePage.jsx'
import About from '../pages/AboutPage.jsx'
import CatalogoProdotti from '../pages/CatalogoProdottiPage.jsx'
import IdeeSpunti from '../pages/IdeeSpuntiPage.jsx'
import AssistenzaClienti from '../pages/AssistenzaClientiPage.jsx'
import Dashboard from '../pages/DashboardPage.jsx'
import Login from '../pages/LoginPage.jsx'
import Signup from '../pages/SignupPage.jsx'
import Profilo from '../pages/Profilo/ProfilePage.jsx'
import InformazioniPersonali from '../pages/Profilo/InformazioniPersonali.jsx'
import CambioPassword from '../pages/Profilo/CambioPassword.jsx'
import CronologiaOrdini from '../pages/Profilo/CronologiaOrdini.jsx'
import Wishlist from '../pages/WishlistPage.jsx'
import Carrello from '../pages/CarrelloPage.jsx'
import Checkout from '../pages/CheckoutPage.jsx'
import Product from '../pages/ProductPage.jsx'

function RoutingComponents(){
  const location = useLocation();
  const nascondiHeaderFooter = ['/Login', '/Signup'].includes(location.pathname);

  return(
    <>
      {!nascondiHeaderFooter && <Header/>}
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/ChiSiamo" element={<About/>}/>
        <Route path="/CatalogoProdotti" element={<CatalogoProdotti/>}/>
        <Route path="/CatalogoProdotti/:id" element={<Product/>}/>
        <Route path="/Idee" element={<IdeeSpunti/>}/>
        <Route path="/AssistenzaClienti" element={<AssistenzaClienti/>}/>
        <Route path="/Dashboard" element={<Dashboard/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Signup" element={<Signup/>}/>
        <Route path="/Profilo" element={<Profilo/>}>
          <Route index element={<Navigate to="InformazioniPersonali"/>}/>
          <Route path="InformazioniPersonali" element={<InformazioniPersonali/>}/>
          <Route path="CambioPassword" element={<CambioPassword/>}/>
          <Route path="CronologiaOrdini" element={<CronologiaOrdini/>}/>
        </Route>
        <Route path="/Wishlist" element={<Wishlist/>}/>
        <Route path="/Carrello" element={<Carrello/>}/>
        <Route path="/Carrello/Checkout" element={<Checkout/>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {!nascondiHeaderFooter && <Footer/>}
    </>
  )
}

export default RoutingComponents;