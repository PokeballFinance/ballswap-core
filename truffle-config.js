require("dotenv-flow").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
module.exports = {
  migrations_directory: "./migrations",
  contracts_build_directory: "./build/contracts",
  compilers: {
    solc: {
      version: "0.6.12",
      docker: false,
      parser: "solcjs",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        evmVersion: "istanbul",
      },
    },
  },
  networks: {
    test: {
      host: "0.0.0.0",
      port: 8545,
      network_id: "1001",
      gasPrice: 50000000000,
      gas: 8000000000,
      network_id: "1001",
    },
    mainnet: {
      network_id: "56",
      provider: () =>
        new HDWalletProvider(
          [process.env.DEPLOYER_PRIVATE_KEY],
          "https://bsc-dataseed1.binance.org"
        ),
      from: process.env.DEPLOYER_ACCOUNT,
      timeoutBlocks: 800,
    },
    testnet: {
      network_id: "97",
      provider: () =>
        new HDWalletProvider(
          [process.env.DEPLOYER_PRIVATE_KEY],
          "https://data-seed-prebsc-1-s1.binance.org:8545"
        ),
      from: process.env.DEPLOYER_ACCOUNT,
      timeoutBlocks: 800,
    },
    coverage: {
      host: "0.0.0.0",
      network_id: "1002",
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 1,
    },
    docker: {
      host: "localhost",
      network_id: "1313",
      port: 8545,
      gasPrice: 1,
    },
  },
};
