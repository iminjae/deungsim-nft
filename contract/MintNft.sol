// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MintNft is ERC721Enumerable, Ownable{
    string metadataUri;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) Ownable(msg.sender){}


    function mintNft() public  onlyOwner{
        // require(totalSupply() < 9, "No more mint.");

        uint tokenId = totalSupply() + 1;

        _mint(msg.sender, tokenId);
    }

    function tokenURI(uint _tokenId) public view override returns (string memory) {
        
        return string(abi.encodePacked(metadataUri, Strings.toString(_tokenId), ".json"));
   
    }
    
}