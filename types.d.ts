// Types for Drizzle Schema

export type File = {
    id: string;
    filename?: string;
    filepath?: string;
    mimetype?: string;
    clerkId: string;
};

export type Payment = {
    id: number;
    name?: string;
    clerkId: string;
};

export type User = {
    id: number;
    clerkId: string;
    name?: string;
    email?: string;
    password?: string;
    token?: string;
    profilePicture?: string; // References files.id
};

export type ContactType = {
    id: number;
    name?: string;
    clerkId: string;
};

export type UserContact = {
    id: number;
    userId?: number; // References users.id
    contactId?: number;
    clerkId: string;
};

export type Setting = {
    id: number;
    name?: string;
    clerkId: string;
};

export type UserSetting = {
    id: number;
    userId?: number; // References users.id
    settingsId?: number; // References settings.id
    clerkId: string;
};

export type UnitMeasurement = {
    id: number;
    name?: string;
    description?: string;
    clerkId: string;
};

export type ProductCategory = {
    id: number;
    name?: string;
    description?: string;
    clerkId: string;
};

export type Product = {
    id?: number;
    name: string;
    code: string;
    description?: string | null | undefined;
    image?: string | null | undefined; // References files.id
    buyPrice: number;
    sellPrice: number;
    stock: number;
    lowStockLevel?: number | null | undefined;
    expirationDate?: string | null | undefined;
    unitMeasurementsId?: number | null | undefined; // References unit_measurements.id
    clerkId?: string;
};

export type Transaction = {
    id: number;
    paymentMethodId?: number; // References payments.id
    dateOfTransaction: string;
    emailTo?: string;
    cashReceived?: number;
    totalPrice: number;
    status: string; // Default: "active"
    clerkId: string;
};

export type Order = {
    id: number;
    productId?: number; // References products.id
    quantity: number;
    transactionId?: number; // References transactions.id
    clerkId: string;
};

export type TransactionHistory = {
    id: number;
    userId?: number; // References users.id
    transactionId?: number; // References transactions.id
    clerkId: string;
};
