// URL validation utility
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// Form validation for media items
export const validateMediaForm = (data: {
  title: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl: string;
  category: string;
}): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!data.title.trim()) {
    errors.title = 'Title is required';
  }
  
  if (!data.description.trim()) {
    errors.description = 'Description is required';
  }
  
  if (!data.mediaUrl.trim()) {
    errors.mediaUrl = 'Media URL is required';
  } else if (!isValidUrl(data.mediaUrl)) {
    errors.mediaUrl = 'Invalid URL format';
  }
  
  if (!data.thumbnailUrl.trim()) {
    errors.thumbnailUrl = 'Thumbnail URL is required';
  } else if (!isValidUrl(data.thumbnailUrl)) {
    errors.thumbnailUrl = 'Invalid URL format';
  }
  
  if (!data.category.trim()) {
    errors.category = 'Category is required';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
