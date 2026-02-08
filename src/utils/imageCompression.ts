export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 2048,
    maxHeight = 2048,
    quality = 0.85,
    maxSizeKB = 1024,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let currentQuality = quality;
        let compressed = canvas.toDataURL('image/jpeg', currentQuality);

        const sizeKB = (compressed.length * 3) / 4 / 1024;

        if (sizeKB > maxSizeKB && currentQuality > 0.5) {
          currentQuality = Math.max(0.5, quality * (maxSizeKB / sizeKB));
          compressed = canvas.toDataURL('image/jpeg', currentQuality);
        }

        resolve(compressed);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

export async function compressImageToBlob(
  file: File,
  options: CompressionOptions = {}
): Promise<Blob> {
  const {
    maxWidth = 2048,
    maxHeight = 2048,
    quality = 0.85,
    maxSizeKB = 800,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = async () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let currentQuality = quality;
        let blob: Blob | null = null;

        const tryCompress = (q: number): Promise<Blob | null> => {
          return new Promise((res) => {
            canvas.toBlob(
              (b) => res(b),
              'image/jpeg',
              q
            );
          });
        };

        blob = await tryCompress(currentQuality);
        if (!blob) {
          reject(new Error('Failed to create blob'));
          return;
        }

        const maxSizeBytes = maxSizeKB * 1024;

        while (blob.size > maxSizeBytes && currentQuality > 0.3) {
          currentQuality = Math.max(0.3, currentQuality * 0.8);
          const newBlob = await tryCompress(currentQuality);
          if (!newBlob) break;
          blob = newBlob;
        }

        if (blob.size > maxSizeBytes * 1.5) {
          reject(new Error(`Image too large after compression (${Math.round(blob.size / 1024)}KB). Please use a smaller image.`));
          return;
        }

        resolve(blob);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}
