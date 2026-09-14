import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdminSession } from '@/lib/auth';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: NextRequest) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;

    const allFiles: File[] = [];
    if (singleFile) {
      allFiles.push(singleFile);
    }
    if (files && files.length > 0) {
      for (const f of files) {
        if (f && typeof f === 'object' && 'arrayBuffer' in f) {
          allFiles.push(f);
        }
      }
    }

    if (allFiles.length === 0) {
      return NextResponse.json(
        { error: 'Файлы для загрузки не предоставлены' },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of allFiles) {
      // Create safe unique filename
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const originalExt = path.extname(file.name) || '.webp';
      const cleanExt = originalExt.startsWith('.') ? originalExt : `.${originalExt}`;
      
      const rawBase = path.basename(file.name, originalExt)
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 30);
      
      const safeBase = rawBase || 'image';
      const filename = `${safeBase}-${timestamp}-${randomSuffix}${cleanExt}`;
      const filePath = path.join(uploadsDir, filename);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      const publicUrl = `/uploads/${filename}`;
      uploadedUrls.push(publicUrl);
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0] || '',
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error?.message || 'Ошибка загрузки файла на сервер' },
      { status: 500 }
    );
  }
}
