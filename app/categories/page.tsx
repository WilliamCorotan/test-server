"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TableLoading } from "@/components/ui/table-loading";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { CategoryViewDialog } from "@/components/categories/CategoryViewDialog";
import { useCategories } from "@/hooks/use-categories";
import { Category } from "@/types";
import { Pencil, Trash2, Eye } from "lucide-react";

export default function CategoriesPage() {
    const { userId } = useAuth();
    const { categories, loading, error, refreshCategories } = useCategories();
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );
    const [viewingCategory, setViewingCategory] = useState<Category | null>(
        null
    );
    const [isActionLoading, setIsActionLoading] = useState(false);

    const handleCreate = () => {
        setEditingCategory(null);
        setOpenDialog(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setOpenDialog(true);
    };

    const handleView = (category: Category) => {
        setViewingCategory(category);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this category?")) {
            try {
                setIsActionLoading(true);
                const response = await fetch(`/api/categories/${id}`, {
                    method: "DELETE",
                });
                if (!response.ok) throw new Error("Failed to delete category");
                refreshCategories();
            } catch (error) {
                console.error("Error deleting category:", error);
            } finally {
                setIsActionLoading(false);
            }
        }
    };

    if (!userId) {
        return <div>Please sign in to view categories</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Button onClick={handleCreate} disabled={isActionLoading}>
                    Add Category
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading || isActionLoading ? (
                            <TableLoading columns={3} />
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={3}
                                    className="text-center py-4"
                                >
                                    No categories found
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>
                                        {category.description}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleView(category)
                                                }
                                                disabled={isActionLoading}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleEdit(category)
                                                }
                                                disabled={isActionLoading}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(category.id)
                                                }
                                                disabled={isActionLoading}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <CategoryForm
                open={openDialog}
                onOpenChange={setOpenDialog}
                onSubmit={async (data) => {
                    try {
                        setIsActionLoading(true);
                        const url = editingCategory
                            ? `/api/categories/${editingCategory.id}`
                            : "/api/categories";
                        const method = editingCategory ? "PUT" : "POST";

                        const response = await fetch(url, {
                            method,
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(data),
                        });
                        if (!response.ok)
                            throw new Error("Failed to save category");
                        setOpenDialog(false);
                        refreshCategories();
                    } catch (error) {
                        console.error("Error saving category:", error);
                    } finally {
                        setIsActionLoading(false);
                    }
                }}
                initialData={editingCategory}
                mode={editingCategory ? "edit" : "create"}
                isLoading={isActionLoading}
            />

            {viewingCategory && (
                <CategoryViewDialog
                    open={!!viewingCategory}
                    onOpenChange={(open) => !open && setViewingCategory(null)}
                    category={viewingCategory}
                />
            )}
        </div>
    );
}
