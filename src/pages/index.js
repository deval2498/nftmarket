import React from 'react'
import {ethers} from 'ethers'
import panda from '../artifacts/contracts/nftmarket.sol/panda.json'
import { useState } from 'react';
const nftaddress = '0x6c50cb7c90aea35e873fddce62c429741d8ec8e0'
function Home(){
  const [userAccount,setUserAccount] = useState('')
  const [ethAmount,setEthAmount] = useState(0)
  const [amount,setAmount] = useState(0) 
  async function requestAccount() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.log("error");
      console.error(error);
  
      alert("Login to Metamask first");
    }
  }

  async function mint(){
    if (typeof window.ethereum !== 'undefined') {
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await requestAccount();
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(nftaddress, panda.abi, signer);
      const transaction = await contract.mint(amount,{value : ethers.utils.parseEther(ethAmount)})
      await transaction.wait();
      console.log( ethAmount ,'successfully sent to', nftaddress);
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await requestAccount()
      
      
      const balance = await provider.getBalance('0x2B099F96eaAd16A76127aEe391A301ec2782e3A9')
      console.log("Balance: ", balance.toString());
    }
  }
  return (
    
    <div className="App">
      <header className="App-header">
        
         <button onClick={getBalance}>Get Balance</button>
         <button onClick={mint}>Buy NFT</button>
        <input onChange={e => setAmount(e.target.value)} 
        placeholder="How many NFTs?"
         />
         
        <input onChange={e => setEthAmount(e.target.value)} 
        placeholder="0.055 Eth per NFT"
         />
         
         
      </header>
    </div>
    
  );
}


export default Home