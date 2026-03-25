import { MOCK_MEDIA_DATA } from '@/constants/mockData';
import type { MediaItem, User } from '@/types';

// Mock API service using localStorage
const STORAGE_KEY = 'mediaLibrary';
const AUTH_KEY = 'currentUser';

// Initialize localStorage with mock data if empty
const initializeStorage = (): void => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_MEDIA_DATA));
  }
};

// Authentication API
export const authApi = {
  login: async (username: string, password: string): Promise<User> => {
    // Mock authentication - accept admin/admin123
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (username === 'admin' && password === 'admin123') {
      const user: User = {
        id: '1',
        username: 'admin',
        role: 'admin',
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return user;
    }
    
    throw new Error('Invalid credentials');
  },
  
  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    localStorage.removeItem(AUTH_KEY);
  },
  
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(AUTH_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Media API
export const mediaApi = {
  // Get all media items
  getAll: async (): Promise<MediaItem[]> => {
    initializeStorage();
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const dataStr = localStorage.getItem(STORAGE_KEY);
    return dataStr ? JSON.parse(dataStr) : [];
  },
  
  // Get single media item by ID
  getById: async (id: string): Promise<MediaItem | null> => {
    const items = await mediaApi.getAll();
    return items.find(item => item.id === id) || null;
  },
  
  // Create new media item
  create: async (data: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MediaItem> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const items = await mediaApi.getAll();
    const newItem: MediaItem = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    items.push(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return newItem;
  },
  
  // Update existing media item
  update: async (id: string, data: Partial<MediaItem>): Promise<MediaItem> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const items = await mediaApi.getAll();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error('Media item not found');
    }
    
    const updatedItem: MediaItem = {
      ...items[index],
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };
    
    items[index] = updatedItem;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return updatedItem;
  },
  
  // Delete media item
  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const items = await mediaApi.getAll();
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
};
