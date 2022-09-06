require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const MAINNET_RPC_URL =
    process.env.MAINNET_RPC_URL ||
    process.env.ALCHEMY_MAINNET_RPC_URL ||
    "https://eth-mainnet.alchemyapi.io/v2/<your_key>"

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            // // If you want to do some forking, uncomment this
            forking: {
              url: MAINNET_RPC_URL,
              blockNumber: 15480189
            },
            chainId: 31337
        },
        localhost: {
            chainId: 31337,
        }
    },
    contractSizer: {
        runOnCompile: false,
        only: ["Raffle"],
    },
    solidity: {
        compilers: [
            {
                version: "0.8.7",
            },
            {
                version: "0.8.1",
            },
            {
                version: "0.7.3",
            },
            {
                version: "0.4.24",
            },
            {
                version: "0.4.26",
            },
            {
                version: "0.6.2"
            },
            {
                version: "0.6.0"
            }
        ],
    },
    mocha: {
        timeout: 500000, // 500 seconds max for running tests
    },
}