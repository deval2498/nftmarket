
const { ethers } = require("ethers");
const hre = require("hardhat");

async function main() {
  const baseURL = "https://gateway.pinata.cloud/ipfs/QmUCxzefHtUeNG3UJ37ukJ6N5PKibgG1653uvFmdYNfm5d/panda.json"
  const signer = '0x2B099F96eaAd16A76127aEe391A301ec2782e3A9'
  const Nft = await hre.ethers.getContractFactory("panda");
  const nft = await Nft.deploy(baseURL,signer);
  await nft.deployed()
  console.log("Pandas deployed to:",nft.address)
  console.log("Verify the contract using:\n","npx hardhat verify --network rinkeby",nft.address,baseURL,signer)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
