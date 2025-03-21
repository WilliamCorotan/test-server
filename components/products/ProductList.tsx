import { useProducts } from "@/hooks/use-products";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ProductForm } from "./ProductForm";
import { RestockForm } from "./RestockForm";
import { useState } from "react";
import {
  Pencil,
  Trash2,
  AlertTriangle,
  PackagePlus,
  FileDown,
  Package,
} from "lucide-react";
import { Product, ProductFormData } from "@/types";
import { ProductSummary } from "./ProductSummary";
import { format } from "date-fns";
import { useCategories } from "@/hooks/use-categories";
import Image from "next/image";

type Options = {
  type: "products" | "inventory";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: ProductFormData) => void;
  initialData?: Product | null;
  mode?: "create" | "edit";
};

interface ProductListProps {
  options: Options;
}

export default function ProductList({ options }: ProductListProps) {
  const { products, loading, error, createProduct, refreshProducts } =
    useProducts();
  const { categories } = useCategories();
  const [openDialog, setOpenDialog] = useState(false);
  const [openRestockDialog, setOpenRestockDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [restockingProduct, setRestockingProduct] = useState<Product | null>(
    null
  );
  const [mode, setMode] = useState<"create" | "edit">("create");

  const handleCreate = () => {
    setMode("create");
    setEditingProduct(null);
    setOpenDialog(true);
  };

  const handleEdit = (product: Product) => {
    setMode("edit");
    setEditingProduct(product);
    setOpenDialog(true);
  };

  const handleRestock = (product: Product) => {
    setRestockingProduct(product);
    setOpenRestockDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete product");
        refreshProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleSubmit = async (data: ProductFormData) => {
    try {
      const processedData = {
        ...data,
        description: data.description || undefined,
        imageUrl: data.imageUrl || undefined,
        expirationDate: data.expirationDate || undefined,
        unitMeasurementsId: data.unitMeasurementsId ?? 0,
        categoryId: data.categoryId,
        clerkId: data.clerkId || "",
        buyPrice: parseFloat(data.buyPrice.toString()),
        sellPrice: parseFloat(data.sellPrice.toString()),
        stock: parseInt(data.stock.toString()),
        lowStockLevel: data.lowStockLevel
          ? parseInt(data.lowStockLevel.toString())
          : undefined,
      };

      if (mode === "create") {
        await createProduct(processedData);
      } else if (editingProduct) {
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(processedData),
        });
        if (!response.ok) throw new Error("Failed to update product");
        await refreshProducts();
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleRestockSubmit = async (data: {
    quantity: number;
    expirationDate?: string;
    notes?: string;
  }) => {
    if (!restockingProduct) return;

    try {
      const response = await fetch(
        `/api/products/${restockingProduct.id}/restock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Failed to restock product");

      setOpenRestockDialog(false);
      refreshProducts();
    } catch (error) {
      console.error("Error restocking product:", error);
    }
  };

  const handleExportRestock = async () => {
    try {
      const response = await fetch("/api/products/restock/export");
      if (!response.ok) throw new Error("Failed to export restock history");

      const data = await response.json();
      if (data.success) {
        console.log("Restock history exported successfully");
      }
    } catch (error) {
      console.error("Error exporting restock history:", error);
    }
  };

  const isExpired = (product: Product) => {
    if (!product.expirationDate) return false;
    const expirationDate = new Date(product.expirationDate);
    return expirationDate < new Date();
  };

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <ProductSummary products={products} />
      <div
        className={`${
          options.type === "inventory" ? "hidden" : ""
        } flex justify-between items-center`}
      >
        <Button
          variant="outline"
          onClick={handleExportRestock}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          Export Restock History
        </Button>
        <Button onClick={handleCreate}>Add Product</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Buy Price</TableHead>
              <TableHead>Sell Price</TableHead>
              <TableHead>Expiration Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.imageUrl ? (
                    <div className="relative w-12 h-12">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell>{product.code}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>PHP{product.buyPrice.toFixed(2)}</TableCell>
                <TableCell>PHP{product.sellPrice.toFixed(2)}</TableCell>
                <TableCell>
                  {product.expirationDate ? (
                    <span className={isExpired(product) ? "text-red-500" : ""}>
                      {format(new Date(product.expirationDate), "MMM dd, yyyy")}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  {isExpired(product) ? (
                    <span className="text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      Expired
                    </span>
                  ) : product.stock <= (product.lowStockLevel || 0) ? (
                    <span className="text-amber-500">Low Stock</span>
                  ) : (
                    <span className="text-green-500">In Stock</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRestock(product)}
                    >
                      <PackagePlus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductForm
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSubmit={handleSubmit}
        initialData={editingProduct}
        mode={mode}
      />

      <RestockForm
        open={openRestockDialog}
        onOpenChange={setOpenRestockDialog}
        onSubmit={handleRestockSubmit}
        product={restockingProduct}
      />
    </div>
  );
}
