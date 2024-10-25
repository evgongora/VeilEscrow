import { NextResponse } from 'next/server';
import { createXataClient } from '../db';

export async function POST(req: Request) {

    const xata = createXataClient();

    const { address, description, reward, category } = await req.json();

    try {
        const escrow = await xata.db.Escrows.create({
        address,
        description,
        reward,
        category,
        });

        return NextResponse.json(escrow, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to create escrow' }, { status: 500 });
    }
    }
