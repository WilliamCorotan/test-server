import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { PaymentMethod } from "@/types";
import { eq, and } from "drizzle-orm";

export async function getPaymentMethods(userId: string) {
    return db.select().from(payments).where(eq(payments.clerkId, userId));
}

export async function createPaymentMethod(data: PaymentMethod, userId: string) {
    return db.insert(payments).values({
        ...data,
        clerkId: userId,
    });
}

export async function updatePaymentMethod(
    id: number,
    data: PaymentMethod,
    userId: string
) {
    return db
        .update(payments)
        .set(data)
        .where(and(eq(payments.id, id), eq(payments.clerkId, userId)))
        .returning();
}

export async function deletePaymentMethod(id: number, userId: string) {
    return db
        .delete(payments)
        .where(and(eq(payments.id, id), eq(payments.clerkId, userId)));
}
