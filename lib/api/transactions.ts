import { db } from "@/lib/db";
import { transactions, orders, payments, products } from "@/lib/db/schema";
import { eq, sql, getTableColumns } from "drizzle-orm";

type TransactionFromApp = {
    id: number;
    date_of_transaction: string;
    total_price: string;
    payment_method_id: string;
    status: string;
    cash_received: string;
    email_to?: string;
    clerk_id?: string;
};

type TransactionItemFromApp = {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    clerk_id: string;
};

export async function getTransactions(userId: string) {
    return db
        .select({
            ...getTableColumns(transactions),
            items: sql`(
                SELECT json_group_array(json_object(
                    'id', ${orders.id},
                    'productId', ${products.id},
                    'productName', ${products.name},
                    'productSellPrice', ${products.sellPrice},
                    'productBuyPrice', ${products.buyPrice},
                    'quantity', ${orders.quantity}
                ))
                FROM ${orders}
                JOIN ${products} ON ${orders.productId} = ${products.id}
                WHERE ${orders.transactionId} = ${transactions.id}
            )`.as("items"),
            paymentMethodName: payments.name,
        })
        .from(transactions)
        .leftJoin(payments, eq(transactions.paymentMethodId, payments.id))
        .where(eq(transactions.clerkId, userId));
}

export async function createTransaction(
    data: TransactionFromApp,
    items: TransactionItemFromApp[],
    userId: string
) {
    try {
        const date = new Date(data.date_of_transaction);
        const dateOfTransaction = `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(
            date.getHours()
        ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
            2,
            "0"
        )}:${String(date.getSeconds()).padStart(2, "0")}`;

        const insertData = {
            ...data,
            paymentMethodId: parseInt(data.payment_method_id),
            dateOfTransaction: dateOfTransaction,
            emailTo: data.email_to ?? null,
            totalPrice: parseFloat(data.total_price),
            cashReceived: parseFloat(data.cash_received),
            clerkId: userId,
        };

        const newTransaction = await db.insert(transactions).values(insertData);

        console.log("items:", items);
        // Insert transaction items
        for (const item of items) {
            await db.insert(orders).values({
                transactionId:
                    parseInt(
                        newTransaction.lastInsertRowid?.toString() ?? ""
                    ) ?? null,
                clerkId: userId,
                productId: item.product_id ?? null,
                quantity: item.quantity ?? null,
            });
        }

        return newTransaction;
    } catch (error) {
        console.error("Error creating transaction:", error);
        throw error;
    }
}
