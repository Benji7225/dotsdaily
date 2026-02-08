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
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    maxSizeKB = 800,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const timeout = setTimeout(() => {
      reject(new Error('Image processing timeout'));
    }, 30000);

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        clearTimeout(timeout);
        try {
          let { width, height } = img;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d', { alpha: false });
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          let currentQuality = quality;
          let compressed = canvas.toDataURL('image/jpeg', currentQuality);

          const sizeKB = (compressed.length * 3) / 4 / 1024;

          if (sizeKB > maxSizeKB && currentQuality > 0.4) {
            currentQuality = Math.max(0.4, quality * (maxSizeKB / sizeKB) * 0.9);
            compressed = canvas.toDataURL('image/jpeg', currentQuality);
          }

          resolve(compressed);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      clearTimeout(timeout);
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
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    maxSizeKB = 800,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const timeout = setTimeout(() => {
      reject(new Error('Image processing timeout'));
    }, 30000);

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        clearTimeout(timeout);
        try {
          let { width, height } = img;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d', { alpha: false });
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const processBlob = (currentQuality: number) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Failed to create blob'));
                  return;
                }

                const sizeKB = blob.size / 1024;
                if (sizeKB > maxSizeKB && currentQuality > 0.4) {
                  const newQuality = Math.max(0.4, currentQuality * (maxSizeKB / sizeKB) * 0.9);
                  processBlob(newQuality);
                } else {
                  resolve(blob);
                }
              },
              'image/png',
              currentQuality
            );
          };

          processBlob(quality);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}
