import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

export const escrowFactory = getContract({
    address: "0x096FA38D3C0Ad9f7C4b6Ce743355AB7E64B46451",
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