import { Moon, Sun, Search } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useVideoStore } from '../store/useVideoStore';
import { useState } from 'react';

export default function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const { searchFilters, updateSearchFilters } = useVideoStore();
  const [searchQuery, setSearchQuery] = useState(searchFilters.query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchFilters({ query: searchQuery });
  };

  return (
    <header className="sticky top-0 z-50 glass-effect shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">🎬</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">微软视频</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">高清视频平台</p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索视频、分类、标签..."
                className="input-field pr-12"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-6 h-6 text-gray-900 dark:text-gray-100" />
            ) : (
              <Sun className="w-6 h-6 text-gray-900 dark:text-gray-100" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索视频..."
              className="input-field pr-12"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}
