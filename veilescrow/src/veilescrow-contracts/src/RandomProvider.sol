// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "./Escrow.sol";

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
    uint256 private constant IN_PROGRESS = 42;
    // Maps requests id to an address
    mapping(uint256 => address) private s_rollers;
    // Maps address to choosen number
    mapping(address => uint256) public s_choosenNumber;

    // Events
    event RandomnessRequested(uint256 requestId);
    event RandomnessFulfilled(uint256 requestId, uint256 randomNumber);

    constructor() VRFConsumerBaseV2Plus(VRF_COORDINATOR) {
        s_vrfCoordinator = IVRFCoordinatorV2Plus(VRF_COORDINATOR);
    }

    function requestRandomNumber() external returns (uint256) {
        require(s_choosenNumber[msg.sender] == 0, "Already choosen a number");

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

        s_rollers[lastRequestId] = msg.sender;
        s_choosenNumber[msg.sender] = IN_PROGRESS;
        emit RandomnessRequested(lastRequestId);
        return lastRequestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] calldata _randomWords
    ) internal override {
        require(_requestId == lastRequestId, "Wrong request ID");
        // Transform the random number to a number between 1 and 2 (inclusive)
        uint256 value = _randomWords[0] % 2 + 1;

        lastRandomNumber = value;
        s_choosenNumber[s_rollers[_requestId]] = value;

        // Escrow picker
        address escrowAddress = s_rollers[_requestId];
        Escrow escrow = Escrow(escrowAddress);
        // -1 because the value is between 1 and 2, so it becomes 0 and 1
        uint256 index = value - 1;
        escrow.setProvider(index);
        emit RandomnessFulfilled(_requestId, value);
    }

    function getLastRandomNumber() external view returns (uint256) {
        return lastRandomNumber;
    }
}
