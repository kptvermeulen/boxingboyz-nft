import Web3 from "web3";
//import BoxingBoyzTokenKoen from "../assets/img/json/BoxingBoyzKoen.json";
import BoxingBoyzTokenFactory from "../assets/img/json/BBFactory.json";
import BoxingBoyzTokenToken from "../assets/img/json/BBToken.json";
import BoxingBoyzTokenWhitelist from "../assets/img/json/BBWhitelist.json";

//let contractAddressKoen = "0x02BbBef518FF74Dc46485A7D9A6c6aA5c9D63601";

let contractAddressFactory = "0xA1077C7987D452F247239a26049F5E5ACA8a2A70";
let contractAddressToken = "0x12622B71aa62A595Be0F65009264De3Fe3DBc7aa";
let contractAddressWhitelist = "0x87F9C9c14F4714aB9Ceb07eBD4f2FE8b26AF7349";

let web3 = undefined;
let account = undefined;

//let contractKoen = undefined;
let contractFactory = undefined;
let contractToken = undefined;
let contractWhitelist = undefined;

export async function initWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    return true;
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
    return true;
  }
  /*try {
    const provider = new WalletConnectProvider({
      infuraId: "8b65329597cc409085f9960ce588417a", // Required
      qrcodeModalOptions: {
        mobileLinks: [
          "rainbow",
          "metamask",
          "argent",
          "trust",
          "imtoken",
          "pillar",
        ],
      },
    });
    await provider.enable();
    web3 = new Web3(provider);
    return true;
  } catch (err) {
    return false;
  }*/
  return false;
}

export function isWeb3Ready() {
  return web3 !== undefined;
}

export async function connectToBlockchain() {
  const accounts = await web3.eth.getAccounts();

  //contractKoen = new web3.eth.Contract(BoxingBoyzToken.abi, contractAddressKoen);
  contractFactory = new web3.eth.Contract(
    BoxingBoyzTokenFactory,
    contractAddressFactory
  );
  contractToken = new web3.eth.Contract(
    BoxingBoyzTokenToken,
    contractAddressToken
  );
  contractWhitelist = new web3.eth.Contract(
    BoxingBoyzTokenWhitelist,
    contractAddressWhitelist
  );

  account = accounts[0];
}

export function isConnectedToBlockchain() {
  return (
    contractFactory !== undefined &&
    contractToken !== undefined &&
    contractWhitelist !== undefined &&
    account !== undefined
  );
}

export async function isWhitelisted() {
  return contractWhitelist.methods.authenticate(account).call();
}

export async function getBalance() {
  //return parseInt(await contractToken.methods.balanceOf(account).call());
  let balancePre = parseInt(
    await contractToken.methods.balanceOf(account).call()
  );
  return contractToken
    .getPastEvents(
      "Transfer",
      {
        filter: {
          from: "0x0000000000000000000000000000000000000000",
          to: account,
        },
        fromBlock: 0,
        toBlock: "latest",
      },
      function (error, events) {
        if (error !== null) {
          return balancePre;
        } else {
        }
      }
    )
    .then(function (events) {
      return events.length;
    });
}

export async function getEtherBalance() {
  let balance = await web3.eth.getBalance(account);
  return web3.utils.fromWei(balance, "ether");
}

export function getConnectedAccount() {
  return account;
}

export async function getBoxingBoyz() {
  if (!isConnectedToBlockchain || contractToken === undefined) {
    return 0;
  }
  let balance = await parseInt(contractToken.methods.balanceOf(account).call());
  let ownedNFTs = [];
  let i = 1;
  while (i < 10000) {
    let isOwner = await contractToken.methods.ownerOf(i).call();
    if (isOwner === account) {
      console.log(i);
      ownedNFTs.push(i);
    }
    if (ownedNFTs.length === balance) {
      break;
    }
    i++;
  }
}

/*export async function loadAllMintedBoxingBoyz() {
  if (!isConnectedToBlockchain) {
    return {};
  }

  let allMintedBoxingBoyz = {};
  const totalSupply = await contractToken.methods.totalSupply().call();
  for (let i = 0; i < totalSupply; i++) {
    const tokenId = await contractToken.methods.tokenByIndex(i).call();
    const token = await loadToken(tokenId);
    allMintedBoxingBoyz[tokenId.toString()] = token;
  }
  return allMintedBoxingBoyz;
}*/

export async function loadCount() {
  if (!isConnectedToBlockchain || contractToken === undefined) {
    return 0;
  }
  let supplyPre = 0;
  await contractToken.methods
    .totalSupply()
    .call()
    .then(function (res) {
      supplyPre = res;
    })
    .catch(function (err) {
      console.log(err);
    });
  return supplyPre;
}

export function claimBoxingBoy(count, value) {
  return contractFactory.methods.mint(count.toString(), account).send({
    from: account,
    value: Web3.utils.toWei(value, "wei"),
  });
}
export async function getMintValue(count) {
  return contractFactory.methods.getMintFee(count).call();
}

export async function getMintETHValue(count) {
  let gasFees = await web3.eth.getGasPrice();
  let value = await contractFactory.methods.getMintFee(count).call();

  return web3.utils.fromWei(
    (parseInt(gasFees) + parseInt(value)).toString(),
    "ether"
  );
}
