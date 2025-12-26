import { categories } from '../data/mockVideos';
import { useVideoStore } from '../store/useVideoStore';

export default function CategoryFilter() {
  const { searchFilters, updateSearchFilters } = useVideoStore();

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => updateSearchFilters({ category: category.id })}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
              searchFilters.category === category.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-xl">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
