import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

export async function restoreForeignKeys() {
  try {
    // Disable foreign key constraints temporarily
    await db.run(sql`PRAGMA foreign_keys=off`);

    // Create new table with foreign key constraints
    await db.run(sql`
      CREATE TABLE products_new (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        buy_price REAL NOT NULL,
        sell_price REAL NOT NULL,
        stock INTEGER NOT NULL,
        low_stock_level INTEGER,
        expiration_date TEXT,
        unit_measurements_id INTEGER REFERENCES unit_measurements(id),
        category_id INTEGER REFERENCES product_categories(id),
        clerk_id TEXT NOT NULL,
        deleted TEXT
      )
    `);

    // Copy data from old table
    await db.run(sql`
      INSERT INTO products_new 
      SELECT * FROM products
    `);

    // Drop old table
    await db.run(sql`DROP TABLE products`);

    // Rename new table
    await db.run(sql`ALTER TABLE products_new RENAME TO products`);

    // Recreate indexes
    await db.run(sql`
      CREATE INDEX IF NOT EXISTS idx_products_unit_measurements 
      ON products(unit_measurements_id)
    `);

    await db.run(sql`
      CREATE INDEX IF NOT EXISTS idx_products_category 
      ON products(category_id)
    `);

    // Re-enable foreign key constraints
    await db.run(sql`PRAGMA foreign_keys=on`);

    console.log("✓ Restored foreign key constraints for products table");
  } catch (error) {
    // Make sure to re-enable foreign keys even if there's an error
    await db.run(sql`PRAGMA foreign_keys=on`);
    console.error("Failed to restore foreign key constraints:", error);
    throw error;
  }
}
