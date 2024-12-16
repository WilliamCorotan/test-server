import { useState } from "react";
import { useUnitMeasurements } from "@/hooks/use-unit-measurements";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { UnitMeasurementForm } from "./UnitMeasurementForm";
import { UnitMeasurement } from "@/types";

export function UnitMeasurementList() {
    const { unitMeasurements, loading, error, deleteUnitMeasurement } =
        useUnitMeasurements();
    const [editingMeasurement, setEditingMeasurement] =
        useState<UnitMeasurement | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this unit measurement?")) {
            try {
                await deleteUnitMeasurement(id);
            } catch (error) {
                console.error("Error deleting unit measurement:", error);
            }
        }
    };

    const handleEdit = (measurement: UnitMeasurement) => {
        setEditingMeasurement(measurement);
        setOpenEditDialog(true);
    };

    if (loading) return <div>Loading unit measurements...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            {unitMeasurements.map((measurement) => (
                <TableRow key={measurement.id}>
                    <TableCell>{measurement.name}</TableCell>
                    <TableCell>{measurement.description}</TableCell>
                    <TableCell>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(measurement)}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(measurement.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
            ))}

            {editingMeasurement && (
                <UnitMeasurementForm
                    open={openEditDialog}
                    onOpenChange={setOpenEditDialog}
                    onSubmit={async (data) => {
                        try {
                            const response = await fetch(
                                `/api/settings/unit-measurements/${editingMeasurement.id}`,
                                {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(data),
                                }
                            );
                            if (!response.ok)
                                throw new Error(
                                    "Failed to update unit measurement"
                                );
                            setOpenEditDialog(false);
                            setEditingMeasurement(null);
                        } catch (error) {
                            console.error(
                                "Error updating unit measurement:",
                                error
                            );
                        }
                    }}
                    mode="edit"
                    initialData={editingMeasurement}
                />
            )}
        </>
    );
}
