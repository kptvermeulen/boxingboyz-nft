const { expect } = require("chai");
const { expectRevert } = require("@openzeppelin/test-helpers");
const BoxingBoyzToken = artifacts.require("BoxingBoyz");

require("chai").should();

let price = web3.utils.toBN(web3.utils.toWei("0.1", "ether"));

contract("BoxingBoyz", ([deployer, owner1, buyer]) => {
  let contract;
  let addressList = [
    "0xBD836D554f431616B444a36673a4C4e05fca2110",
    "0x423A694Fe08c3F070f761Cc5B4D2A8731EbD8d56",
    "0xEB186Ef4Dc1A29730beb5ba49Bf129c3Ef59d356",
  ];
  let shareList = [845, 100, 55];
  before(async () => {
    contract = await BoxingBoyzToken.new(
      "ipfs://QmWELZ8xVqguUDvWWeEuZxYwQ1WLgwEz3JLetsANMkXdsg/",
      6
    );
  });

  describe("Deployed BoxingBoyz Contract", async () => {
    it("has an owner", async () => {
      let owner = await contract.owner();
      expect(owner).to.equal(deployer);
    });

    it("has a token name", async () => {
      let name = await contract.name();
      expect(name).to.equal("BoxingBoyz");
    });

    it("has a token symbol", async () => {
      let symbol = await contract.symbol();
      expect(symbol).to.equal("BOXINGBOYZ");
    });
  });

  describe("Whitelisted Contract", async () => {
    it("has not accuired the whitelistedAdresses yet", async () => {
      let isWhitelisted = await contract.isWhitelisted(buyer);
      expect(isWhitelisted).to.equal(false);
    });
    it("set whitelisted users", async () => {
      await contract.whitelistUsers([buyer]);
      let isWhitelistedBuyer = await contract.isWhitelisted(buyer);
      expect(isWhitelistedBuyer).to.equal(true);
    });
    it("set whitelisted users to empty", async () => {
      await contract.deleteWhitelistedUser(buyer);
      let isWhitelistedBuyer = await contract.isWhitelisted(buyer);
      expect(isWhitelistedBuyer).to.equal(false);
    });
  });

  describe("Paused Contract", async () => {
    it("fails trying to mint because it is paused", async () => {
      await expectRevert(
        contract.mintBB(1, {
          from: buyer,
          value: price,
        }),
        "Minting paused"
      );
    });
    it("opens the contract", async () => {
      await contract.pause(false);
    });
  });

  describe("Minting one BoxingBoyz", async () => {
    let shareHolder1BalanceBefore;
    let shareHolder2BalanceBefore;
    let shareHolder3BalanceBefore;
    let buyerBalanceBefore;

    let reciept;
    let transaction;

    it("is not possible to mint because not whitelisted", async () => {
      await expectRevert(
        contract.mintBB(1, { from: buyer, value: price }),
        "Not whitelisted"
      );
    });
    it("removes whitelist", async () => {
      await contract.setOnlyWhitelisted(false);
      await setBalancesBefore();
    });

    async function setBalancesBefore() {
      shareHolder1BalanceBefore = await web3.eth.getBalance(addressList[0]);
      shareHolder1BalanceBefore = web3.utils.toBN(shareHolder1BalanceBefore);

      shareHolder2BalanceBefore = await web3.eth.getBalance(addressList[1]);
      shareHolder2BalanceBefore = web3.utils.toBN(shareHolder2BalanceBefore);

      shareHolder3BalanceBefore = await web3.eth.getBalance(addressList[2]);
      shareHolder3BalanceBefore = web3.utils.toBN(shareHolder3BalanceBefore);

      buyerBalanceBefore = await web3.eth.getBalance(buyer);
      buyerBalanceBefore = web3.utils.toBN(buyerBalanceBefore);
    }

    it("creates a token", async () => {
      reciept = await contract.mintBB(1, { from: buyer, value: price }); //1
      transaction = await web3.eth.getTransaction(reciept.tx);
    });

    it("has correct tokenURI", async () => {
      let tokenURI = await contract.tokenURI(0);
      expect(tokenURI).to.equal(
        "ipfs://QmWELZ8xVqguUDvWWeEuZxYwQ1WLgwEz3JLetsANMkXdsg/1.json"
      );
    });

    it("transfers ownership to the caller", async () => {
      let owner = await contract.ownerOf(0);
      expect(owner).to.equal(buyer);
    });

    it("token appears in wallet of owner", async () => {
      let wallet = await contract.walletOfOwner(buyer);
      expect(wallet).to.eql([web3.utils.toBN(0)]);
    });

    it("costs X amount ether plus gas to mint", async () => {
      let buyerBalanceAfter = await web3.eth.getBalance(buyer);
      buyerBalanceAfter = web3.utils.toBN(buyerBalanceAfter);
      let gasCost = web3.utils.toBN(
        transaction.gasPrice * reciept.receipt.gasUsed
      );
      let expectedBuyerBalance = buyerBalanceBefore.sub(price).sub(gasCost);
      expect(buyerBalanceAfter.toString()).to.equal(
        expectedBuyerBalance.toString()
      );
    });

    it("revenue is split between owners", async () => {
      let shareHolder1BalanceAfter = await web3.eth.getBalance(addressList[0]);
      shareHolder1BalanceAfter = web3.utils.toBN(shareHolder1BalanceAfter);
      let shareHolder2BalanceAfter = await web3.eth.getBalance(addressList[1]);
      shareHolder2BalanceAfter = web3.utils.toBN(shareHolder2BalanceAfter);
      let shareHolder3BalanceAfter = await web3.eth.getBalance(addressList[2]);
      shareHolder3BalanceAfter = web3.utils.toBN(shareHolder3BalanceAfter);

      let revenueSH1 = web3.utils.toBN(price * (shareList[0] / 1000));
      let expectedshareHolder1Balance =
        shareHolder1BalanceBefore.add(revenueSH1);
      let revenueSH2 = web3.utils.toBN(price * (shareList[1] / 1000));
      let expectedshareHolder2Balance =
        shareHolder2BalanceBefore.add(revenueSH2);
      let revenueSH3 = web3.utils.toBN(price * (shareList[2] / 1000));
      let expectedshareHolder3Balance =
        shareHolder3BalanceBefore.add(revenueSH3);
      let sumPrice =
        parseInt(revenueSH1) + parseInt(revenueSH2) + parseInt(revenueSH3);
      expect(sumPrice.toString()).to.equal(price.toString());
      expect(Math.round(shareHolder1BalanceAfter / 100).toString()).to.equal(
        Math.round(expectedshareHolder1Balance / 100).toString()
      );
      expect(Math.round(shareHolder2BalanceAfter / 100).toString()).to.equal(
        Math.round(expectedshareHolder2Balance / 100).toString()
      );

      expect(Math.round(shareHolder3BalanceAfter / 100).toString()).to.equal(
        Math.round(expectedshareHolder3Balance / 100).toString()
      );
    });
  });

  describe("Minting two BoxingBoyz as the owner", async () => {
    let buyerBalanceBefore;

    before(async () => {
      buyerBalanceBefore = await web3.eth.getBalance(deployer);
      buyerBalanceBefore = web3.utils.toBN(buyerBalanceBefore);
    });

    let reciept;
    let transaction;

    it("creates two token", async () => {
      reciept = await contract.mintBB(2, {
        from: deployer,
        value: 0,
      }); //3
      transaction = await web3.eth.getTransaction(reciept.tx);
    });

    it("token appear in wallet of owner", async () => {
      let wallet = await contract.walletOfOwner(deployer);
      expect(wallet).to.eql([web3.utils.toBN(1), web3.utils.toBN(2)]);
    });

    it("costs only gas to mint", async () => {
      let buyerBalanceAfter = await web3.eth.getBalance(deployer);
      buyerBalanceAfter = web3.utils.toBN(buyerBalanceAfter);
      let gasCost = web3.utils.toBN(
        transaction.gasPrice * reciept.receipt.gasUsed
      );
      let expectedBuyerBalance = buyerBalanceBefore.sub(gasCost);
      expect(buyerBalanceAfter.toString()).to.equal(
        expectedBuyerBalance.toString()
      );
    });
  });

  describe("Trying to mint a BoxingBoyz without paying", async () => {
    it("fails", async () => {
      await expectRevert(
        contract.mintBB(1, {
          from: buyer,
          value: 0,
        }),
        "Value below price"
      );
    });
  });

  describe("Trying to mint more than 5 BoxingBoyz", async () => {
    it("fails", async () => {
      await expectRevert(contract.mintBB(6), "Exceeds 5");
    });
  });

  describe("Trying to mint 0 BoxingBoyz", async () => {
    it("fails", async () => {
      await expectRevert(contract.mintBB(0), "You can't mint 0 BoxingBoyz");
    });
  });

  describe("Trying to mint more token than are available", async () => {
    let value = web3.utils.toBN(web3.utils.toWei("0.5", "ether"));

    it("fails", async () => {
      await expectRevert(
        contract.mintBB(5, { from: buyer, value: value }),
        "Not enough token left"
      );
    });
  });

  describe("Trying to mint token after sale", async () => {
    before(async () => {
      contract.mintBB(1, { from: buyer, value: price });
      contract.mintBB(1, { from: buyer, value: price });
      contract.mintBB(1, { from: buyer, value: price });
      //6
    });

    it("fails", async () => {
      await expectRevert(
        contract.mintBB(1, { from: buyer, value: price }),
        "Sale has ended"
      );
    });
  });

  describe("Whitelisting 3000 users", async () => {
    it("Whitelists 3000 users", async () => {
      await contract.whitelistUsers([
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        "0xAF41Aa0388d703783F1E35b417D14E14dD75Eb5f",
        "0xEf30402967B3953C9A96c59A3a3339E8dCeb4Fac",
        "0x27d68B80aD4bC43D8eB0fdAd6347f8759Fb6CBa0",
        "0x9eB7925fdb2F004Efb3ccbbaB0c09Fa785d0c4Ad",
        "0x3B10069B855507146f41418332B5E4b38E073c11",
        //-------------------------------------------
        "0xfa055E4a98a761aEF232AD8bD76cFf68B91b9EF3",
        //------------------------------------------
      ]);
    });
    it("checks if whitelisted", async () => {
      let isWhitelistedBuyer = await contract.isWhitelisted(
        "0xfa055E4a98a761aEF232AD8bD76cFf68B91b9EF3"
      );
      expect(isWhitelistedBuyer).to.equal(true);
    });
  });
});
