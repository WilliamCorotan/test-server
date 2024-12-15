import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  profilePicture: text("profile_picture"),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  description: text("description"),
  image: text("image"),
  buyPrice: real("buy_price").notNull(),
  sellPrice: real("sell_price").notNull(),
  stock: integer("stock").notNull(),
  lowStockLevel: integer("low_stock_level"),
  expirationDate: text("expiration_date"),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  date: text("date").notNull(),
  total: real("total").notNull(),
  paymentMethod: text("payment_method").notNull(),
});

export const transactionItems = sqliteTable("transaction_items", {
  id: integer("id").primaryKey(),
  transactionId: integer("transaction_id").references(() => transactions.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
});