import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { Product } from "@/types";
import { and, eq } from "drizzle-orm";

export async function getProducts(userId: string) {
    return db.select().from(products).where(eq(products.clerkId, userId));
}

export async function createProduct(data: Product, userId: string) {
    console.log("checkk >> before: ", data);
    return db.insert(products).values({
        ...data,
        unitMeasurementsId:
            data.unitMeasurementsId === 0 ? null : data.unitMeasurementsId,
        clerkId: userId,
    });
}

export async function updateProduct(id: number, data: Product, userId: string) {
    if (data.unitMeasurementsId === 0) {
        data.unitMeasurementsId = undefined;
    }

    data.clerkId = userId;

    return db
        .update(products)
        .set(data)
        .where(and(eq(products.id, id), eq(products.clerkId, userId)))
        .returning();
}

export async function deleteProduct(id: number, userId: string) {
    return db
        .delete(products)
        .where(and(eq(products.id, id), eq(products.clerkId, userId)));
}
