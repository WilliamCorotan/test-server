import { DateRange, ProductSalesSummary, Transaction, TransactionItem } from "@/types";
import { filterTransactionsByDate } from "./date-filters";
import * as XLSX from 'xlsx';
import { format } from "date-fns";

export const calculateProductSales = (transactions: Transaction[]) =>  {
    const productSales = new Map<number, ProductSalesSummary>();

    console.log('check mee >>> transaction',transactions);
    transactions.forEach((transaction) => {
        const items = JSON.parse(transaction.items);
        console.log('check mee >>> items',items);
        items?.forEach((item : TransactionItem) => {
            const existing = productSales.get(item.productId);
            if(existing) {
                existing.totalQuantity += item.quantity;
                existing.totalAmount += item.quantity * item.productSellPrice;
                existing.averagePrice = existing.totalAmount / existing.totalQuantity;
            } else {
                productSales.set(item.productId, {
                    productId: item.productId,
                    name: item.productName,
                    totalQuantity: item.quantity,
                    totalAmount: item.quantity * item.productSellPrice,
                    averagePrice: item.productSellPrice
                });
            }
        });
    });

    return Array.from(productSales.values());

};

export const exportProducts = async (transactions: Transaction[], range: DateRange) => {
    const filteredTransactions = filterTransactionsByDate(transactions, range);
    const productSales = calculateProductSales(filteredTransactions);

    const data = productSales.map(product => ({
        'Product ID': product.productId,
        'Product Name': product.name,
        'Total Quantity Sold': product.totalQuantity,
        'Total Amount Sold': `PHP ${product.totalAmount.toFixed(2)}`,
        'Average Price': `PHP ${product.averagePrice.toFixed(2)}`
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    const totalQuantity = productSales.reduce((acc, product) => acc + product.totalQuantity, 0);
    const totalAmount = productSales.reduce((acc, product) => acc + product.totalAmount, 0);

    XLSX.utils.sheet_add_aoa(ws, [
        [''],
        ['Summary'],
        ['Total Products Sold', totalQuantity],
        ['Total Amount Sold', `PHP ${totalAmount.toFixed(2)}`]
    ], { origin: -1 });

    XLSX.utils.book_append_sheet(wb, ws, 'Products');

    const fileName = `products_${range}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(wb, fileName);
}