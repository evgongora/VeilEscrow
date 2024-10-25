// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "./Escrow.sol";

contract EscrowManager {
    Escrow[] private escrows;

    event EscrowCreated(address indexed escrowAddress);

    function createEscrow(address semaphoreAddress, uint256 _reward, address _owner) external {
        Escrow escrow = new Escrow(semaphoreAddress, _reward, _owner, 0x08881B24294A6E4126d873679c5085EB075C9Aa8);
        emit EscrowCreated(address(escrow));
        escrows.push(escrow);
    }

    function getEscrows() external view returns (Escrow[] memory) {
        return escrows;
    }

}