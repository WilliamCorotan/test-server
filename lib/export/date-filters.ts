import { DateRange, Transaction } from '@/types';
import { subWeeks, subMonths } from 'date-fns';


export const getDateRange = (dateRange: DateRange): Date => {
    const now = new Date();
    let startDate: Date;
    
    switch (dateRange) {
        case 'week':
        startDate = subWeeks(now, 1);
        break;
        case 'month':
        startDate = subMonths(now, 1);
        break;
        case '3months':
        startDate = subMonths(now, 3);
        break;
        default:
        startDate = subWeeks(now, 1);
    }
    
    return startDate;
}

export const filterTransactionsByDate = (transactions: Transaction[], dateRange: DateRange) => {
    const startDate = getDateRange(dateRange);
    
    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.dateOfTransaction);
        return transactionDate >= startDate && transactionDate <= new Date();
    });
};