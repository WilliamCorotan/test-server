import { useEffect, useState, useRef } from "react";
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
import { ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";

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
};

export function ProductForm({
    open,
    onOpenChange,
    onSubmit,
    initialData,
    mode,
}: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>(defaultFormData);
    const { categories } = useCategories();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                code: initialData.code,
                description: initialData.description || "",
                imageUrl: initialData.imageUrl || "",
                buyPrice: initialData.buyPrice,
                sellPrice: initialData.sellPrice,
                stock: initialData.stock,
                lowStockLevel: initialData.lowStockLevel || 0,
                expirationDate: initialData.expirationDate || "",
                categoryId: initialData.categoryId || 0,
            });
            
            if (initialData.imageUrl) {
                setImagePreview(initialData.imageUrl);
            } else {
                setImagePreview(null);
            }
        } else {
            setFormData(defaultFormData);
            setImagePreview(null);
        }
        setUploadError(null);
    }, [initialData, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setUploadError(null);

        // Create a preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload the file
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            console.log("Uploading file:", file.name, file.type, file.size);
            
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to upload image");
            }

            console.log("Upload successful:", data);
            
            setFormData(prev => ({
                ...prev,
                imageUrl: data.url
            }));
        } catch (error: any) {
            console.error("Error uploading image:", error);
            setUploadError(error.message || "Failed to upload image. Please try again.");
            // Don't clear the preview as we still want to show what the user selected
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setFormData(prev => ({
            ...prev,
            imageUrl: undefined
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setUploadError(null);
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
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="image" className="text-right pt-2">
                                Image
                            </Label>
                            <div className="col-span-3 space-y-2">
                                {imagePreview ? (
                                    <div className="relative w-full h-40 border rounded-md overflow-hidden">
                                        <Image 
                                            src={imagePreview}
                                            alt="Product preview"
                                            fill
                                            className="object-contain"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6"
                                            onClick={handleRemoveImage}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                        <ImageIcon className="h-8 w-8" />
                                        <p className="text-sm">No image selected</p>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Input
                                        ref={fileInputRef}
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="flex-1"
                                        disabled={isUploading}
                                    />
                                    {isUploading && (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    )}
                                </div>
                                {uploadError && (
                                    <p className="text-xs text-red-500">{uploadError}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Supported formats: JPEG, PNG, WebP, GIF. Max size: 5MB.
                                </p>
                            </div>
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
                            <Label
                                htmlFor="lowStockLevel"
                                className="text-right"
                            >
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
                            <Label
                                htmlFor="expirationDate"
                                className="text-right"
                            >
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
                        <Button type="submit" disabled={isUploading}>
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : mode === "create" ? (
                                "Create"
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}