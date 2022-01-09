NFT market to make nft by passing urls' as argument

It uses hardhat boiler plate and also react boiler plate, along with some other functionalities given below
```shell
npx create-react-app "name of your folder"
npx hardhat (in your react folder)
yarn add @openzeppelin/contracts
yarn add dotenv
npm install --save-dev @nomiclabs/hardhat-etherscan
```

To deploy on a testnet you need to create a .env file and fill the info in following variables
```shell
RINKEBY_RPC_URL= 'your node endpoint(for eg, i used infura)'
MNEMONIC=Private key (no quotes)
ETHERSCAN_API_KEY='Your etherscan api key' (to verify contract)
```

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
