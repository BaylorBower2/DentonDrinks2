import { supabase } from '../supabase/config';
import { SupabaseError } from '../supabase/error-handler';
import { withRetry } from '../supabase/retry';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const BUCKET_NAME = 'review-images';

export interface ImageUploadResult {
  url: string;
  path: string;
}

export async function uploadReviewImage(
  file: File,
  venueId: string
): Promise<ImageUploadResult> {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Image file size must be less than 5MB');
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image');
    }

    // Generate unique filename
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${timestamp}-${random}.${fileExt}`;
    const filePath = `reviews/${venueId}/${fileName}`;

    // Convert File to ArrayBuffer for more reliable upload
    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);

    // Upload with retry logic
    const { error: uploadError } = await withRetry(
      async () => supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, fileData, {
          contentType: file.type,
          cacheControl: '31536000', // 1 year cache
          upsert: false
        }),
      { maxAttempts: 3, initialDelay: 1000 }
    );

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    if (!publicUrl) {
      throw new Error('Failed to get public URL for uploaded image');
    }

    return {
      url: publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Error uploading review image:', error);
    throw new SupabaseError(
      error instanceof Error ? error.message : 'Failed to upload image',
      error
    );
  }
}