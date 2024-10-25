import { NextResponse } from 'next/server';
import { createXataClient } from '../db';

export async function POST(req: Request) {

    const xata = createXataClient();

    const { address, title, description, reward, category, owner} = await req.json();

    try {
        const escrow = await xata.db.Escrows.create({
        address,
        title,
        description,
        reward,
        category,
        owner,
        status: 'posted',
        });

        return NextResponse.json(escrow, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: `Failed to create escrow ${error}` }, { status: 500 });
    }
    }
