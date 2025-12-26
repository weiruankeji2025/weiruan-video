import { TrendingUp, Calendar, Eye } from 'lucide-react';
import { useVideoStore } from '../store/useVideoStore';

export default function SortFilter() {
  const { searchFilters, updateSearchFilters } = useVideoStore();

  const sortOptions = [
    { value: 'latest', label: '最新', icon: Calendar },
    { value: 'popular', label: '热门', icon: TrendingUp },
    { value: 'views', label: '观看最多', icon: Eye },
  ];

  return (
    <div className="flex items-center space-x-3 mb-6">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        排序:
      </span>
      {sortOptions.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() =>
            updateSearchFilters({ sortBy: value as 'latest' | 'popular' | 'views' })
          }
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            searchFilters.sortBy === value
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
