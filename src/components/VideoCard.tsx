import { Play, Eye, Clock, Download } from 'lucide-react';
import type { Video } from '../types';
import { useVideoStore } from '../store/useVideoStore';
import { useInView } from 'react-intersection-observer';

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
}

export default function VideoCard({ video, onPlay }: VideoCardProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.downloadUrl) {
      const link = document.createElement('a');
      link.href = video.downloadUrl;
      link.download = `${video.title}.mp4`;
      link.click();
    }
  };

  return (
    <div
      ref={ref}
      className={`card group cursor-pointer overflow-hidden transform transition-all duration-500 hover:-translate-y-2 ${
        inView ? 'animate-slide-up' : 'opacity-0'
      }`}
      onClick={() => onPlay(video)}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" />
            </div>
          </div>
        </div>
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded-lg text-white text-sm font-semibold flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{video.duration}</span>
        </div>
        {/* Quality Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 rounded-lg text-white text-xs font-bold">
          {video.quality[0]?.label || 'HD'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {video.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {video.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{formatViews(video.views)}</span>
            </div>
            <span>{new Date(video.uploadDate).toLocaleDateString('zh-CN')}</span>
          </div>
          <button
            onClick={handleDownload}
            className="p-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110"
            title="下载视频"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {video.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-lg text-gray-700 dark:text-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
