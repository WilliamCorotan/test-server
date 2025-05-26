import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, BarChart } from "@tremor/react";
import { Product } from "@/types";
import { useMemo } from "react";

interface InventoryStatsProps {
    products: Product[];
}

export function InventoryStats({ products }: InventoryStatsProps) {
    // Calculate stock value distribution
    const stockValueData = useMemo(() => {
        const stockValues = products.map((product) => ({
            name: product.name,
            "Stock Value": product.stock * product.buyPrice,
            "Potential Revenue": product.stock * product.sellPrice,
        }));

        return stockValues
            .sort((a, b) => b["Stock Value"] - a["Stock Value"])
            .slice(0, 10);
    }, [products]);

    // Calculate expiration distribution
    const expirationData = useMemo(() => {
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);

        const expired = products.filter(
            (product) =>
                product.expirationDate &&
                new Date(product.expirationDate) < now
        ).length;

        const expiringSoon = products.filter(
            (product) =>
                product.expirationDate &&
                new Date(product.expirationDate) >= now &&
                new Date(product.expirationDate) <= thirtyDaysFromNow
        ).length;

        const valid = products.filter(
            (product) =>
                !product.expirationDate ||
                new Date(product.expirationDate) > thirtyDaysFromNow
        ).length;

        return [
            { name: "Expired", value: expired },
            { name: "Expiring Soon", value: expiringSoon },
            { name: "Valid", value: valid },
        ];
    }, [products]);

    // Calculate monthly stock value trend
    const monthlyStockValueData = useMemo(() => {
        const monthlyData: { [key: string]: number } = {};
        products.forEach((product) => {
            if (product.expirationDate) {
                const date = new Date(product.expirationDate);
                const monthYear = `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}`;
                monthlyData[monthYear] =
                    (monthlyData[monthYear] || 0) +
                    product.stock * product.buyPrice;
            }
        });

        return Object.entries(monthlyData)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, value]) => ({
                date,
                "Stock Value": value,
            }));
    }, [products]);

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Top 10 Products by Stock Value</CardTitle>
                </CardHeader>
                <CardContent>
                    <BarChart
                        data={stockValueData}
                        index="name"
                        categories={["Stock Value", "Potential Revenue"]}
                        colors={["blue", "green"]}
                        yAxisWidth={60}
                        showAnimation
                        showTooltip
                        className="h-72 [&_.tremor-Tooltip-root]:bg-white [&_.tremor-Tooltip-root]:dark:bg-gray-800 [&_.tremor-Tooltip-root]:border [&_.tremor-Tooltip-root]:border-gray-200 [&_.tremor-Tooltip-root]:dark:border-gray-700 [&_.tremor-Tooltip-root]:rounded-lg [&_.tremor-Tooltip-root]:shadow-lg [&_.tremor-Tooltip-root]:p-2"
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Expiration Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <BarChart
                        data={expirationData}
                        index="name"
                        categories={["value"]}
                        colors={["red", "amber", "green"]}
                        yAxisWidth={48}
                        showAnimation
                        showTooltip
                        className="h-72 [&_.tremor-Tooltip-root]:bg-white [&_.tremor-Tooltip-root]:dark:bg-gray-800 [&_.tremor-Tooltip-root]:border [&_.tremor-Tooltip-root]:border-gray-200 [&_.tremor-Tooltip-root]:dark:border-gray-700 [&_.tremor-Tooltip-root]:rounded-lg [&_.tremor-Tooltip-root]:shadow-lg [&_.tremor-Tooltip-root]:p-2"
                    />
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Monthly Stock Value Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <AreaChart
                        data={monthlyStockValueData}
                        index="date"
                        categories={["Stock Value"]}
                        colors={["blue"]}
                        yAxisWidth={60}
                        showAnimation
                        showTooltip
                        className="h-72 [&_.tremor-Tooltip-root]:bg-white [&_.tremor-Tooltip-root]:dark:bg-gray-800 [&_.tremor-Tooltip-root]:border [&_.tremor-Tooltip-root]:border-gray-200 [&_.tremor-Tooltip-root]:dark:border-gray-700 [&_.tremor-Tooltip-root]:rounded-lg [&_.tremor-Tooltip-root]:shadow-lg [&_.tremor-Tooltip-root]:p-2"
                    />
                </CardContent>
            </Card>
        </div>
    );
} 