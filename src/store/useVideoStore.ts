import { create } from 'zustand';
import type { Video, SearchFilters } from '../types';

interface VideoState {
  videos: Video[];
  filteredVideos: Video[];
  selectedVideo: Video | null;
  searchFilters: SearchFilters;
  setVideos: (videos: Video[]) => void;
  setSelectedVideo: (video: Video | null) => void;
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
  filterVideos: () => void;
}

export const useVideoStore = create<VideoState>((set, get) => ({
  videos: [],
  filteredVideos: [],
  selectedVideo: null,
  searchFilters: {
    query: '',
    category: 'all',
    sortBy: 'latest',
  },
  setVideos: (videos) => {
    set({ videos, filteredVideos: videos });
    get().filterVideos();
  },
  setSelectedVideo: (video) => set({ selectedVideo: video }),
  updateSearchFilters: (filters) => {
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...filters },
    }));
    get().filterVideos();
  },
  filterVideos: () => {
    const { videos, searchFilters } = get();
    let filtered = [...videos];

    // 搜索过滤
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query) ||
          video.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // 分类过滤
    if (searchFilters.category !== 'all') {
      filtered = filtered.filter(
        (video) => video.category === searchFilters.category
      );
    }

    // 排序
    switch (searchFilters.sortBy) {
      case 'latest':
        filtered.sort(
          (a, b) =>
            new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
    }

    set({ filteredVideos: filtered });
  },
}));
