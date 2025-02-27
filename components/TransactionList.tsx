import { useTransactions } from "@/hooks/use-transactions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function TransactionList() {
    const { transactions, loading, error } = useTransactions();

    console.log("transactions:", transactions);

    if (loading) {
        return <div>Loading transactions...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    console.log("a", transactions);
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.dateOfTransaction).toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    }
                  )}
                </TableCell>
                <TableCell>PHP{transaction.totalPrice}</TableCell>
                <TableCell>{transaction.paymentMethodName}</TableCell>
                <TableCell>{transaction.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
}
