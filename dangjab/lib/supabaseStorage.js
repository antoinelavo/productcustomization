// /lib/supabaseStorage.js
import { supabase } from '@/lib/supabase';

/**
 * Upload image to Supabase Storage and return public URL
 * @param {File} file - The image file to upload
 * @param {string} bucket - Storage bucket name (default: 'user-uploads')
 * @param {string} folder - Folder path within bucket (default: 'customizations')
 * @returns {Promise<{url: string | null, error: string | null}>}
 */
export async function uploadImageToStorage(file, bucket = 'user-uploads', folder = 'customizations') {
  try {
    // Validate file
    if (!file) {
      return { url: null, error: 'No file provided' };
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return { url: null, error: 'File must be an image' };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return { url: null, error: 'File size must be less than 5MB' };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${timestamp}-${randomId}.${fileExtension}`;
    
    // Full path within storage
    const filePath = `${folder}/${fileName}`;

    console.log('📤 Uploading file to Supabase Storage:', filePath);

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600', // Cache for 1 hour
        upsert: false // Don't overwrite existing files
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      return { url: null, error: `Upload failed: ${uploadError.message}` };
    }

    console.log('✅ File uploaded successfully:', uploadData.path);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!publicUrl) {
      return { url: null, error: 'Failed to get public URL' };
    }

    console.log('🔗 Public URL generated:', publicUrl);

    return { url: publicUrl, error: null };

  } catch (error) {
    console.error('❌ Storage upload error:', error);
    return { url: null, error: `Unexpected error: ${error.message}` };
  }
}

/**
 * Delete image from Supabase Storage
 * @param {string} imageUrl - The public URL of the image to delete
 * @param {string} bucket - Storage bucket name (default: 'user-uploads')
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export async function deleteImageFromStorage(imageUrl, bucket = 'user-uploads') {
  try {
    if (!imageUrl) {
      return { success: false, error: 'No image URL provided' };
    }

    // Extract file path from public URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlParts = imageUrl.split('/storage/v1/object/public/');
    if (urlParts.length !== 2) {
      return { success: false, error: 'Invalid Supabase Storage URL format' };
    }

    const pathWithBucket = urlParts[1];
    const filePath = pathWithBucket.substring(pathWithBucket.indexOf('/') + 1);

    console.log('🗑️ Deleting file from storage:', filePath);

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('❌ Delete error:', error);
      return { success: false, error: `Delete failed: ${error.message}` };
    }

    console.log('✅ File deleted successfully');
    return { success: true, error: null };

  } catch (error) {
    console.error('❌ Storage delete error:', error);
    return { success: false, error: `Unexpected error: ${error.message}` };
  }
}

/**
 * Generate a signed URL for temporary access (useful for private buckets)
 * @param {string} filePath - Path to file in storage
 * @param {number} expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
 * @param {string} bucket - Storage bucket name (default: 'user-uploads')
 * @returns {Promise<{url: string | null, error: string | null}>}
 */
export async function getSignedUrl(filePath, expiresIn = 3600, bucket = 'user-uploads') {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      return { url: null, error: error.message };
    }

    return { url: data.signedUrl, error: null };
  } catch (error) {
    return { url: null, error: error.message };
  }
}