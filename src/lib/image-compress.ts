/**
 * Image Compression Utility
 * Compresses images to under 1MB for faster upload and analysis
 */

export interface ImageCompressionOptions {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    quality?: number;
}

const DEFAULT_OPTIONS: ImageCompressionOptions = {
    maxSizeMB: 4, // Increased from 1MB to capture more detail
    maxWidthOrHeight: 2048, // Optimized for GPT-4 Vision (high detail mode)
    quality: 0.9, // Higher quality for better texture recognition
};

/**
 * Compress an image file
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Compressed file
 */
export async function compressImage(
    file: File,
    options: ImageCompressionOptions = {}
): Promise<File> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    // If file is already small enough, return as-is
    if (file.size <= (opts.maxSizeMB! * 1024 * 1024)) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                // Scale down if needed
                if (width > opts.maxWidthOrHeight! || height > opts.maxWidthOrHeight!) {
                    const ratio = Math.min(
                        opts.maxWidthOrHeight! / width,
                        opts.maxWidthOrHeight! / height
                    );
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob with quality
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Failed to compress image'));
                            return;
                        }

                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });

                        resolve(compressedFile);
                    },
                    'image/jpeg',
                    opts.quality
                );
            };

            img.onerror = () => reject(new Error('Failed to load image'));
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
    });
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
