require("dotenv-flow").config();
const BN = require("bignumber.js");

const Migrations = artifacts.require("Migrations");

const account = web3.eth.accounts.privateKeyToAccount(
  `0x${process.env.DEPLOYER_PRIVATE_KEY}`
).address;
const adminAccount = process.env.ADMIN_ACCOUNT;
console.log("########################################################");
console.log(`# Deployer Account:  ${account}`);
console.log(`# Admin Account:  ${adminAccount}`);
console.log("########################################################");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
