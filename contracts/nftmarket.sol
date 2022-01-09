//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import  "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

contract panda is ERC721, ERC721Enumerable, Ownable {
    using Address for address;
    using ECDSA for bytes32;

    string private _baseURIextended;

    uint256 public maxMintable = 2; //Max mintable per wallet
    uint256 public remainingReserved = 33; // 33 reserved for giveaway and team.

    bool public saleIsActive;
    bool public preSaleIsActive;
    bool public locked;

    uint256 public constant sale_price = 0.055 ether; // 0.055 eth 
    uint256 public constant max_supply = 333; // 333 max supply 
 
    address private _signer;

    mapping(address => uint256) public minted;
    mapping(uint256 => bool) public usedNonces;
    

    constructor(string memory __baseURI, address __signer) ERC721("I love pandas", "PND") {
            _baseURIextended = __baseURI;
            _signer = __signer;
    }
    ///  For ourselves(team, giveaways and stuff). Cannot mint more than reserved.
    ///   nonce = random number
    ///   signature = signed message of the signer with nounce encoded in it
    function claim(uint256 nonce, bytes calldata signature)
        external {
        uint tokenCount = totalSupply();
        require(remainingReserved>0, "reserved finished");
        require(!usedNonces[nonce], "cannot use same signature twice");
        require(minted[msg.sender]<= maxMintable, "exceeds max tokens per wallet");
        bytes32 hash = keccak256(abi.encodePacked(msg.sender, nonce)).toEthSignedMessageHash();
        require(ECDSA.recover(hash, signature) == _signer, "invalid signature");
        require( tokenCount < max_supply,"mint finished");
        usedNonces[nonce] = true;
        remainingReserved--;
        minted[msg.sender]+=1;
        tokenCount++;
        _safeMint(msg.sender, tokenCount);

    }
    /// presale mint, only allowed addresses be able to mint. max 2 per wallet
    /// number of NFT to mint = amount
    /// number of max mint allowed = 2
    /// signature = signed message of the signer with nounce encoded in it
    function preSaleMint(uint256 amount, 
        uint256 nonce, 
        bytes calldata signature)
        external payable{
            uint tokenCount = totalSupply();
            require(preSaleIsActive,"presale must be active");
            require(tokenCount + amount <= max_supply, "exceeds total supply");
            uint256 mp = minted[msg.sender];
            require(mp + amount <= maxMintable, "exceeds max tokens per wallet");
            require(msg.value >= sale_price * amount, "incorrect ether value sent");
            bytes32 data = keccak256(abi.encodePacked(msg.sender, nonce)).toEthSignedMessageHash();
            address signer = ECDSA.recover(data, signature);
            require(signer == _signer, "invalid signature");
            minted[msg.sender] = mp + amount;
            for(uint i=0; i < amount; i++){
                tokenCount++;
                _safeMint(msg.sender, tokenCount);
                console.log("\n\nMint successful:","\nYour tokenId is:",tokenCount);
            }
            
    }
    /// public mint, anybody can mint NFT. max 2 per wallet
    /// number of NFT to mint = amount
    function mint(uint256 _amount)
        external payable {
            uint tokenCount = totalSupply();
            require(saleIsActive,"sale is not active");
            require(!Address.isContract(msg.sender),"contracts are not allowed");
            uint256 mp = minted[msg.sender];
            require(mp + _amount <= maxMintable, "exceeds max tokens per wallet");
            require(tokenCount + _amount <= max_supply, "exceeds max public supply");
            require(msg.value >= sale_price * _amount, "incorrect ether value sent");
            minted[msg.sender] = mp +  _amount;
            for(uint i=0; i< _amount; i++){
                tokenCount++;
                _safeMint(msg.sender, tokenCount);
            }
    }

    // Control functions
    function closeNonce(uint _nonce) external onlyOwner {
        usedNonces[_nonce] = true;
    }
    function toggleSale() external onlyOwner {
        saleIsActive = !saleIsActive;
    }
    function togglePreSale() external onlyOwner{
        preSaleIsActive = !preSaleIsActive;
    }
    function setSigner(address __signer) external onlyOwner {
        _signer = __signer;
    }


    function setBaseURI(string memory __baseURI) external onlyOwner {
        require(!locked, "locked...");
        _baseURIextended = __baseURI;
    }
    function setMaxMintablePerAcc(uint256 n) external onlyOwner {
        maxMintable = n;
    }
    function withdrawAll(address payable receiver) external onlyOwner {
        uint balance = address(this).balance;
        receiver.transfer(balance);
    }

        //Forever locked....
    function lockMetadata() external onlyOwner {
		locked = true;
	}
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /// View functions

    function tokensOfOwner(address _owner1) external view returns (uint256[] memory) {
		uint256 tokenCount = balanceOf(_owner1);
		if (tokenCount == 0) {
			return new uint256[](0);
		} else {
			uint256[] memory result = new uint256[](tokenCount);
			uint256 index;
			for (index = 0; index < tokenCount; index++) {
				result[index] = tokenOfOwnerByIndex(_owner1, index);
			}
			return result;
		}
	}
    function _baseURI() internal view override returns (string memory) {
        return _baseURIextended;
    }
    
    receive() external payable{
    }

}