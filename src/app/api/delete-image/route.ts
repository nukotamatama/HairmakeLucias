import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 });
        }

        // Ensure the URL is a local, relative path starting with /images/
        // We do strictly allow only deleting files in public/images to prevent arbitrary file deletion
        if (!url.startsWith("/images/")) {
            // If it's a full URL (http...), allow if it matches current host? 
            // Simplest is to only accept the relative path stored in JSON
            return NextResponse.json({ success: false, error: "Invalid path. Must start with /images/" }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), "public", url);

        // Security check: ensure resolved path is still within public/images
        const imagesDir = path.join(process.cwd(), "public", "images");
        if (!filePath.startsWith(imagesDir)) {
            return NextResponse.json({ success: false, error: "Invalid path traversal" }, { status: 403 });
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return NextResponse.json({ success: true, message: "File deleted" });
        } else {
            // If file doesn't exist, we can treat it as success (it's gone) or warn
            return NextResponse.json({ success: true, message: "File not found, but treated as deleted" });
        }

    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
