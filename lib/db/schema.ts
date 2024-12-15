import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const files = sqliteTable("files", {
    id: text("id").primaryKey(),
    filename: text("filename"),
    filepath: text("filepath"),
    mimetype: text("mimetype"),
});

export const payments = sqliteTable("payments", {
    id: integer("id").primaryKey(),
    name: text("name"),
});

export const users = sqliteTable("users", {
    id: integer("id").primaryKey(),
    name: text("name"),
    email: text("email"),
    password: text("password"),
    token: text("token"),
    profilePicture: text("profile_picture").references(() => files.id),
});

export const contactTypes = sqliteTable("contacts_types", {
    id: integer("id").primaryKey(),
    name: text("name"),
});

export const userContacts = sqliteTable("user_contacts", {
    id: integer("id").primaryKey(),
    userId: integer("user_id").references(() => users.id),
    contactId: integer("contact_id"),
});

export const settings = sqliteTable("settings", {
    id: integer("id").primaryKey(),
    name: text("name"),
});

export const userSettings = sqliteTable("user_settings", {
    id: integer("id").primaryKey(),
    userId: integer("user_id").references(() => users.id),
    settingsId: integer("settings_id").references(() => settings.id),
});

export const unitMeasurements = sqliteTable("unit_measurements", {
    id: integer("id").primaryKey(),
    name: text("name"),
    description: text("description"),
});

export const productCategories = sqliteTable("product_categories", {
    id: integer("id").primaryKey(),
    name: text("name"),
    description: text("description"),
});

export const products = sqliteTable("products", {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    code: text("code").notNull(),
    description: text("description"),
    image: text("image").references(() => files.id),
    buyPrice: real("buy_price").notNull(),
    sellPrice: real("sell_price").notNull(),
    stock: integer("stock").notNull(),
    lowStockLevel: integer("low_stock_level"),
    expirationDate: text("expiration_date"),
    unitMeasurementsId: integer("unit_measurements_id").references(
        () => unitMeasurements.id
    ),
});

export const transactions = sqliteTable("transactions", {
    id: integer("id").primaryKey(),
    paymentMethodId: integer("payment_method_id").references(() => payments.id),
    dateOfTransaction: text("date_of_transaction").notNull(),
    emailTo: text("email_to"),
    cashReceived: real("cash_received"),
    totalPrice: real("total_price").notNull(),
    status: text("status").notNull().default("active"),
});

export const orders = sqliteTable("orders", {
    id: integer("id").primaryKey(),
    productId: integer("product_id").references(() => products.id),
    quantity: integer("quantity").notNull(),
    transactionId: integer("transaction_id").references(() => transactions.id),
});

export const transactionsHistory = sqliteTable("transactions_history", {
    id: integer("id").primaryKey(),
    userId: integer("user_id").references(() => users.id),
    transactionId: integer("transaction_id").references(() => transactions.id),
});
