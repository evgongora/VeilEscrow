// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "./Escrow.sol";

contract EscrowManager {
    Escrow[] private escrows;

    function createEscrow(address semaphoreAddress, uint256 _reward, address _owner) external {
        Escrow escrow = new Escrow(semaphoreAddress, _reward, _owner);
        escrows.push(escrow);
    }

    function getEscrows() external view returns (Escrow[] memory) {
        return escrows;
    }

}