const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("==============Lets begin==============", function () {

  let pnd
  let signedmsgarray
  let accounts
  let owner
  before(async() => {
    accounts = await ethers.getSigners()
    owner = accounts[0]
    const nftmarket = await ethers.getContractFactory("panda");
    pnd = await nftmarket.deploy("BaseURI example.///",accounts[0].address)
    await pnd.deployed()
    console.log("\nPandas are deployed",pnd.address);

    for(let i=0;i<10;i++) {
      let messageHash = ethers.utils.solidityKeccak256(['bytes'],[ethers.utils.solidityPack(['address','uint'], [accounts[i].address, i])]);
      const binary = await ethers.utils.arrayify(messageHash)
      const signedmsg = await owner.signMessage(binary)
      const recoveredAddress = ethers.utils.verifyMessage(binary, signedmsg)
      console.log("Signed Message of:",accounts[i].address,": is:",signedmsg,"and nounce is:",i)
      console.log("Recovered address:",recoveredAddress)
      console.log("Owner's address",owner.address,"\n")
      console.log(signedmsg.length)
      }
      let messageHash = ethers.utils.solidityKeccak256(['bytes'],[ethers.utils.solidityPack(['address','uint'], [accounts[1].address, 1])]);
      const binary = await ethers.utils.arrayify(messageHash)
      const signedmsg = await accounts[1].signMessage(binary)
      const recoveredAddress = ethers.utils.verifyMessage(binary, signedmsg)
      console.log("=========Fake signature by a notorious team member=====",signedmsg,"By:",recoveredAddress)
  });
  it("Should claim the nft by one of the top 10 valued team members", async function () {
    const receipt = await pnd.claim(0,"0x7c016a14819cd75ef2321cdf18f415fb54d8faf077e23b259a6d1033b530e5fb738021508e6c9e449e8c9b8f1503163ca327e518b2f6aa4b3ca9d5f9392cd3301c")
    expect(await pnd.remainingReserved()).to.equal("32")
  });
  it("should not be able to claim nft by a notorious team member with a fake signed msg",async () =>{
    const receipt = await expect(pnd.connect(accounts[1]).claim(1,"0x085d5d92ddecd86832b73f06f50b26516de2d7bce218bada03f8eb6657fce2593b4e33854e1ae7d2ee5c429de43f3016177fb13b8c3009a3cecc22ec51e5af431b")).to.be.revertedWith("invalid signature")
    console.log(receipt,"\n\n\n\n")
  });

  it("========Should let our giveaways to special customers redeem it as pandas:===========",async() => {
      let coupon = ethers.utils.solidityKeccak256(['bytes'],[ethers.utils.solidityPack(['address','uint'],[accounts[7].address, 25])])
      const binary = await ethers.utils.arrayify(coupon)
      const signedmsg = await owner.signMessage(binary)
      const recoveredAddress = ethers.utils.verifyMessage(binary, signedmsg)
      console.log("\n\n\n===================================================================================\nRecovered Address is:",recoveredAddress,"\n\nOwner's address is:",owner.address)
      console.log("\n\n\nNotification for:",accounts[7].address,"\nYour coupon to redeem is:",signedmsg,"\n And your nounce is:",25)
      await pnd.togglePreSale()
      await pnd.connect(accounts[7]).preSaleMint(1,25,signedmsg,{value: ethers.utils.parseEther('0.055')})

  })

  it("\n\n\nShould not let the customer buy after pre sale is closed,or if he transfers less amount:",async() => {
    let coupon = ethers.utils.solidityKeccak256(['bytes'],[ethers.utils.solidityPack(['address','uint'],[accounts[7].address, 25])])
      const binary = await ethers.utils.arrayify(coupon)
      const signedmsg = await owner.signMessage(binary)
      const recoveredAddress = ethers.utils.verifyMessage(binary, signedmsg)
      console.log("\n\n\n===================================================================================\nRecovered Address is:",recoveredAddress,"\n\nOwner's address is:",owner.address)
      console.log("\n\n\nNotification for:",accounts[7].address,"\nYour coupon to redeem is:",signedmsg,"\n And your nounce is:",25)
      const receipt = await expect(pnd.connect(accounts[7]).preSaleMint(1,25,signedmsg,{value: ethers.utils.parseEther('0.045')})).to.be.revertedWith("incorrect ether value sent")
      await pnd.togglePreSale()
      const receipt2 = await expect(pnd.connect(accounts[7]).preSaleMint(1,25,signedmsg,{value: ethers.utils.parseEther('0.055')})).to.be.revertedWith("presale must be active")
      console.log(receipt,receipt2)
  })

  it("Should let the normal public mint:",async() => {
    await pnd.toggleSale()
    const receipt = await pnd.connect(accounts[8]).mint(1,{value : ethers.utils.parseEther('0.055')})
    console.log(receipt)
  })
});
