// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Address.sol";
import "hardhat/console.sol";

contract FlashLoanReceiver {
    using Address for address payable;

    address payable private pool;

    constructor(address payable poolAddress) {
        pool = poolAddress;
    }

    function receiverEther(uint256 fee) public payable {
        require(msg.sender == pool, "Sender must be pool");
        
        // Recommendations for avoiding the vulnerabilities found
        // require(tx.origin == owner)
        // require(msg.value >= fee, "This is not the best deal for you...");

        uint256 amountToBeRepaid = msg.value + fee;
        require(address(this).balance >= amountToBeRepaid, "Cannot borrow that much");

        _executeActionDuringFlashLoan();

        pool.sendValue(amountToBeRepaid);
    }

    function _executeActionDuringFlashLoan() internal { }

    receive () external payable {}
}