// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BoxingBoyz is ERC721Enumerable, Ownable {
    using SafeMath for uint256;
    using Strings for uint256;

    uint public availableToken = 10000;
    uint256 public price = 0.1 ether;
    uint256 public whitelistPrice = 0.05 ether;
    uint256 public maxPurchaseSize = 2;
    uint256 public maxPerWallet = 2;
    string public baseExtension = ".json";
    address[] private addressList;
    /*
    For Example (Not real adresses):
    [
        0xBD836D554f431616B444a36673a4C4e05fca2110,
        0x423A694Fe08c3F070f761Cc5B4D2A8731EbD8d56,
        0xEB186Ef4Dc1A29730beb5ba49Bf129c3Ef59d356
    ];*/
    uint[] private divList;
     /*
     For Example:
     [
        845,
        100,
        55
    ];*/
    bool public onlyWhitelisted = true;
    bool public paused = true;
    address[] public whitelistedAddresses;
    mapping(address => bool) public whitelisted;
    string _baseTokenURI;

    constructor(string memory theBaseURI, uint numToken, uint[] memory _divList, address[] memory _addressList) ERC721("BoxingBoyz", "BOXINGBOYZ")  {
        setBaseURI(theBaseURI);
        availableToken = numToken;
        divList = _divList;
        addressList = _addressList;
    }

    modifier saleIsOpen {
        require(totalSupply() < availableToken, "Sale has ended");
        _;
    }

    function mintBB(uint _count) public payable saleIsOpen {
        require(_count > 0, "You can't mint 0 BoxingBoyz");
        require(paused == false, "Minting paused");
        require(_count <= maxPurchaseSize, "Exceeds 5");
        require(balanceOf(msg.sender) + _count <= maxPerWallet, "Exceeds 5");
        require(totalSupply() + _count <= availableToken, "Not enough token left");
        
        uint256 orderPrice = price.mul(_count);

        if(msg.sender != owner()){
            if(onlyWhitelisted){
                require(whitelisted[msg.sender], "Not whitelisted");
                orderPrice = whitelistPrice.mul(_count);
                require(msg.value >= orderPrice, "Value below whitelist price");
            } else {
                require(msg.value >= orderPrice, "Value below price");
            }
        }

        for(uint i = 0; i < _count; i++){
            _safeMint(msg.sender, totalSupply()); //Enumerable
        }

        if(msg.sender != owner()){
            payable(addressList[0]).transfer(orderPrice.mul(divList[0]).div(1000));
            payable(addressList[1]).transfer(orderPrice.mul(divList[1]).div(1000));
            payable(addressList[2]).transfer(orderPrice.mul(divList[2]).div(1000));
        }
        //This is a known part that should be fixed, right now it uses a more gasfees
    }

    function mintOwnerTo(uint _count, address _to) public payable saleIsOpen onlyOwner {
        require(_count > 0, "You can't mint 0 BoxingBoyz");
        require(totalSupply() + _count <= availableToken, "Not enough token left");

        for(uint i = 0; i < _count; i++){
            _safeMint(_to, totalSupply()); //Enumerable
        }
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function contractURI() public pure returns (string memory) {
        return "https://www.boxingboyz.com/contract-info.json";
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory){
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, (tokenId + 1).toString(), baseExtension))
        : "";
  }

    function walletOfOwner(address _owner) external view returns(uint256[] memory) {
        uint tokenCount = balanceOf(_owner);

        uint256[] memory tokensId = new uint256[](tokenCount);
        for(uint i = 0; i < tokenCount; i++){
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }

        return tokensId;
    }

    function whitelistUsers(address[] calldata _users) public onlyOwner {
        for(uint256 i = 0; i < _users.length; i++){
            whitelisted[_users[i]] = true;
        }
    }
    function isWhitelisted(address _user)
    public
    view
    returns (bool)
  {
    return whitelisted[_user];
  }
    function deleteWhitelistedUser(address _user) public onlyOwner {
        whitelisted[_user] = false;
    }
    function setOnlyWhitelisted(bool _state) public onlyOwner {
        onlyWhitelisted = _state;
    }
    function setMaxPerWallet(uint256 _count) public onlyOwner {
        maxPerWallet = _count;
    }
    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }
  function setPrice(uint256 _newPrice) public onlyOwner {
    price = _newPrice;
  }
  function setWLPrice(uint256 _newWLPrice) public onlyOwner {
    whitelistPrice = _newWLPrice;
  }
  function pause(bool _state) public onlyOwner {
    paused = _state;
  }
}

//Smartcontract developed by Koen Vermeulen.
