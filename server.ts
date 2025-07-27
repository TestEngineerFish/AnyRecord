import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const port = 3001;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 健康检查API
app.get('/api/health', (_req, res) => {
  res.json({ 
    success: true, 
    message: 'AnyRecord API 服务正常运行',
    timestamp: new Date().toISOString(),
    storage: 'IndexedDB (本地存储)'
  });
});

// 基本路由
app.get('/', (_req, res) => {
  res.json({
    name: 'AnyRecord API',
    version: '1.0.0',
    description: '密码管理器后端服务 - 本地存储版本',
    storage: 'IndexedDB'
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 