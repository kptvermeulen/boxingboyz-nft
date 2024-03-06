const BoxingBoyzToken = artifacts.require("BoxingBoyz"); //BoxingBoyz.sol

module.exports = function (deployer) {
  deployer.deploy(
    BoxingBoyzToken,
    "ipfs://QmZA9D1BKEtr9rA3DRMf145uRPoH87yK31yiP6MYikGunp/",
    10000
  );
};
