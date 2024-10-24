import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

export const escrowFactory = getContract({
    address: "",
    chain: baseSepolia,
    client
}) 

export const getEscrow = async (escrowAddress: string) => {
    const escrow = getContract({
        address: escrowAddress,
        chain: baseSepolia,
        client
    });

    return escrow;
}