import { NextResponse } from 'next/server';
import { createXataClient } from '../db';

export async function POST(req: Request) {
    const xata = createXataClient();

    const { address, link } = await req.json();

    if (!address) {
        return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    } 

    try {
        const escrow = await xata.db.Escrows.filter({ address }).getFirst();
        const xata_id = escrow?.xata_id;

        const updatedEscrow = await xata.db.Escrows.update(String(xata_id), {
            submissionLink: link,
        });
        return NextResponse.json({ updatedEscrow }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: `Failed to finish escrow: ${errorMessage}` }, { status: 500 });
    }
}
