import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { X, Download, Share2 } from 'lucide-react';
import type { Video } from '../types';

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

export default function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [selectedQuality, setSelectedQuality] = useState(video.quality[0]);

  useEffect(() => {
    // 防止body滚动
    document.body.style.overflow = 'hidden';

    if (videoRef.current) {
      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: 'auto',
        fluid: true,
        responsive: true,
        playbackRates: [0.5, 1, 1.5, 2],
        sources: [
          {
            src: selectedQuality.url,
            type: 'video/mp4',
          },
        ],
      });

      playerRef.current = player;

      // 播放失败处理
      player.on('error', () => {
        console.error('视频加载失败');
      });
    }

    return () => {
      document.body.style.overflow = 'unset';
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [selectedQuality]);

  const handleQualityChange = (quality: typeof video.quality[0]) => {
    const currentTime = playerRef.current?.currentTime() || 0;
    setSelectedQuality(quality);
    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.currentTime(currentTime);
        playerRef.current.play();
      }
    }, 100);
  };

  const handleDownload = () => {
    if (video.downloadUrl) {
      const link = document.createElement('a');
      link.href = video.downloadUrl;
      link.download = `${video.title}.mp4`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('分享取消或失败');
      }
    } else {
      // 复制链接
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-fade-in">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <h2 className="text-xl font-bold text-white max-w-3xl truncate">
            {video.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Video Player */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-6xl">
            <video
              ref={videoRef}
              className="video-js vjs-big-play-centered vjs-16-9"
            />
          </div>
        </div>

        {/* Controls & Info */}
        <div className="p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-6xl mx-auto">
            {/* Quality Selector & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm font-semibold">画质:</span>
                {video.quality.map((quality) => (
                  <button
                    key={quality.label}
                    onClick={() => handleQualityChange(quality)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedQuality.label === quality.label
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {quality.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                >
                  <Download className="w-5 h-5" />
                  <span>下载</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  <span>分享</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white/90 mb-3">{video.description}</p>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/10 text-white text-sm rounded-lg"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
