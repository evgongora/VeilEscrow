import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

export const escrowFactory = getContract({
    address: "0xE9906a1b3f29565d12C044f0365F2d6Da089041a",
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