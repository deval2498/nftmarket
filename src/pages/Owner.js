import React from 'react'
import {ethers} from 'ethers'
import panda from '../artifacts/contracts/nftmarket.sol/panda.json'
import { useState } from 'react';
const nftaddress = '0x6c50cb7c90aea35e873fddce62c429741d8ec8e0'
function Owner(){ 
  const [URI,setURI] = useState('')
  async function requestAccount() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.log("error");
      console.error(error);
  
      alert("Login to Metamask first");
    }
  }

  async function togglePreSale(){
    if (typeof window.ethereum !== 'undefined') {
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await requestAccount();
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(nftaddress, panda.abi, signer);
      const transaction = await contract.togglePreSale();
      await transaction.wait();
      console.log(  'Sale is active:',await contract.preSaleIsActive());
    }
  }

  async function toggleSale() {
    if (typeof window.ethereum !== 'undefined') {
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await requestAccount();
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(nftaddress, panda.abi, signer);
      const transaction = await contract.toggleSale();
      await transaction.wait();
      console.log( 'Sale is active:',await contract.saleIsActive());
    }
  }
  async function baseURI(){
    if (typeof window.ethereum !== 'undefined') {
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await requestAccount();
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(nftaddress, panda.abi, signer);
      const transaction = await contract.setBaseURI(URI)
      await transaction.wait();
      console.log( 'New URI is:',URI );
    }
  }
  return (
    
    <div className="App">
      <header className="App-header">
        
         <button onClick={togglePreSale}>Toggle Pre Sale</button>
         <button onClick={toggleSale}>Toggle Sale</button>
         <button onClick={baseURI}>Set Base URI</button>
         <input onChange={e => setURI(e.target.value)} 
        placeholder="New URI"
         />
         
         
      </header>
    </div>
    
  );
}


export default Owner