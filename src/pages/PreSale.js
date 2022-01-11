import React from 'react'
import {ethers} from 'ethers'
import panda from '../artifacts/contracts/nftmarket.sol/panda.json'
import { useState } from 'react';
const nftaddress = '0x6c50cb7c90aea35e873fddce62c429741d8ec8e0'
function Team(){
  const [amount,setAmount] = useState(0)
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

  async function preSaleMint(){
    if (typeof window.ethereum !== 'undefined') {
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await requestAccount();
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(nftaddress, panda.abi, signer);
      const transaction = await contract.preSaleMint(amount,nounce,signature,{value : await ethers.utils.parseEther(amount)})
      await transaction.wait();
      console.log( "Signature received by the contract:");
    }
  }


  return (
    
    <div className="App">
      <header className="App-header">
        
         <button onClick={preSaleMint}>Pre Sale Mint</button>
        <input onChange={e => setNounce(e.target.value)} 
        placeholder="Enter the nounce"
         />
         
        <input onChange={e => setSignature(e.target.value)} 
        placeholder="Enter the secret signature"
         />

<input onChange={e => setAmount(e.target.value)} 
        placeholder="0.055 eth per NFT"
         />
         
         
      </header>
    </div>
    
  );
}


export default Team