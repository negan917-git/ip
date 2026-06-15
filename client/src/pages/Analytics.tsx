import { useEffect, useState } from 'react';
import {
  BarChart3,
  MessageSquare,
  AlertTriangle,
  Smile,
  Frown,
  TrendingUp,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { analyticsApi, messageApi } from '../services/api';
import { AnalyticsOverview, ChartData, Message, Pagination } from '../types';

const EMOTION_COLORS: Record<string, string> = {
  'Радость': '#22c55e',
  'Гнев': '#ef4444',
  'Грусть': '#3b82f6',
  'Нейтральное': '#6b7280',
  'Разочарование': '#f97316',
};

const COMPLAINT_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#6b7280'];

export default function Analytics() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [emotions, setEmotions] = useState<ChartData[]>([]);
  const [complaints, setComplaints] = useState<ChartData[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ emotion: '', category: '', priority: '' });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        limit: 10,
        sortBy,
        sortOrder,
      };
      if (search) params.search = search;
      if (filters.emotion) params.emotion = filters.emotion;
      if (filters.category) params.category = filters.category;
      if (filters.priority) params.priority = filters.priority;

      const [overviewData, emotionsData, complaintsData, messagesData] = await Promise.all([
        analyticsApi.getOverview(),
        analyticsApi.getEmotions(),
        analyticsApi.getComplaints(),
        messageApi.getAll(params),
      ]);

      setOverview(overviewData);
      setEmotions(emotionsData);
      setComplaints(complaintsData);
      setMessages(messagesData.messages);
      setPagination(messagesData.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters, sortBy, sortOrder]);

  const handleSearch = () => {
    loadData(1);
  };

  const stats = overview
    ? [
        { label: 'Всего сообщений', value: overview.totalMessages, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Жалоб', value: overview.complaints, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
        { label: 'Позитивных', value: overview.positiveMessages, icon: Smile, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
        { label: 'Негативных', value: overview.negativeMessages, icon: Frown, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        { label: 'Высокоприоритетных', value: overview.highPriority, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
      ]
    : [];

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  const emotionColor = (emotion: string | null) => {
    switch (emotion) {
      case 'радость': return 'text-green-600 dark:text-green-400';
      case 'гнев': return 'text-red-600 dark:text-red-400';
      case 'грусть': return 'text-blue-600 dark:text-blue-400';
      case 'разочарование': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const priorityBadge = (priority: string | null) => {
    switch (priority) {
      case 'критичный': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'высокий': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'средний': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  const complaintBadge = (isComplaint: boolean | null) =>
    isComplaint
      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
          <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Аналитика</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Статистика и анализ обращений пользователей</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
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
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Распределение эмоций</h2>
          {emotions.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emotions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f3f4f6',
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {emotions.map((entry) => (
                    <Cell key={entry.name} fill={EMOTION_COLORS[entry.name] || '#6b7280'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">Нет данных</div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Категории жалоб</h2>
          {complaints.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={complaints}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {complaints.map((_, index) => (
                    <Cell key={index} fill={COMPLAINT_COLORS[index % COMPLAINT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">Нет данных</div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Таблица обращений</h2>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Поиск..."
                />
              </div>
              <select
                value={filters.emotion}
                onChange={(e) => setFilters({ ...filters, emotion: e.target.value })}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white outline-none"
              >
                <option value="">Все эмоции</option>
                <option value="радость">Радость</option>
                <option value="гнев">Гнев</option>
                <option value="грусть">Грусть</option>
                <option value="нейтральное">Нейтральное</option>
                <option value="разочарование">Разочарование</option>
              </select>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white outline-none"
              >
                <option value="">Все категории</option>
                <option value="техническая проблема">Техническая проблема</option>
                <option value="качество обслуживания">Качество обслуживания</option>
                <option value="оплата">Оплата</option>
                <option value="доставка">Доставка</option>
                <option value="другое">Другое</option>
              </select>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white outline-none"
              >
                <option value="">Все приоритеты</option>
                <option value="низкий">Низкий</option>
                <option value="средний">Средний</option>
                <option value="высокий">Высокий</option>
                <option value="критичный">Критичный</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer" onClick={() => toggleSort('id')}>
                  <div className="flex items-center gap-1">ID <SortIcon field="id" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Текст</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Источник</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer" onClick={() => toggleSort('emotion')}>
                  <div className="flex items-center gap-1">Эмоция <SortIcon field="emotion" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Жалоба</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer" onClick={() => toggleSort('category')}>
                  <div className="flex items-center gap-1">Категория <SortIcon field="category" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer" onClick={() => toggleSort('priority')}>
                  <div className="flex items-center gap-1">Приоритет <SortIcon field="priority" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer" onClick={() => toggleSort('createdAt')}>
                  <div className="flex items-center gap-1">Дата <SortIcon field="createdAt" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Нет обращений</td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{msg.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white max-w-xs truncate">{msg.text}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${msg.source === 'telegram' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                        {msg.source === 'telegram' ? 'Telegram' : 'Веб'}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm ${emotionColor(msg.emotion)}`}>{msg.emotion || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${complaintBadge(msg.isComplaint)}`}>
                        {msg.isComplaint === null ? '-' : msg.isComplaint ? 'Да' : 'Нет'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white capitalize">{msg.category || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${priorityBadge(msg.priority)}`}>
                        {msg.priority || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(msg.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {pagination.total} записей, страница {pagination.page} из {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => loadData(pagination.page - 1)}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
              >
                Назад
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadData(pagination.page + 1)}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
              >
                Вперёд
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
