import { db } from "@/lib/db";
import { transactions, orders } from "@/lib/db/schema";
import { Order, Transaction } from "@/types";
import { eq } from "drizzle-orm";

export async function getTransactions(userId: string) {
    return db
        .select()
        .from(transactions)
        .where(eq(transactions.clerkId, userId));
}

export async function createTransaction(
    data: Transaction,
    items: Order[],
    userId: string
) {
    const newTransaction = await db.insert(transactions).values({
        ...data,
        clerkId: userId,
        dateOfTransaction: new Date().toISOString(),
    });

    // Insert transaction items
    for (const item of items) {
        await db.insert(orders).values({
            transactionId: Number(newTransaction.lastInsertRowid),
            ...item,
        });
    }

    return newTransaction;
}
