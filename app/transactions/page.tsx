"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import TransactionList from "@/components/TransactionList";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "@/lib/export/types";
import { exportTransactions } from "@/lib/export/transactions";
import { exportProducts } from "@/lib/export/products";
import { useTransactions } from "@/hooks/use-transactions";
import { ExportType } from "@/lib/export/types";

export default function TransactionsPage() {
    const { userId } = useAuth();
    const [dateRange, setDateRange] = useState<DateRange>('week');
    const [exportType, setExportType] = useState<ExportType>('transactions');
    const { transactions } = useTransactions();

    if (!userId) {
        return <div>Please sign in to view transactions</div>;
    }

    const handleExport = () => {

        if(exportType === 'transactions') {
            exportTransactions(transactions, dateRange);

        } else {
            exportProducts(transactions, dateRange);
        }
    };


    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Transactions</h1>
                {/* Add New Transaction button can be added here */}
                <div className="flex gap-4 items-center">
                    <Select value={dateRange} onValueChange={(value: DateRange) => setDateRange(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">Last Week</SelectItem>
                            <SelectItem value="month">Last Month</SelectItem>
                            <SelectItem value="3months">Last 3 Months</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={exportType} onValueChange={(value: ExportType) => setExportType(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select export type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="transactions">Transactions</SelectItem>
                            <SelectItem value="products">Product Sales</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleExport}>
                        Export to Excel
                    </Button>
                </div>
            </div>
            <TransactionList />
        </div>
    );
}
