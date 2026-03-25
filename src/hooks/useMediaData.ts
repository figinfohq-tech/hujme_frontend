import { useState, useEffect } from 'react';
import type { MediaFilters, MediaItem } from '@/types';
import { mediaApi } from '@/lib/api';

export const useMediaData = (filters?: MediaFilters) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mediaApi.getAll();
      
      // Apply filters
      let filtered = data;
      
      if (filters?.type) {
        filtered = filtered.filter(item => item.type === filters.type);
      }
      
      if (filters?.category) {
        filtered = filtered.filter(item => item.category === filters.category);
      }
      
      if (filters?.tags && filters.tags.length > 0) {
        filtered = filtered.filter(item =>
          filters.tags!.some(tag => item.tags.includes(tag))
        );
      }
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(item =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
        );
      }
      
      setMedia(filtered);
    } catch (err) {
      setError('Failed to load media');
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [filters?.type, filters?.category, filters?.tags, filters?.search]);

  return { media, loading, error, refetch: fetchMedia };
};
