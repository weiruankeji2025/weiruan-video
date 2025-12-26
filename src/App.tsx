import { useEffect } from 'react';
import { useThemeStore } from './store/useThemeStore';
import Home from './pages/Home';

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    // 初始化主题
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <Home />;
}

export default App;
