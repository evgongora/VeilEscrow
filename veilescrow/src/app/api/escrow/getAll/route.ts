import { NextResponse } from 'next/server';
import { createXataClient } from '../db';

export async function GET() {
    
    const xata = createXataClient();

    try {
        const escrows = await xata.db.Escrows.getMany();

        return NextResponse.json(escrows, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch escrows' }, { status: 500 });
    }
    }
