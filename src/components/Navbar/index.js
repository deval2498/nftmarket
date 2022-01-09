import React,{Component} from 'react'
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink
  } from './NavbarElements';

  function Navbar(){
    return (
        <>
            <Nav>
                <NavLink to = "/">
                    <h1>Home</h1>
                </NavLink>
                <Bars />
                <NavMenu>
                    <NavLink to="/Team" >
                        Team
                    </NavLink>
                    <NavLink to="/PreSale" >
                        PreSale
                    </NavLink>
                    <NavLink to="/Owner" >
                        Owner
                    </NavLink>
                </NavMenu>
                
            </Nav>
        </>
    )
}


export default Navbar
