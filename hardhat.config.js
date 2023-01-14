/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();
const MAINNET_RPC = process.env.MAINNET_RPC;
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: MAINNET_RPC,
      },
    },
    localhost: {
      chainId: 1,
      forking: {
        url: MAINNET_RPC,
      },
    },
  },
};
