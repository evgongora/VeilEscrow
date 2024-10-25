import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

export const escrowFactory = getContract({
    address: "0x4eA6c71F6050ef2bF51FA8b482454DD6E950fFab",
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