import { NextResponse } from 'next/server';
import { finishEscrow } from '@/utils/contract-functions';

export async function POST(req: Request) {
    const { escrowAddress, account } = await req.json();

    try {
        const transactionHash = await finishEscrow(escrowAddress, account);
        return NextResponse.json({ transactionHash }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: `Failed to finish escrow: ${errorMessage}` }, { status: 500 });
    }
}
