import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

export const escrowFactory = getContract({
    address: "0xE898120e6131a07ae0bFF9F82e43aEB6969F346A",
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