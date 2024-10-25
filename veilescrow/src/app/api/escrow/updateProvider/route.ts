import { NextResponse } from 'next/server';
import { createXataClient } from '../db';

export async function POST(req: Request) {
    const xata = createXataClient();

    // Parse the request body to retrieve address and applicant
    const { address, applicant } = await req.json();

    if (!address || !applicant) {
        return NextResponse.json({ error: 'Address and applicant are required' }, { status: 400 });
    }

    try {
        // Update the escrow with the given address by setting status to 'current' and provider to applicant
        const updatedEscrow = await xata.db.Escrows.update(address, {
            status: 'current',
            provider: applicant,
        });

        return NextResponse.json(updatedEscrow, { status: 200 });
    } catch (error) {
        console.error("Error updating escrow:", error);
        return NextResponse.json({ error: `Failed to update escrow with address ${address}` }, { status: 500 });
    }
}
