// lib/constants.ts

export const DEFAULT_IMAGE_PATH = '/placeholder-daylily.jpg'

// Handle potentially broken image URLs
export const getImageUrl = (url: string | undefined | null) => {
    if (!url) return DEFAULT_IMAGE_PATH

    // Check if URL is invalid or has common issues
    if (!url.startsWith('http') || url.includes('undefined') || url.includes('null')) {
        return DEFAULT_IMAGE_PATH
    }

    return url
}