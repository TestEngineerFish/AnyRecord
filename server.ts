import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import path from 'path';

const app = express();
const port = 3001;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 数据库连接配置
const dbConfig = {
  host: 'rm-bp1a5s6v4j3e79m2lzo.mysql.rds.aliyuncs.com',
  user: 'sam',
  password: '@Testsha823',
  database: 'testDB',
  port: 1433,
  connectTimeout: 10000, // 增加连接超时时间
  ssl: {
    rejectUnauthorized: false // 允许自签名证书
  }
};

// 测试数据库连接
app.get('/api/test-db', async (_req, res) => {
  let connection;
  try {
    console.log('正在尝试连接数据库...');
    console.log('连接配置:', {
      ...dbConfig,
      password: '******' // 隐藏密码
    });
    
    connection = await mysql.createConnection(dbConfig);
    console.log('数据库连接成功，正在执行测试查询...');
    
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('查询结果:', rows);
    
    res.json({ success: true, message: '数据库连接成功', data: rows });
  } catch (error) {
    console.error('数据库连接错误详情:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ 
      success: false, 
      message: '数据库连接失败', 
      error: error.message,
      details: {
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState
      }
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// 基本路由
app.get('/', (_req, res) => {
  res.send('AnyRecord API 服务器正在运行');
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 