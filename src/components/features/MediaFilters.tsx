import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES, ALL_TAGS } from '@/constants/mockData';
import type { MediaType } from '@/types';

interface MediaFiltersProps {
  type: MediaType | 'all';
  category: string;
  tags: string[];
  search: string;
  onTypeChange: (type: MediaType | 'all') => void;
  onCategoryChange: (category: string) => void;
  onTagsChange: (tags: string[]) => void;
  onSearchChange: (search: string) => void;
}

export const MediaFilters = ({
  type,
  category,
  tags,
  search,
  onTypeChange,
  onCategoryChange,
  onTagsChange,
  onSearchChange,
}: MediaFiltersProps) => {
  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      onTagsChange(tags.filter(t => t !== tag));
    } else {
      onTagsChange([...tags, tag]);
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6 mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="search" className="mb-2 block">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="type" className="mb-2 block">Media Type</Label>
          <Select value={type} onValueChange={(val) => onTypeChange(val as MediaType | 'all')}>
            <SelectTrigger id="type" className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="image">Images</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="category" className="mb-2 block">Category</Label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger id="category" className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Filter by Tags</Label>
        <div className="flex gap-2 flex-wrap">
          {ALL_TAGS.map(tag => (
            <Badge
              key={tag}
              variant={tags.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
