const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const DamnValuableToken = await ethers.getContractFactory("DamnValuableToken");
  const damnValuableToken = await DamnValuableToken.deploy();
  await damnValuableToken.deployed();
  console.log('damnValuableToken Contract Address - ' + damnValuableToken.address);

  const UnstoppableLender = await ethers.getContractFactory("UnstoppableLender");
  const unstoppableLender = await UnstoppableLender.deploy(damnValuableToken.address);
  await unstoppableLender.deployed();
  console.log('unstoppableLender Contract Address - ' + unstoppableLender.address);

  const ReceiverUnstoppable = await ethers.getContractFactory("ReceiverUnstoppable");
  const receiverUnstoppable = await ReceiverUnstoppable.deploy(unstoppableLender.address);
  await receiverUnstoppable.deployed();
  console.log('receiverUnstoppable Contract Address - ' + receiverUnstoppable.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
