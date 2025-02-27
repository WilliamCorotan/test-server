import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/api/base";
import { v4 as uuidv4 } from "uuid";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
        },
        { status: 400 }
      );
    }

    // Check file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Create a unique filename
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `${uuidv4()}.${fileExtension}`;

    // Create directory if it doesn't exist
    const publicDir = path.join(process.cwd(), "public");
    const uploadDir = path.join(publicDir, "uploads");

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error("Error creating directory:", err);
    }

    // Save the file
    const filePath = path.join(uploadDir, fileName);

    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      console.log(`File saved to ${filePath}`);
    } catch (err) {
      console.error("Error writing file:", err);
      return NextResponse.json(
        { error: `Failed to write file [0]` },
        { status: 500 }
      );
    }

    // Return the file URL
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: `Failed to upload file [1]` },
      { status: 500 }
    );
  }
}
