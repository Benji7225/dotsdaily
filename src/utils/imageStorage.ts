import { supabase } from './supabase';

export async function uploadImageToStorage(
  file: File,
  userId: string
): Promise<string> {
  const maxRetries = 2;
  const fileExt = 'png';
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const uploadPromise = supabase.storage
        .from('wallpaper-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/png',
        });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Upload timeout')), 25000)
      );

      const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);

      if (error) {
        if (attempt < maxRetries && (error.message.includes('timeout') || error.message.includes('timed out'))) {
          console.warn(`Upload attempt ${attempt + 1} failed, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        console.error('Storage upload error:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('wallpaper-images')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (err) {
      if (attempt < maxRetries && err instanceof Error && err.message.includes('timeout')) {
        console.warn(`Upload attempt ${attempt + 1} timed out, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      throw err;
    }
  }

  throw new Error('Failed to upload image after multiple attempts');
}

export async function deleteImageFromStorage(imageUrl: string): Promise<void> {
  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/wallpaper-images/');
    if (pathParts.length < 2) return;

    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from('wallpaper-images')
      .remove([filePath]);

    if (error) {
      console.error('Storage delete error:', error);
    }
  } catch (e) {
    console.error('Failed to parse image URL for deletion:', e);
  }
}

export async function uploadBase64ImageToStorage(
  base64Data: string,
  userId: string
): Promise<string> {
  const base64Match = base64Data.match(/^data:image\/(.*?);base64,(.*)$/);
  if (!base64Match) {
    throw new Error('Invalid base64 image data');
  }

  const [, mimeType, base64String] = base64Match;
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: `image/${mimeType}` });
  const file = new File([blob], `image.${mimeType}`, { type: `image/${mimeType}` });

  return uploadImageToStorage(file, userId);
}
