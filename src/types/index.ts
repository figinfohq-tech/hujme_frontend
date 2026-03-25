export type MediaType = 'video' | 'image';

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface MediaFilters {
  type?: MediaType;
  category?: string;
  tags?: string[];
  search?: string;
}
