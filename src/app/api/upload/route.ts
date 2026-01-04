import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const filename = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public/images');
    const filepath = path.join(uploadDir, filename);

    try {
        await writeFile(filepath, buffer);
        return NextResponse.json({ success: true, url: `/images/${filename}` });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
    }
}
