import { useRefunds } from "@/hooks/use-refunds";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RefundForm } from "@/components/refunds/RefundForm";
import { RefundFormData, Transaction, TransactionItem } from "@/types";
import { ChevronDown, ChevronRight, RefreshCcw } from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import { formatDateToPH } from "@/lib/utils/date";

interface TransactionListProps {
    transactions: Transaction[];
}

export default function TransactionList({
    transactions,
}: TransactionListProps) {
    const { refreshTransactions } = useTransactions();
    const { createRefund } = useRefunds();
    const [openRefundDialog, setOpenRefundDialog] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState<
        number | null
    >(null);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const handleRefund = (transactionId: number) => {
        setSelectedTransactionId(transactionId);
        setOpenRefundDialog(true);
    };

    const handleRefundSubmit = async (data: RefundFormData) => {
        try {
            await createRefund(data);
            setOpenRefundDialog(false);
            refreshTransactions();
        } catch (error) {
            console.error("Error processing refund:", error);
            alert("Failed to process refund. Please try again.");
        }
    };

    const toggleRow = (transactionId: number) => {
        setExpandedRows((current) =>
            current.includes(transactionId)
                ? current.filter((id) => id !== transactionId)
                : [...current, transactionId]
        );
    };

    const parseItems = (itemsString: string): TransactionItem[] => {
        try {
            return JSON.parse(itemsString);
        } catch (error) {
            console.error("Error parsing items:", error);
            return [];
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Transaction List</h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshTransactions}
                    className="flex items-center gap-2"
                >
                    <RefreshCcw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[30px]"></TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Payment Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.length > 0 ? (
                            transactions.map((transaction) => (
                                <>
                                    <TableRow
                                        key={transaction.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                    >
                                        <TableCell
                                            onClick={() =>
                                                toggleRow(transaction.id)
                                            }
                                        >
                                            {expandedRows.includes(
                                                transaction.id
                                            ) ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </TableCell>
                                        <TableCell
                                            onClick={() =>
                                                toggleRow(transaction.id)
                                            }
                                        >
                                            {transaction.id}
                                        </TableCell>
                                        <TableCell
                                            onClick={() =>
                                                toggleRow(transaction.id)
                                            }
                                        >
                                            {formatDateToPH(
                                                transaction.dateOfTransaction
                                            )}
                                        </TableCell>
                                        <TableCell
                                            onClick={() =>
                                                toggleRow(transaction.id)
                                            }
                                        >
                                            PHP{" "}
                                            {transaction.totalPrice.toFixed(2)}
                                        </TableCell>
                                        <TableCell
                                            onClick={() =>
                                                toggleRow(transaction.id)
                                            }
                                        >
                                            {transaction.paymentMethodName}
                                        </TableCell>
                                        <TableCell
                                            onClick={() =>
                                                toggleRow(transaction.id)
                                            }
                                        >
                                            {transaction.status ===
                                            "refunded" ? (
                                                <span className="text-red-500">
                                                    Refunded
                                                </span>
                                            ) : transaction.status ===
                                              "partially_refunded" ? (
                                                <span className="text-amber-500">
                                                    Partially Refunded
                                                </span>
                                            ) : (
                                                transaction.status
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleRefund(transaction.id)
                                                }
                                                disabled={
                                                    transaction.status ===
                                                    "refunded"
                                                }
                                            >
                                                Refund
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    {expandedRows.includes(transaction.id) && (
                                        <TableRow
                                            key={`expanded-row-${transaction.id}`}
                                        >
                                            <TableCell
                                                colSpan={7}
                                                className="bg-muted/30 p-4"
                                            >
                                                <div className="rounded-lg overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>
                                                                    Product
                                                                </TableHead>
                                                                <TableHead className="text-right">
                                                                    Quantity
                                                                </TableHead>
                                                                <TableHead className="text-right">
                                                                    Unit Price
                                                                </TableHead>
                                                                <TableHead className="text-right">
                                                                    Total
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {parseItems(
                                                                transaction.items
                                                            ).map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <TableRow
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <TableCell>
                                                                            {
                                                                                item.productName
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell className="text-right">
                                                                            {
                                                                                item.quantity
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell className="text-right">
                                                                            PHP{" "}
                                                                            {item.productSellPrice.toFixed(
                                                                                2
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell className="text-right">
                                                                            PHP{" "}
                                                                            {(
                                                                                item.quantity *
                                                                                item.productSellPrice
                                                                            ).toFixed(
                                                                                2
                                                                            )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            )}
                                                            <TableRow>
                                                                <TableCell
                                                                    colSpan={3}
                                                                    className="text-right font-bold"
                                                                >
                                                                    Total:
                                                                </TableCell>
                                                                <TableCell className="text-right font-bold">
                                                                    PHP{" "}
                                                                    {transaction.totalPrice.toFixed(
                                                                        2
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center py-4"
                                >
                                    No transactions found for this period
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {selectedTransactionId && (
                <RefundForm
                    open={openRefundDialog}
                    onOpenChange={setOpenRefundDialog}
                    onSubmit={handleRefundSubmit}
                    transactionId={selectedTransactionId}
                />
            )}
        </div>
    );
}
