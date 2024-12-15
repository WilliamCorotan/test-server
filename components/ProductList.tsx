import { useProducts } from "@/hooks/use-products";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function ProductList() {
    const { products, loading, error } = useProducts();

    if (loading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Buy Price</TableHead>
                        <TableHead>Sell Price</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.code}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>
                                ${product.buyPrice.toFixed(2)}
                            </TableCell>
                            <TableCell>
                                ${product.sellPrice.toFixed(2)}
                            </TableCell>
                            <TableCell>
                                {product.stock <=
                                (product.lowStockLevel || 0) ? (
                                    <span className="text-red-500">
                                        Low Stock
                                    </span>
                                ) : (
                                    <span className="text-green-500">
                                        In Stock
                                    </span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
