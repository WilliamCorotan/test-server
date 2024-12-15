"use client";

import { useAuth } from "@clerk/nextjs";
// import TransactionList from "@/components/TransactionList";

export default function TransactionsPage() {
    const { userId } = useAuth();

    if (!userId) {
        return <div>Please sign in to view transactions</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Transactions</h1>
            {/* <TransactionList /> */}
        </div>
    );
}
