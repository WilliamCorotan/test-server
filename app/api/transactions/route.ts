import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const transactionsList = await db.select().from(transactions);
        return NextResponse.json(transactionsList);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { items, ...transactionData } = body;

        const newTransaction = await db.insert(transactions).values({
            ...transactionData,
            userId,
            date: new Date().toISOString(),
        });

        // Insert transaction items
        for (const item of items) {
            await db.insert(transactionItems).values({
                transactionId: newTransaction.lastInsertRowid,
                ...item,
            });
        }

        return NextResponse.json(newTransaction);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create transaction" },
            { status: 500 }
        );
    }
}
