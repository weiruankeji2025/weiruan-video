import { useEffect, useState } from 'react';
import { useVideoStore } from '../store/useVideoStore';
import { mockVideos } from '../data/mockVideos';
import Header from '../components/Header';
import CategoryFilter from '../components/CategoryFilter';
import SortFilter from '../components/SortFilter';
import VideoCard from '../components/VideoCard';
import VideoPlayer from '../components/VideoPlayer';
import type { Video } from '../types';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { filteredVideos, setVideos, selectedVideo, setSelectedVideo } = useVideoStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟加载视频数据
    const loadVideos = async () => {
      setLoading(true);
      // 模拟API请求延迟
      await new Promise((resolve) => setTimeout(resolve, 800));
      setVideos(mockVideos);
      setLoading(false);
    };

    loadVideos();
  }, [setVideos]);

  const handlePlayVideo = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleClosePlayer = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient animate-fade-in">
            探索精彩视频世界
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 animate-fade-in">
            高清播放 · 极速下载 · 海量内容
          </p>
        </div>

        {/* Filters */}
        <CategoryFilter />
        <SortFilter />

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">加载中...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Video Grid */}
            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onPlay={handlePlayVideo}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                  没有找到相关视频
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  尝试更换关键词或筛选条件
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer video={selectedVideo} onClose={handleClosePlayer} />
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">© 2024 微软视频平台. All rights reserved.</p>
            <p className="text-sm">高清视频 · 流畅体验 · 极速下载</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
