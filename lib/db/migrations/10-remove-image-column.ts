import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

export async function removeImageColumn() {
  try {
    // Check if the column exists
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
          unit_measurements_id INTEGER REFERENCES unit_measurements(id),
          category_id INTEGER REFERENCES product_categories(id),
          clerk_id TEXT NOT NULL,
          deleted TEXT
        )
      `);

      // Copy data from old table to new table
      await db.run(sql`
        INSERT INTO products_new
        SELECT 
          id,
          name,
          code,
          description,
          image_url,
          buy_price,
          sell_price,
          stock,
          low_stock_level,
          expiration_date,
          unit_measurements_id,
          category_id,
          clerk_id,
          deleted
        FROM products
      `);

      // Drop old table
      await db.run(sql`DROP TABLE products`);

      // Rename new table to products
      await db.run(sql`ALTER TABLE products_new RENAME TO products`);

      console.log(`✓ Removed image column from products table`);
    } else {
      console.log(`✗ image column does not exist in products table`);
    }
  } catch (error) {
    console.error("Failed to remove image column:", error);
    throw error;
  }
}
