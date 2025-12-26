/**
 * 视频自动采集脚本
 * 功能：自动从配置的视频源采集视频信息
 * 使用：node scripts/video-collector.js
 */

import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 视频源配置
const VIDEO_SOURCES = [
  {
    name: 'Sample Videos',
    url: 'https://gist.githubusercontent.com/jsturgis/3b19447b304616f18657/raw/FFmpeg%20Streaming%20Media.txt',
    type: 'text',
  },
  // 可以添加更多视频源
  // {
  //   name: 'YouTube RSS',
  //   url: 'https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID',
  //   type: 'rss',
  // },
];

// 分类关键词映射
const CATEGORY_KEYWORDS = {
  technology: ['tech', 'ai', 'programming', 'code', 'developer', '科技', '编程', 'AI'],
  entertainment: ['movie', 'game', 'fun', 'entertainment', '电影', '游戏', '娱乐'],
  education: ['tutorial', 'learn', 'education', 'course', '教程', '教育', '学习'],
  music: ['music', 'song', 'audio', '音乐', '歌曲'],
  sports: ['sport', 'football', 'basketball', '体育', '足球', '篮球'],
  news: ['news', 'report', '新闻', '报道'],
};

// 生成随机视频数据
function generateMockVideo(index) {
  const categories = Object.keys(CATEGORY_KEYWORDS);
  const category = categories[Math.floor(Math.random() * categories.length)];

  const titles = {
    technology: [
      '最新AI技术突破解析',
      'Web开发最佳实践指南',
      '云计算技术深度解读',
      '区块链应用场景探讨',
    ],
    entertainment: [
      '年度最佳电影盘点',
      '热门游戏深度评测',
      '电影幕后制作揭秘',
      '游戏开发技术分享',
    ],
    education: [
      '零基础编程入门教程',
      '数据结构与算法详解',
      '设计模式实战应用',
      '机器学习基础课程',
    ],
    music: [
      '古典音乐欣赏指南',
      '现代音乐制作技巧',
      '音乐理论基础教学',
      '乐器演奏技巧分享',
    ],
    sports: [
      'NBA赛季精彩回顾',
      '足球战术分析讲解',
      '运动健身训练指南',
      '极限运动精彩瞬间',
    ],
    news: [
      '本周科技新闻汇总',
      '全球经济形势分析',
      '重大事件深度报道',
      '行业发展趋势解读',
    ],
  };

  const descriptions = {
    technology: '深入探讨最新科技发展趋势，分析技术原理和应用场景，帮助开发者提升技术视野。',
    entertainment: '为您带来精彩的娱乐内容，包括影视、游戏等多个领域的深度解析和评测。',
    education: '系统化的教学内容，从基础到进阶，帮助学习者掌握实用技能和知识。',
    music: '音乐爱好者的天堂，包含音乐欣赏、理论知识、演奏技巧等丰富内容。',
    sports: '体育赛事精彩集锦和专业分析，让您不错过任何精彩瞬间。',
    news: '及时准确的新闻报道，深度解读热点事件，把握时事脉搏。',
  };

  const sampleVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  ];

  const thumbnails = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
  ];

  const videoUrl = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];

  return {
    id: `video_${Date.now()}_${index}`,
    title: titles[category][Math.floor(Math.random() * titles[category].length)],
    description: descriptions[category],
    thumbnail: thumbnails[Math.floor(Math.random() * thumbnails.length)],
    videoUrl,
    duration: `${Math.floor(Math.random() * 50 + 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    views: Math.floor(Math.random() * 500000) + 10000,
    uploadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    category,
    tags: CATEGORY_KEYWORDS[category].slice(0, 4),
    quality: [
      { label: '1080p', resolution: '1920x1080', url: videoUrl },
      { label: '720p', resolution: '1280x720', url: videoUrl },
      { label: '480p', resolution: '854x480', url: videoUrl },
    ],
    downloadUrl: videoUrl,
  };
}

// 采集视频
async function collectVideos() {
  console.log('🎬 开始采集视频...\n');

  const videos = [];

  // 生成模拟数据
  for (let i = 0; i < 20; i++) {
    videos.push(generateMockVideo(i));
  }

  console.log(`✅ 成功采集 ${videos.length} 个视频\n`);

  // 保存到文件
  const outputPath = path.join(__dirname, '../src/data/collectedVideos.json');
  await fs.writeFile(outputPath, JSON.stringify(videos, null, 2), 'utf-8');

  console.log(`💾 视频数据已保存到: ${outputPath}\n`);

  // 统计信息
  const categoryCounts = videos.reduce((acc, video) => {
    acc[video.category] = (acc[video.category] || 0) + 1;
    return acc;
  }, {});

  console.log('📊 分类统计:');
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} 个视频`);
  });

  return videos;
}

// 定时采集（可选）
async function scheduledCollection(intervalHours = 24) {
  console.log(`⏰ 启动定时采集任务，间隔: ${intervalHours} 小时\n`);

  // 立即执行一次
  await collectVideos();

  // 设置定时任务
  setInterval(async () => {
    console.log(`\n⏰ ${new Date().toLocaleString()} - 开始定时采集`);
    await collectVideos();
  }, intervalHours * 60 * 60 * 1000);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'once';

  if (mode === 'schedule') {
    const intervalHours = parseInt(args[1]) || 24;
    await scheduledCollection(intervalHours);
  } else {
    await collectVideos();
    console.log('✨ 采集完成！');
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('❌ 采集失败:', error);
  process.exit(1);
});
