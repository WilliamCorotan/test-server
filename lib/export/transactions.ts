import { DateRange, Transaction } from "@/types";
import { format } from "date-fns";
import { filterTransactionsByDate } from "./date-filters";
import * as XLSX from "xlsx";

export const exportTransactions = async (
    transactions: Transaction[],
    range: DateRange
) => {
    const filteredTransactions = filterTransactionsByDate(transactions, range);

    const data = filteredTransactions.map((transaction) => ({
        "Transaction ID": transaction.id,
        Date: format(
            new Date(transaction.dateOfTransaction),
            "MM/dd/yyyy HH:mm:ss"
        ),

        "Payment Method": transaction.paymentMethodName,
        Status: transaction.status,
        "Cash Received": transaction.cashReceived
            ? `PHP ${transaction.cashReceived.toFixed(2)}`
            : "-",
        "Total Amount": `PHP ${transaction.totalPrice.toFixed(2)}`,
        "Total Refund":
            transaction.totalRefund > 0
                ? `PHP ${transaction.totalRefund.toFixed(2)}`
                : "-",
        "Refund Reason": transaction.refundReasons || "-",
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Add summary information
    const totalAmount = filteredTransactions.reduce(
        (sum, t) => sum + t.totalPrice,
        0
    );
    const totalRefunds = filteredTransactions.reduce(
        (sum, t) => sum + (t.totalRefund || 0),
        0
    );
    const netAmount = totalAmount - totalRefunds;

    XLSX.utils.sheet_add_aoa(
        ws,
        [
            [""],
            ["Summary"],
            ["Total Transactions", filteredTransactions.length],
            ["Total Amount", `PHP ${totalAmount.toFixed(2)}`],
            ["Total Refunds", `PHP ${totalRefunds.toFixed(2)}`],
            ["Net Amount", `PHP ${netAmount.toFixed(2)}`],
        ],
        { origin: -1 }
    );

    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    const fileName = `transactions_${range}_${format(
        new Date(),
        "yyyy-MM-dd"
    )}.xlsx`;
    XLSX.writeFile(wb, fileName);
};
