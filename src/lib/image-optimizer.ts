/**
 * Utility to convert and optimize images to WebP format on the client side.
 * Converts JPG, PNG, HEIC, AVIF, BMP, etc. to lightweight .webp format
 * with high quality and intelligent dimension scaling.
 */

export interface CompressionResult {
  file: File;
  blob: Blob;
  originalSize: number;
  newSize: number;
  savedPercent: number;
  previewUrl: string;
  width: number;
  height: number;
}

export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0, default 0.85
  targetFormat?: 'image/webp' | 'image/jpeg';
}

/**
 * Convert any image file to an optimized WebP format
 */
export async function convertImageToWebP(
  file: File,
  options: OptimizeOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 2048,
    maxHeight = 2048,
    quality = 0.85,
    targetFormat = 'image/webp',
  } = options;

  return new Promise((resolve, reject) => {
    // 1. Create FileReader to read file
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          // Scale down proportionally if larger than maximum bounds
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d', { alpha: true });
          if (!ctx) {
            reject(new Error('Не удалось инициализировать 2D Canvas context'));
            return;
          }

          // Image smoothing for high quality bicubic downscaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw image
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP Blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Ошибка генерации WebP изображения'));
                return;
              }

              // Create new sanitized webp file name
              const originalBaseName = file.name
                .replace(/\.[^/.]+$/, '')
                .replace(/[^a-zA-Z0-9_\-\u0400-\u04FF]/g, '_');
              const newFileName = `${originalBaseName || 'image'}.webp`;

              const webpFile = new File([blob], newFileName, {
                type: targetFormat,
                lastModified: Date.now(),
              });

              const originalSize = file.size;
              const newSize = blob.size;
              const savedPercent =
                originalSize > 0
                  ? Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100))
                  : 0;

              const previewUrl = URL.createObjectURL(blob);

              resolve({
                file: webpFile,
                blob,
                originalSize,
                newSize,
                savedPercent,
                previewUrl,
                width,
                height,
              });
            },
            targetFormat,
            quality
          );
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        reject(new Error('Не удалось прочитать файл изображения.'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Ошибка чтения исходного файла'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes to readable human string (KB / MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
