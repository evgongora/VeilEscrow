import { eth_blockNumber, getContractEvents, getRpcClient, prepareContractCall, prepareEvent, readContract, sendTransaction, waitForReceipt } from "thirdweb";
import { escrowFactory, getEscrow } from "./contracts";
import { baseSepolia } from "thirdweb/chains";
import { client } from "@/app/client";

// Semaphore address is the address of the semaphore contract in baseSepolia
// Reward is the reward for the escrow
// Owner is the owner of the escrow represented by the identity commitment made by semaphore
// Account is the account that is creating the escrow (Thirdweb account)
const semaphoreAddress = "0x1e0d7FF1610e480fC93BdEC510811ea2Ba6d7c2f";
const VRFAddress = "0x2D299462D31579097cC88C641ECEd2f20479E28E";

export const createEscrow = async (reward: bigint, owner: string, account: any) => {
    const transaction = prepareContractCall({
        contract: escrowFactory,
        method: "function createEscrow(address, uint256, address)",
        params: [semaphoreAddress, reward, owner]
    });

    const { transactionHash } = await sendTransaction({ account, transaction });
    console.log("transaction hash: ", transactionHash);

    const receipt = await waitForReceipt({
        client,
        chain: baseSepolia,
        transactionHash
    });

    const blockNumber = receipt.blockNumber;

    const escrowCreated = prepareEvent({
        signature: "event EscrowCreated(address indexed escrowAddress)",
    });

    const events = await getContractEvents({
        contract: escrowFactory,
        fromBlock: blockNumber,
        toBlock: blockNumber,
        events: [escrowCreated]
    })

    const escrowAddress = events[0].args.escrowAddress;

    console.log("escrow address: ", escrowAddress);

    return { escrowAddress, transactionHash};
}

// escrowAddress is the address of the escrow contract
// Identity is the identity commitment of the account
export const joinEscrow = async (escrowAddress: string, identity: bigint, account: any) => {

    const escrow = await getEscrow(escrowAddress);

    const transaction = prepareContractCall({
        contract: escrow,
        method: "function joinEscrow(uint256)",
        params: [identity]
    });

    const { transactionHash } = await sendTransaction({ account, transaction });
    console.log("transaction hash: ", transactionHash);


    return transactionHash;
}

// escrowAddress is the address of the escrow contract
// amount is the amount of ether to be funded
// account is thirdweb account
export const fundEscrow = async (escrowAddress: string, amount: bigint, account: any) => {
    const escrow = await getEscrow(escrowAddress);

    /// TODO: check how to send ether to the escrow
    const transaction = prepareContractCall({
        contract: escrow,
        method: "function fundEscrow()",
        params: [amount],
        value: amount
    });

    const { transactionHash } = await sendTransaction({ account, transaction });

    return transactionHash;
}

// escrowAddress is the address of the escrow contract
// account is the thirdweb account
export const finishEscrow = async (escrowAddress: string, account: any) => {
    const escrow = await getEscrow(escrowAddress);

    const transaction = prepareContractCall({
        contract: escrow,
        method: "function finishEscrow()"
    });

    const { transactionHash } = await sendTransaction({ account, transaction });
    console.log("transaction hash: ", transactionHash);


    return transactionHash;
}

// escrowAddress is the address of the escrow contract
// account is the thirdweb account
export const cancelEscrow = async (escrowAddress: string, account: any) => {
    const escrow = await getEscrow(escrowAddress);

    const transaction = prepareContractCall({
        contract: escrow,
        method: "function cancelEscrow()"
    });

    const { transactionHash } = await sendTransaction({ account, transaction });
    console.log("transaction hash: ", transactionHash);


    return transactionHash;
}

export const completeEscrow = async (escrowAddress: string, account: any) => {
    const escrow = await getEscrow(escrowAddress);

    const transaction = prepareContractCall({
        contract: escrow,
        method: "function finishEscrow()"
    });

    const { transactionHash } = await sendTransaction({ account, transaction });
    console.log("transaction hash: ", transactionHash);
}

function seededRandomInt(seed: any, min: any, max: any): any {
    const range = max - min + 1; // Ensure all values are BigInt
    return (Number(seed) % range) + min; // Use modulus to stay within range
}

export const pickApplication = async (escrowAddress: string, account: any) => {
    const escrow = await getEscrow(escrowAddress);

    const rpcRequest = getRpcClient({ client, chain: baseSepolia });
    const blockNumber = await eth_blockNumber(rpcRequest);

    // Generate a seed with the block number for randomness
    const random = seededRandomInt(blockNumber, 1, 2) - 1;
    console.log("Random number: ", random);


    const transaction = prepareContractCall({
        contract: escrow,
        method: "function setProvider(uint256)",
        params: [BigInt(random)]
    });

    const { transactionHash } = await sendTransaction({ account, transaction });
    console.log("transaction hash: ", transactionHash);
}

export const readApplicant = async (escrowAddress: string) => {
    const escrow = await getEscrow(escrowAddress);

    const applicant = await readContract({
        contract: escrow,
        method: "function applicant() view returns (uint256)"
    })
    return applicant;
}

// escrowAddress is the address of the escrow contract
// account is the thirdweb account
export const claimFunds = async (escrowAddress: string, account: any) => {
    const escrow = await getEscrow(escrowAddress);

    const transaction = prepareContractCall({
        contract: escrow,
        method: "function claimFunds()"
    });

    const { transactionHash } = await sendTransaction({ account, transaction });
    console.log("transaction hash: ", transactionHash);


    return transactionHash;
}

