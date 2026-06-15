import { useState } from 'react';
import { Send, Brain, AlertTriangle, Clock, Tag, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { messageApi } from '../services/api';
import { AnalysisResult } from '../types';

export default function AnalyzeMessage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Введите текст сообщения');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await messageApi.analyze({ text });
      setResult(data);
      toast.success('Сообщение проанализировано!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Ошибка анализа');
    } finally {
      setLoading(false);
    }
  };

  const emotionColor = (emotion: string) => {
    switch (emotion) {
      case 'радость': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'гнев': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'грусть': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'разочарование': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'критичный': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'высокий': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'средний': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
          <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Анализ сообщения</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Отправьте текст для анализа эмоций и выявления жалоб</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Текст сообщения</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="Введите текст обращения пользователя..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {loading ? 'Анализ...' : 'Анализировать'}
        </button>
      </form>

      {result && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Результаты анализа
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Brain className="w-4 h-4" />
                Эмоция
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${emotionColor(result.emotion)}`}>
                {result.emotion}
              </span>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <AlertTriangle className="w-4 h-4" />
                Жалоба
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${result.isComplaint ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                {result.isComplaint ? 'Да' : 'Нет'}
              </span>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Tag className="w-4 h-4" />
                Категория
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{result.category}</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Clock className="w-4 h-4" />
                Срочность
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${priorityColor(result.priority)}`}>
                {result.priority}
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <FileText className="w-4 h-4" />
              Резюме
            </div>
            <p className="text-sm text-gray-900 dark:text-white">{result.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
