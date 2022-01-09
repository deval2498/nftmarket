
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Home from './pages';
import Team from './pages/Team.js';
import PreSale from './pages/PreSale';
import Owner from './pages/Owner';
import React,{Component} from 'react';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/Team" element={<Team />}></Route>
      <Route path="/PreSale" element={<PreSale />}></Route>
      <Route path="/Owner" element={<Owner />}></Route>
      </Routes>
    </Router>
  );
}


export default App;
