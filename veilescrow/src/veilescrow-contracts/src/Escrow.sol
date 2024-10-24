// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract Escrow is VRFConsumerBaseV2Plus {
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

    // Chainlink VRF Constants for Base Sepolia
    address constant VRF_COORDINATOR =
        0x5C210eF41CD1a72de73bF76eC39637bB0d3d7BEE;
    bytes32 constant KEY_HASH =
        0x9e1344a1247c8a1785d0a4681a27152bffdb43666ae5bf7d14d24a5efd44bf71;
    uint32 constant CALLBACK_GAS_LIMIT = 2500000;
    uint16 constant REQUEST_CONFIRMATIONS = 3;
    uint32 constant NUM_WORDS = 1;

    // Chainlink VRF state variables
    uint256 private s_subscriptionId;
    uint256 private choosenApplication;
    uint256 private choosenApplication;
    uint256 private lastRequestId;
    bool private randomnessRequested;

    // ChainLink Events
    event RandomnessRequested(uint256 requestId);
    event RandomnessFulfilled(uint256 requestId, uint256 randomNumber);
    event ProviderSelected(address provider);

    constructor(
        address semaphoreAddress,
        uint256 _reward,
        address _owner,
        uint256 subscriptionId
    ) VRFConsumerBaseV2Plus(VRF_COORDINATOR) {
        owner = _owner;
        maxApplications = 5;
        reward = _reward;
        isCompleted = false;
        isCancelled = false;
        // Semaphore initialization
        semaphore = ISemaphore(semaphoreAddress);
        groupID = semaphore.createGroup();
         // Chainlink VRF initialization
        s_subscriptionId = subscriptionId;
        choosenApplication = 0;
        choosenApplication = 0;
        randomnessRequested = false;
    }



    // TODO: Check to see if we pass the address or identity commitment
    function joinEscrow(address _application) external {
        require(applications.length < maxApplications, "The escrow is full");
        require(
            !alreadyJoined(_application),
            "The application is already in the escrow"
        );
        applications.push(_application);
    }

    function fundEscrow() external payable {
        require(msg.sender == owner, "Only the owner can fund the escrow");
        require(address(this).balance < reward, "The escrow is already funded");
    }

    function finishEscrow() external {
        require(msg.sender == owner, "Only the owner can finish the escrow");
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
        require(
            msg.sender == applications[choosenApplication],
            "Only the chosen application can claim the funds"
        );
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
        // Implementation Chainlink VRF
        // TODO: verify when updating choosenApplication rest 1, so that the index is correct
                require(!randomnessRequested, "Random selection already in progress");
        // TODO: verify when updating choosenApplication rest 1, so that the index is correct
        
        lastRequestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: KEY_HASH,
                subId: s_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: CALLBACK_GAS_LIMIT,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({
                    nativePayment: false  // Using LINK for payment
                }))
            })
        );
        
        randomnessRequested = true;
        emit RandomnessRequested(lastRequestId);
    }
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        require(requestId == lastRequestId, "Wrong request ID");
        require(randomnessRequested, "No random number requested");
        
        // Calculate the chosen application index (subtracting 1 is no longer needed as we use modulo)
        choosenApplication = randomWords[0] % applications.length;
        
        randomnessRequested = false;
        serviceProvider = applications[choosenApplication];
        
        emit RandomnessFulfilled(requestId, randomWords[0]);
        emit ProviderSelected(serviceProvider);
    }

    function pickProvider() private {
        require(
            applications.length == maxApplications,
            "The escrow is not full"
        );
        require(!isCompleted, "The escrow is already completed");
        require(!isCancelled, "The escrow is cancelled");
        randomPick();
        require(choosenApplication != 0, "Failed to pick a provider");
        // TODO: add choosenApplication to Semaphore group
        serviceProvider = applications[choosenApplication];
    }
}
