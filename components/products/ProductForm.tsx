import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product, ProductFormData } from "@/types";
import { useCategories } from "@/hooks/use-categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { X } from "lucide-react";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProductFormData) => void;
  initialData?: Product | null;
  mode: "create" | "edit";
}

const defaultFormData: ProductFormData = {
  name: "",
  code: "",
  description: "",
  buyPrice: 0,
  sellPrice: 0,
  stock: 0,
  lowStockLevel: 0,
  expirationDate: "",
  categoryId: 0,
  image: "",
};

export function ProductForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);
  const [uploading, setUploading] = useState(false);
  const { categories } = useCategories();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        code: initialData.code,
        description: initialData.description || "",
        buyPrice: initialData.buyPrice,
        sellPrice: initialData.sellPrice,
        stock: initialData.stock,
        lowStockLevel: initialData.lowStockLevel || 0,
        expirationDate: initialData.expirationDate || "",
        categoryId: initialData.categoryId || 0,
        image: initialData.image || "",
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const blob = await response.json();
      setFormData((prev) => ({ ...prev, image: blob.url }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Add Product" : "Edit Product"}
            </DialogTitle>
            <DialogDescription>
              Fill in the product details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {formData.image && (
              <div className="relative w-full aspect-video">
                <Image
                  src={formData.image}
                  alt="Product image"
                  fill
                  className="object-contain rounded-md"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value,
                  })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.categoryId?.toString()}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      categoryId: parseInt(value),
                    })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="buyPrice" className="text-right">
                Buy Price
              </Label>
              <Input
                id="buyPrice"
                type="number"
                step="0.01"
                value={formData.buyPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    buyPrice: parseFloat(e.target.value),
                  })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sellPrice" className="text-right">
                Sell Price
              </Label>
              <Input
                id="sellPrice"
                type="number"
                step="0.01"
                value={formData.sellPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sellPrice: parseFloat(e.target.value),
                  })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: parseInt(e.target.value),
                  })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lowStockLevel" className="text-right">
                Low Stock Level
              </Label>
              <Input
                id="lowStockLevel"
                type="number"
                value={formData.lowStockLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lowStockLevel: parseInt(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expirationDate" className="text-right">
                Expiration Date
              </Label>
              <Input
                id="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expirationDate: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={uploading}>
              {mode === "create" ? "Create" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
