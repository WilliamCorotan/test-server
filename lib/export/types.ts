export type DateRange = 'week' | 'month' | '3months';

export type ExportType = 'transactions' | 'products';

export type TransactionItem = {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    productSellPrice: number;
}

export type ExportTransaction = {
    id: number;
    dateOfTransaction: string;
    totalPrice: number;
    paymentMethodId: string;
    status: string;
    cashReceived?: number;
    emailTo?: string;
    clerkId?: string;
    items?: TransactionItem[];
}

