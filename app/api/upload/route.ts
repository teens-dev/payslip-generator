// API Route: POST /api/upload
// Handles file uploads for company logo
// Supabase Integration:
// - Uploads file to Supabase Storage bucket 'company-logos'
// - Returns public URL for the uploaded file
// - Required environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiResponse, FileUploadResponse } from '@/types';
import { sanitizeFileName } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const companyId = formData.get('companyId') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Validate file type - only allow images
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only image files are allowed' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Validate file size - max 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 5MB limit' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Create unique file name
    const timestamp = Date.now();
    const fileName = `${companyId || 'company'}-${timestamp}-${sanitizeFileName(file.name)}`;
    const bucket = 'company-logos';

    // Convert file to buffer
    const buffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    // Bucket name: 'company-logos'
    // Path: company-logos/{fileName}
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase Storage Error:', error);
      return NextResponse.json(
        { success: false, error: 'File upload failed' } as ApiResponse<null>,
        { status: 500 }
      );
    }

    // Get public URL for the uploaded file
    const { data: publicUrlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(fileName);

    const response: FileUploadResponse = {
      url: publicUrlData.publicUrl,
      path: fileName,
      bucket,
    };

    return NextResponse.json(
      {
        success: true,
        data: response,
        message: 'File uploaded successfully',
      } as ApiResponse<FileUploadResponse>,
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
