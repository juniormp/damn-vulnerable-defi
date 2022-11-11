// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "hardhat/console.sol";

contract NaiveReceiverLenderPool is ReentrancyGuard {
    using Address for address;

    uint256 private constant FIXED_FEE = 1 ether;

    function fixedFee() external pure returns (uint256) {
        return FIXED_FEE;
    }

    function flashLoan(address borrower, uint256 borrowAmount) external nonReentrant {
        uint256 balanceBefore = address(this).balance;
        require(balanceBefore >= borrowAmount, "Not enough ETH in pool");

        require(borrower.isContract(), "Borrower must be a deployed contract");
       
        borrower.functionCallWithValue(
            abi.encodeWithSignature(
                "receiverEther(uint256)",
                FIXED_FEE
            ),
            borrowAmount
        );

        require(
            address(this).balance >= balanceBefore + FIXED_FEE,
            "Flash loan hasn't been paid back"
        );
    }

    receive () external payable {

    }
}