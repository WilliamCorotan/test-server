import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, DonutChart } from "@tremor/react";
import { Product } from "@/types";
import { useMemo } from "react";

interface ProductStatsProps {
    products: Product[];
}

export function ProductStats({ products }: ProductStatsProps) {
    // Calculate category distribution
    const categoryData = useMemo(() => {
        const categoryCount: { [key: string]: number } = {};
        products.forEach((product) => {
            const category = product.categoryId ? `Category ${product.categoryId}` : "Uncategorized";
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });

        return Object.entries(categoryCount).map(([name, value]) => ({
            name,
            value,
        }));
    }, [products]);

    // Calculate stock level distribution
    const stockData = useMemo(() => {
        const stockLevels = products.map((product) => ({
            name: product.name,
            "Current Stock": product.stock,
            "Low Stock Level": product.lowStockLevel || 0,
        }));

        return stockLevels.sort((a, b) => b["Current Stock"] - a["Current Stock"]).slice(0, 10);
    }, [products]);

    // Calculate stock status distribution
    const stockStatusData = useMemo(() => {
        const inStock = products.filter(
            (product) => product.stock > (product.lowStockLevel || 0)
        ).length;
        const lowStock = products.filter(
            (product) => product.stock <= (product.lowStockLevel || 0) && product.stock > 0
        ).length;
        const outOfStock = products.filter((product) => product.stock === 0).length;

        return [
            { name: "In Stock", value: inStock },
            { name: "Low Stock", value: lowStock },
            { name: "Out of Stock", value: outOfStock },
        ];
    }, [products]);

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Top 10 Products by Stock Level</CardTitle>
                </CardHeader>
                <CardContent>
                    <BarChart
                        data={stockData}
                        index="name"
                        categories={["Current Stock", "Low Stock Level"]}
                        colors={["blue", "amber"]}
                        yAxisWidth={48}
                        showAnimation
                        showTooltip
                        className="h-72 [&_.tremor-Tooltip-root]:bg-white [&_.tremor-Tooltip-root]:dark:bg-gray-800 [&_.tremor-Tooltip-root]:border [&_.tremor-Tooltip-root]:border-gray-200 [&_.tremor-Tooltip-root]:dark:border-gray-700 [&_.tremor-Tooltip-root]:rounded-lg [&_.tremor-Tooltip-root]:shadow-lg [&_.tremor-Tooltip-root]:p-2"
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Stock Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <DonutChart
                        data={stockStatusData}
                        category="value"
                        index="name"
                        colors={["green", "amber", "red"]}
                        showAnimation
                        showTooltip
                        className="h-72 [&_.tremor-Tooltip-root]:bg-white [&_.tremor-Tooltip-root]:dark:bg-gray-800 [&_.tremor-Tooltip-root]:border [&_.tremor-Tooltip-root]:border-gray-200 [&_.tremor-Tooltip-root]:dark:border-gray-700 [&_.tremor-Tooltip-root]:rounded-lg [&_.tremor-Tooltip-root]:shadow-lg [&_.tremor-Tooltip-root]:p-2"
                    />
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Product Distribution by Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <BarChart
                        data={categoryData}
                        index="name"
                        categories={["value"]}
                        colors={["blue"]}
                        yAxisWidth={48}
                        showAnimation
                        showTooltip
                        className="h-72 [&_.tremor-Tooltip-root]:bg-white [&_.tremor-Tooltip-root]:dark:bg-gray-800 [&_.tremor-Tooltip-root]:border [&_.tremor-Tooltip-root]:border-gray-200 [&_.tremor-Tooltip-root]:dark:border-gray-700 [&_.tremor-Tooltip-root]:rounded-lg [&_.tremor-Tooltip-root]:shadow-lg [&_.tremor-Tooltip-root]:p-2"
                    />
                </CardContent>
            </Card>
        </div>
    );
} 