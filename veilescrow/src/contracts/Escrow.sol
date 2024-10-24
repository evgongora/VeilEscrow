// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract Escrow {
    address private owner;
    // TODO: Check to see if we pass the address or identity commitment
    address[] private applications;
    address private serviceProvider;
    uint8 public maxApplications;
    uint256 public reward;
    bool public isCompleted;
    bool public isCancelled;
    // Semaphore
    uint256 private groupID;
    ISemaphore private semaphore;
    // Chainlink
    uint256 private choosenApplication;

    constructor(address semaphoreAddress, uint256 _reward, address _owner) {
        owner = _owner;
        maxApplications = 5;
        reward = _reward;
        isCompleted = false;
        isCancelled = false;
        // Semaphore initialization
        semaphore = ISemaphore(semaphoreAddress);
        groupID = semaphore.createGroup();
        // TODO: add Chainlink initialization
        choosenApplication = 0;
    }

    // TODO: Check to see if we pass the address or identity commitment
    function joinEscrow(address _application) external {
        require(applications.length < maxApplications, "The escrow is full");
        require(!alreadyJoined(_application), "The application is already in the escrow");
        applications.push(_application);
    }

    function fundEscrow() external payable {
        require(msg.sender == owner, "Only the owner can fund the escrow");
        require(address(this).balance < reward, "The escrow is already funded");
    }

    function finishEscrow() external {
        require(msg.sender == owner, "Only the owner can finish the escrow");
        require(applications.length == maxApplications, "The escrow is not full");
        require(address(this).balance == reward, "The escrow is not fully funded");
        require(!isCompleted, "The escrow is already completed");
        require(!isCancelled, "The escrow is cancelled");
        isCompleted = true;
    }

    function cancelEscrow() external {
        require(msg.sender == owner, "Only the owner can cancel the escrow");
        require(address(this).balance == 0, "Can not cancel a funded escrow");
        require(!isCompleted, "The escrow is completed");
        require(!isCancelled, "The escrow is already cancelled");
        isCancelled = true;
    }

    function claimFunds() external {
        require(isCompleted, "The escrow is not completed");
        require(!isCancelled, "The escrow is cancelled");
        // TODO: change require to use semaphore and check if the provider is in the group
        require(msg.sender == applications[choosenApplication], "Only the chosen application can claim the funds");
        (bool success, ) = address(this).call{value: reward}("");
        require(success, "Failed to withdraw funds");
    }

    function alreadyJoined(address _application) private view returns (bool) {
        for (uint256 i = 0; i < applications.length; i++) {
            if (applications[i] == _application) {
                return true;
            }
        }
        return false;
    }

    function randomPick() private {
        // TODO: Implement Chainlink VRF
        // TODO: when updating choosenApplication rest 1, so that the index is correct
    }

    function pickProvider() private {
        require(applications.length == maxApplications, "The escrow is not full");
        require(!isCompleted, "The escrow is already completed");
        require(!isCancelled, "The escrow is cancelled");
        randomPick();
        require(choosenApplication != 0, "Failed to pick a provider");
        // TODO: add choosenApplication to Semaphore group
        serviceProvider = applications[choosenApplication];
    }



}