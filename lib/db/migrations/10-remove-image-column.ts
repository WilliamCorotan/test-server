import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

export async function removeImageColumn() {
  try {
    // Disable foreign key constraints
    await db.run(sql`PRAGMA foreign_keys=off`);

    // First drop the products_new table if it exists
    await db.run(sql`DROP TABLE IF EXISTS products_new`);

    // Check if the image column exists in products table
    const columnExistsResult = await db.get<{ count: number }>(sql`
      SELECT COUNT(*) as count
      FROM pragma_table_info('products')
      WHERE name = 'image'
    `);

    const columnExists = columnExistsResult?.count ?? 0;

    if (columnExists > 0) {
      // Create a new table without the image column
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
          unit_measurements_id INTEGER,
          category_id INTEGER,
          clerk_id TEXT NOT NULL,
          deleted TEXT
        )
      `);

      // Copy data from old table to new table
      await db.run(sql`
        INSERT INTO products_new (
          id, name, code, description, image_url, buy_price, sell_price,
          stock, low_stock_level, expiration_date, unit_measurements_id,
          category_id, clerk_id, deleted
        )
        SELECT 
          id, name, code, description, 
          CASE 
            WHEN image_url IS NOT NULL THEN image_url 
            WHEN image IS NOT NULL THEN image 
            ELSE NULL 
          END as image_url,
          buy_price, sell_price, stock, low_stock_level,
          expiration_date, unit_measurements_id, category_id,
          clerk_id, deleted
        FROM products
      `);

      // Drop old table
      await db.run(sql`DROP TABLE IF EXISTS products`);

      // Rename new table to products
      await db.run(sql`ALTER TABLE products_new RENAME TO products`);

      // Add foreign key constraints after table creation
      await db.run(sql`
        CREATE INDEX IF NOT EXISTS idx_products_unit_measurements 
        ON products(unit_measurements_id)
      `);

      await db.run(sql`
        CREATE INDEX IF NOT EXISTS idx_products_category 
        ON products(category_id)
      `);

      console.log(
        `✓ Removed image column and foreign key constraints from products table`
      );
    } else {
      console.log(`✗ image column does not exist in products table`);
    }

    // Re-enable foreign key constraints
    await db.run(sql`PRAGMA foreign_keys=on`);
  } catch (error) {
    // Make sure to re-enable foreign keys even if there's an error
    await db.run(sql`PRAGMA foreign_keys=on`);
    console.error("Failed to remove image column:", error);
    throw error;
  }
}
