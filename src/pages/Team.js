import React from 'react'
import {ethers} from 'ethers'
import panda from '../artifacts/contracts/nftmarket.sol/panda.json'
import { useState } from 'react';
const nftaddress = '0x6c50cb7c90aea35e873fddce62c429741d8ec8e0'
function Team(){

  const [nounce,setNounce] = useState(0)
  const [signature,setSignature] = useState('') 
  async function requestAccount() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.log("error");
      console.error(error);
  
      alert("Login to Metamask first");
    }
  }

  async function claim(){
    if (typeof window.ethereum !== 'undefined') {
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await requestAccount();
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(nftaddress, panda.abi, signer);
      const transaction = await contract.claim(nounce,signature)
      await transaction.wait();
      console.log( "Signature received by the contract:");
    }
  }

  return (
    
    <div className="App">
      <header className="App-header">
        
         <button onClick={claim}>Buy NFT</button>
        <input onChange={e => setNounce(e.target.value)} 
        placeholder="Enter the nounce"
         />
         
        <input onChange={e => setSignature(e.target.value)} 
        placeholder="Enter the secret signature"
         />
         
         
      </header>
    </div>
    
  );
}


export default Team