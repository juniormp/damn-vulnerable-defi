const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const NaiveReceiverLenderPool = await ethers.getContractFactory("NaiveReceiverLenderPool");
  const naiveReceiverLenderPool = await NaiveReceiverLenderPool.deploy();
  await naiveReceiverLenderPool.deployed();
  console.log('NaiveReceiverLenderPool Contract Address - ' + naiveReceiverLenderPool.address);

  const FlashLoanReceiver = await ethers.getContractFactory("FlashLoanReceiver");
  const flashLoanReceiver = await FlashLoanReceiver.deploy(naiveReceiverLenderPool.address);
  await flashLoanReceiver.deployed();
  console.log('FlashLoanReceiver Contract Address - ' + flashLoanReceiver.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
