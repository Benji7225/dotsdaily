import { supabase } from './supabase';

export async function uploadImageToStorage(
  file: File,
  userId: string
): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('wallpaper-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Storage upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('wallpaper-images')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
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
