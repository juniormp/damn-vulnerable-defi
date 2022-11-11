// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface IReceiver {
    function receiveTokens(address tokenAddress, uint256 amount) external;
}