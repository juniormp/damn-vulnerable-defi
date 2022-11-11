require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { GOERLI_RPC_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: {
        mnemonic: PRIVATE_KEY,
      },
      saveDeployments: true,
      chainId: 5,
    },
  },
  etherscan: {
    apiKey: "KQZK4PVI2QHMK4G882AF1ZZYQCIKQNF13As", // Your Etherscan API key
  },
};
