import { useState, useEffect } from 'react';
import { Bot, Link2, Link2Off, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { telegramApi } from '../services/api';
import { BotStatus } from '../types';

export default function TelegramBot() {
  const [form, setForm] = useState({ botName: '', apiToken: '' });
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const data = await telegramApi.getStatus();
      setStatus(data);
    } catch {
      setStatus({ isConnected: false, botName: null, createdAt: null });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnecting(true);
    try {
      await telegramApi.connect(form);
      toast.success('Бот успешно подключён!');
      setForm({ botName: '', apiToken: '' });
      loadStatus();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Ошибка подключения');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
          <Bot className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Telegram-бот</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Подключите Telegram-бота для автоматического сбора обращений</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Статус подключения</h2>
          {loading ? (
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          ) : status?.isConnected ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Подключен</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <XCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Не подключен</span>
            </div>
          )}
        </div>

        {status?.isConnected && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <p className="text-sm text-green-700 dark:text-green-400">
              Бот <strong>{status.botName}</strong> активен
              {status.createdAt && ` (подключён ${new Date(status.createdAt).toLocaleDateString('ru-RU')})`}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Подключить нового бота</h2>
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Название бота</label>
            <input
              type="text"
              value={form.botName}
              onChange={(e) => setForm({ ...form, botName: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="Мой бот"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API Token Telegram</label>
            <input
              type="password"
              value={form.apiToken}
              onChange={(e) => setForm({ ...form, apiToken: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="123456:ABCdef..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={connecting || status?.isConnected}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {connecting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Link2 className="w-5 h-5" />
            )}
            {connecting ? 'Подключение...' : 'Подключить бота'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Как получить токен?</h3>
          <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
            <li>Напишите <strong>@BotFather</strong> в Telegram</li>
            <li>Отправьте команду <strong>/newbot</strong></li>
            <li>Следуйте инструкциям для создания бота</li>
            <li>Скопируйте полученный API токен</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
