require("dotenv-flow").config();
const { bytecode } = require("../build/contracts/BallswapPair.json");
const { keccak256 } = require("@ethersproject/solidity");

// ============ Accounts ============
const account = process.env.DEPLOYER_ACCOUNT;
const adminAccount = process.env.ADMIN_ACCOUNT;
// Mainnet
 const WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
// TestNet
// const WBNB = "0xae13d989dac2f0debff460ac112a837c89baa7cd";

console.log(`Deployer Account:  ${account}`);
console.log(`Admin Account:  ${adminAccount}`);
// ============ Contracts ============
const BallswapFactory = artifacts.require("BallswapFactory");
const BallswapRouter = artifacts.require("BallswapRouter");
const Multicall = artifacts.require("Multicall");

// ============ Main Migration ============
const migration = async (deployer, network, accounts) => {
  await Promise.all([deployBallswapContracts(deployer, network, accounts)]);
};
module.exports = migration;

// ============ Deploy Functions ============
async function deployBallswapContracts(deployer) {
  // this _could_ go in constants, except that it would cost every consumer of the sdk the CPU to compute the hash
  // and load the JSON.
  const COMPUTED_INIT_CODE_HASH = keccak256(["bytes"], [`${bytecode}`]);

  console.log("COMPUTED_INIT_CODE_HASH", COMPUTED_INIT_CODE_HASH);
  await deployer.deploy(Multicall);
  await deployer.deploy(BallswapFactory, adminAccount);
  await deployer.deploy(BallswapRouter, BallswapFactory.address, WBNB);
  console.log("Multicall:", Multicall.address);
  console.log("BallswapRouter:", BallswapRouter.address);
  console.log("BallswapFactory:", BallswapFactory.address);
}