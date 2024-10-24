import { prepareContractCall, sendTransaction } from "thirdweb";
import { escrowFactory, getEscrow } from "./contracts";

// Semaphore address is the address of the semaphore contract in baseSepolia
// Reward is the reward for the escrow
// Owner is the owner of the escrow represented by the identity commitment made by semaphore
// Account is the account that is creating the escrow (Thirdweb account)
export const createEscrow = async (semaphoreAddress: string, reward: bigint, owner: bigint, account: any) => {
    const transaction = prepareContractCall({
        contract: escrowFactory,
        method: "function createEscrow(address, uint256, uin256)",
        params: [semaphoreAddress, reward, owner]
    });

    const { transactionHash } = await sendTransaction({ account, transaction });

    return transactionHash;
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
        method: "function fundEscrow(uint256)",
        params: [amount]
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

    return transactionHash;
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

    return transactionHash;
}

