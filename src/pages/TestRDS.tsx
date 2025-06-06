import React, { useState } from 'react';

const TestRDS: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const testConnection = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/test-rds');
      const data = await response.json();
      if (data.success) {
        setResult(`连接成功！服务器时间: ${new Date(data.now).toLocaleString()}`);
      } else {
        setError(data.error || '连接失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">RDS 连接测试</h1>
      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? '测试中...' : '测试连接'}
      </button>
      
      {result && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          {result}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          错误: {error}
        </div>
      )}
    </div>
  );
};

export default TestRDS; 