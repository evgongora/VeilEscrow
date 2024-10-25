import { NextResponse } from 'next/server';
import { createXataClient } from '../db';

export async function GET(req: Request) {

    const xata = createXataClient();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    if (!category) {
        return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    try {
        const escrows = await xata.db.Escrows.filter({ category }).getMany();
        return NextResponse.json(escrows, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch escrows in category ${category}` }, { status: 500 });
    }
}
