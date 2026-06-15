import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  AlertTriangle,
  Smile,
  Frown,
  TrendingUp,
  Bot,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { analyticsApi, messageApi } from '../services/api';
import { AnalyticsOverview, Message } from '../types';

export default function Dashboard() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.getOverview(),
      messageApi.getAll({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
    ])
      .then(([overviewData, messagesData]) => {
        setOverview(overviewData);
        setRecentMessages(messagesData.messages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = overview
    ? [
        { label: 'Всего сообщений', value: overview.totalMessages, icon: MessageSquare, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Жалоб', value: overview.complaints, icon: AlertTriangle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
        { label: 'Позитивных', value: overview.positiveMessages, icon: Smile, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
        { label: 'Негативных', value: overview.negativeMessages, icon: Frown, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        { label: 'Высокий приоритет', value: overview.highPriority, icon: TrendingUp, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
      ]
    : [];

  const emotionColor = (emotion: string | null) => {
    switch (emotion) {
      case 'радость': return 'text-green-600 dark:text-green-400';
      case 'гнев': return 'text-red-600 dark:text-red-400';
      case 'грусть': return 'text-blue-600 dark:text-blue-400';
      case 'разочарование': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const priorityColor = (priority: string | null) => {
    switch (priority) {
      case 'критичный': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'высокий': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'средний': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Панель управления</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/telegram-bot"
          className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <Bot className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Telegram-бот</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Подключите бота для сбора обращений</p>
        </Link>

        <Link
          to="/analytics"
          className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Аналитика</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Просмотрите статистику обращений</p>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Последние обращения</h2>
            <Link to="/analytics" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              Все сообщения
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Текст</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Эмоция</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Приоритет</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentMessages.map((msg) => (
                <tr key={msg.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">{msg.text}</td>
                  <td className={`px-6 py-4 text-sm ${emotionColor(msg.emotion)}`}>{msg.emotion || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${priorityColor(msg.priority)}`}>
                      {msg.priority || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(msg.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                </tr>
              ))}
              {recentMessages.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Нет обращений
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
