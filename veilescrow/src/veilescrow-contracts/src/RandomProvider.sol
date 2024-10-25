// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract RandomProvider is VRFConsumerBaseV2Plus {
    // Chainlink VRF Constants for Base Sepolia
    address constant VRF_COORDINATOR =
        0x5C210eF41CD1a72de73bF76eC39637bB0d3d7BEE;
    bytes32 constant KEY_HASH =
        0x9e1344a1247c8a1785d0a4681a27152bffdb43666ae5bf7d14d24a5efd44bf71;
    uint32 constant CALLBACK_GAS_LIMIT = 2500000;
    uint16 constant REQUEST_CONFIRMATIONS = 3;
    uint32 constant NUM_WORDS = 1;

    // State variables
    uint256 private s_subscriptionId = 74496863741044044592709429617664637200730873973428186765551179744330276806949;
    uint256 private lastRequestId;
    uint256 private lastRandomNumber;
    bool private randomnessRequested;
    address private owner;

    // Events
    event RandomnessRequested(uint256 requestId);
    event RandomnessFulfilled(uint256 requestId, uint256 randomNumber);

    constructor() VRFConsumerBaseV2Plus(VRF_COORDINATOR) {
        randomnessRequested = false;
        s_vrfCoordinator = IVRFCoordinatorV2Plus(VRF_COORDINATOR);
    }

    function requestRandomNumber(uint256 max) external returns (uint256) {
        require(!randomnessRequested, "Random selection already in progress");
        require(max > 0, "Maximum value must be greater than 0");

        lastRequestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: KEY_HASH,
                subId: s_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: CALLBACK_GAS_LIMIT,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );

        randomnessRequested = true;
        emit RandomnessRequested(lastRequestId);
        return lastRequestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] calldata _randomWords
    ) internal override {
        require(_requestId == lastRequestId, "Wrong request ID");
        require(randomnessRequested, "No random number requested");

        lastRandomNumber = _randomWords[0];
        randomnessRequested = false;

        emit RandomnessFulfilled(_requestId, _randomWords[0]);
    }

    function getLastRandomNumber() external view returns (uint256) {
        return lastRandomNumber;
    }
}
