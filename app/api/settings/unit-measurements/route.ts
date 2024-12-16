import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUnitMeasurements, createUnitMeasurement } from "@/lib/api/settings";

export async function GET() {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const measurements = await getUnitMeasurements(userId);
        return NextResponse.json(measurements);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Failed to fetch unit measurements" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const newMeasurement = await createUnitMeasurement(body, userId);
        return NextResponse.json(newMeasurement);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Failed to create unit measurement" },
            { status: 500 }
        );
    }
}
