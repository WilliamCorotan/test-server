import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/api/base";
import { updateProduct, deleteProduct } from "@/lib/api/products";

export async function PUT(request: Request, { params }: { params: any }) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const processedData = {
      ...body,
      description: body.description || undefined,
      imageUrl: body.image || undefined, // Map image URL to imageUrl field
      expirationDate: body.expirationDate || undefined,
      unitMeasurementsId:
        body.unitMeasurementsId === 0 ? undefined : body.unitMeasurementsId,
      categoryId: body.categoryId === 0 ? undefined : body.categoryId,
      buyPrice: parseFloat(body.buyPrice.toString()),
      sellPrice: parseFloat(body.sellPrice.toString()),
      stock: parseInt(body.stock.toString()),
      lowStockLevel: body.lowStockLevel
        ? parseInt(body.lowStockLevel.toString())
        : undefined,
      clerkId: userId,
    };

    const updatedProduct = await updateProduct(
      parseInt(params.id),
      processedData,
      userId
    );

    if (!updatedProduct.length) {
      return NextResponse.json(
        { error: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: any }) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await deleteProduct(parseInt(params.id), userId);

    if (!result) {
      return NextResponse.json(
        { error: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
