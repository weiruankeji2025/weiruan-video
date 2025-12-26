# 开发文档

## 项目架构

### 技术选型理由

#### 前端框架
- **React 18**: 使用最新的并发特性，提供更好的用户体验
- **TypeScript**: 提供类型安全，减少运行时错误
- **Vite**: 极快的开发服务器和构建速度

#### 状态管理
- **Zustand**: 轻量级（约 1KB），API 简洁，无需 Provider 包裹

#### 样式方案
- **Tailwind CSS**: 原子化 CSS，开发效率高，包体积小
- **自定义动画**: 流畅的过渡和动画效果

### 核心设计模式

#### 1. 状态管理模式

```typescript
// 使用 Zustand 创建 store
const useVideoStore = create<VideoState>((set, get) => ({
  videos: [],
  setVideos: (videos) => set({ videos }),
  // 更多状态和操作...
}));
```

#### 2. 组件设计模式

- **容器组件**: 负责数据获取和状态管理
- **展示组件**: 只负责 UI 渲染
- **Hooks**: 封装可复用逻辑

#### 3. 性能优化模式

```typescript
// 懒加载
const { ref, inView } = useInView({
  triggerOnce: true,
  threshold: 0.1,
});

// 代码分割
const VideoPlayer = lazy(() => import('./components/VideoPlayer'));
```

## 开发指南

### 代码规范

#### TypeScript 规范

```typescript
// ✅ 好的实践
interface VideoProps {
  video: Video;
  onPlay: (video: Video) => void;
}

// ❌ 避免使用 any
const data: any = fetchData(); // 不推荐
```

#### React 规范

```typescript
// ✅ 使用函数组件和 Hooks
export default function VideoCard({ video }: VideoCardProps) {
  const [loading, setLoading] = useState(false);
  // ...
}

// ✅ 使用 TypeScript 类型
const handleClick = (e: React.MouseEvent) => {
  e.preventDefault();
};
```

#### CSS 规范

```css
/* ✅ 使用 Tailwind 工具类 */
<div className="flex items-center space-x-4">

/* ✅ 自定义类使用 @layer */
@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600;
  }
}
```

### 组件开发

#### 创建新组件

1. 在 `src/components/` 创建组件文件
2. 定义 Props 接口
3. 实现组件逻辑
4. 添加必要的注释

```typescript
/**
 * 视频卡片组件
 * @param video - 视频数据
 * @param onPlay - 播放回调函数
 */
interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
}

export default function VideoCard({ video, onPlay }: VideoCardProps) {
  // 组件逻辑
}
```

### 状态管理

#### 创建新的 Store

```typescript
import { create } from 'zustand';

interface MyState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useMyStore = create<MyState>((set) => ({
  data: [],
  setData: (data) => set({ data }),
}));
```

#### 使用 Store

```typescript
function MyComponent() {
  const { data, setData } = useMyStore();

  useEffect(() => {
    // 获取数据
    fetchData().then(setData);
  }, []);
}
```

### API 集成

#### 创建 API 服务

```typescript
// src/services/videoService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

export const videoService = {
  async getVideos() {
    const response = await axios.get(`${API_BASE_URL}/videos`);
    return response.data;
  },

  async getVideoById(id: string) {
    const response = await axios.get(`${API_BASE_URL}/videos/${id}`);
    return response.data;
  },
};
```

### 样式开发

#### 主题配置

修改 `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#3b82f6',
        600: '#2563eb',
      }
    }
  }
}
```

#### 暗黑模式

```html
<!-- 使用 dark: 前缀 -->
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">标题</h1>
</div>
```

### 性能优化

#### 图片优化

```typescript
// 懒加载图片
<img
  src={video.thumbnail}
  alt={video.title}
  loading="lazy"
  className="w-full h-full object-cover"
/>
```

#### 代码分割

```typescript
// 路由级别代码分割
const Home = lazy(() => import('./pages/Home'));
const VideoDetail = lazy(() => import('./pages/VideoDetail'));
```

#### 防抖和节流

```typescript
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (query: string) => {
    updateSearchFilters({ query });
  },
  300
);
```

### 测试

#### 单元测试

```typescript
import { render, screen } from '@testing-library/react';
import VideoCard from './VideoCard';

test('renders video card', () => {
  const video = {
    id: '1',
    title: 'Test Video',
    // ...
  };

  render(<VideoCard video={video} onPlay={() => {}} />);
  expect(screen.getByText('Test Video')).toBeInTheDocument();
});
```

## 视频采集系统

### 配置视频源

编辑 `scripts/video-collector.js`:

```javascript
const VIDEO_SOURCES = [
  {
    name: 'YouTube RSS',
    url: 'https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID',
    type: 'rss',
  },
  // 添加更多源...
];
```

### 运行采集

```bash
# 单次采集
node scripts/video-collector.js

# 定时采集（每6小时）
node scripts/video-collector.js schedule 6
```

### 自定义采集逻辑

```javascript
async function collectFromCustomSource() {
  const response = await axios.get('YOUR_API_URL');
  const videos = response.data.map(item => ({
    id: item.id,
    title: item.title,
    // 映射其他字段...
  }));
  return videos;
}
```

## 部署指南

### 环境变量

生产环境需要配置：

```env
VITE_API_URL=https://api.production.com
VITE_VIDEO_CDN=https://cdn.production.com
```

### 构建优化

```bash
# 分析包大小
npm run build -- --analyze

# 优化构建
npm run build
```

### Docker 部署

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]
```

## 常见问题

### Q: 视频无法播放？

A: 检查视频 URL 是否支持 CORS，确保服务器配置正确。

### Q: 暗黑模式不生效？

A: 确保 Tailwind 配置了 `darkMode: 'class'`。

### Q: 性能问题？

A: 检查是否启用了懒加载、代码分割等优化措施。

## 贡献流程

1. Fork 仓库
2. 创建功能分支
3. 提交代码
4. 编写测试
5. 提交 Pull Request

## 更新日志

### v1.0.0 (2024-01-15)

- ✨ 初始版本发布
- ✨ 实现基础视频播放
- ✨ 实现暗黑模式
- ✨ 实现搜索筛选
- ✨ 实现视频下载
- ✨ 实现自动采集

## 联系我们

- GitHub: https://github.com/yourusername/weiruan-video
- Email: dev@weiruan-video.com
