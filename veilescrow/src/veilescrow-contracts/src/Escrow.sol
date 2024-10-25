// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "./RandomProvider.sol";

contract Escrow {
    address private serviceSeeker;
    uint256[] private applications;
    address[] private applicants;
    address private serviceProvider;
    uint8 public maxApplications;
    uint256 public reward;
    bool public isCompleted;
    bool public isCancelled;
    // Semaphore
    uint256 private groupID;
    ISemaphore private semaphore;
    uint256 public choosenApplication;
    // Chainlink VRF
    address private constant randomProvider = 0xFAA40A57F5857b2D5456e59BbB57a26608e97b6B;

    constructor(
        address semaphoreAddress,
        uint256 _reward,
        address _serviceSeeker
    ) {
        serviceSeeker = _serviceSeeker;
        maxApplications = 2;
        reward = _reward;
        isCompleted = false;
        isCancelled = false;
        // Semaphore initialization
        semaphore = ISemaphore(semaphoreAddress);
        groupID = semaphore.createGroup();
        choosenApplication = 0;
    }

    function joinEscrow(uint256 _application) external {
        require(applications.length < maxApplications, "The escrow is full");
        // TODO: add restriction to make sure owner can't join, not done for PoC
        require(
            !alreadyJoined(_application),
            "The application is already in the escrow"
        );
        applicants.push(msg.sender);
        applications.push(_application);
        semaphore.addMember(groupID, _application);
    }

    function fundEscrow() external payable {
        require(
            msg.sender == serviceSeeker,
            "Only the owner can fund the escrow"
        );
        require(address(this).balance < reward, "The escrow is already funded");
    }

    function finishEscrow() external {
        require(
            msg.sender == serviceSeeker,
            "Only the owner can finish the escrow"
        );
        require(
            applications.length == maxApplications,
            "The escrow is not full"
        );
        require(
            address(this).balance == reward,
            "The escrow is not fully funded"
        );
        require(!isCompleted, "The escrow is already completed");
        require(!isCancelled, "The escrow is cancelled");
        isCompleted = true;
    }

    function cancelEscrow() external {
        require(
            msg.sender == serviceSeeker,
            "Only the owner can cancel the escrow"
        );
        require(address(this).balance == 0, "Can not cancel a funded escrow");
        require(!isCompleted, "The escrow is completed");
        require(!isCancelled, "The escrow is already cancelled");
        isCancelled = true;
    }

    function claimFunds() external {
        require(isCompleted, "The escrow is not completed");
        require(!isCancelled, "The escrow is cancelled");
        require(
            msg.sender == serviceProvider,
            "Only the chosen application can claim the funds"
        );
        (bool success, ) = msg.sender.call{value: reward}("");
        require(success, "Failed to withdraw funds");
    }

    function alreadyJoined(uint256 _application) private view returns (bool) {
        for (uint256 i = 0; i < applications.length; i++) {
            if (applications[i] == _application) {
                return true;
            }
        }
        return false;
    }

    function pickProvider() private {
        require(
            applications.length == maxApplications,
            "The escrow is not full"
        );
        require(!isCompleted, "The escrow is already completed");
        require(!isCancelled, "The escrow is cancelled");
        RandomProvider random = RandomProvider(randomProvider);
        random.requestRandomNumber();        
    }

    function setProvider(uint256 index) external {
        require(
            applications.length == maxApplications,
            "The escrow is not full"
        );
        require(!isCompleted, "The escrow is already completed");
        require(!isCancelled, "The escrow is cancelled");
        require(index < applications.length, "Invalid index");
        serviceProvider = applicants[index];
    }
}
