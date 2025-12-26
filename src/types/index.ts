export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  views: number;
  uploadDate: string;
  category: string;
  tags: string[];
  quality: VideoQuality[];
  downloadUrl?: string;
}

export interface VideoQuality {
  label: string;
  resolution: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export type Theme = 'light' | 'dark';

export interface SearchFilters {
  query: string;
  category: string;
  sortBy: 'latest' | 'popular' | 'views';
}
