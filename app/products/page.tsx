"use client";

import { useAuth } from "@clerk/nextjs";
// import ProductList from "@/components/ProductList";

export default function ProductsPage() {
    const { userId } = useAuth();

    if (!userId) {
        return <div>Please sign in to view products</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Products</h1>
            {/* <ProductList /> */}
        </div>
    );
}
