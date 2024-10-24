import { getXataClient } from "@/xata";

const xata = getXataClient();

export const createEscrow = async (address: string, description: string, reward: number, category: string) => {
    const escrow = await xata.db.Escrows.create({
        address,
        description,
        reward,
        category
    });

    return escrow;
}

export const getEscrows = async () => {
    const escrows = await xata.db.Escrows.getMany();

    return escrows;
}


export const getEscrowByCategory = async (category: string) => {
    const escrows = await xata.db.Escrows.filter({
        category: category 
    }).getMany();

    return escrows;
}