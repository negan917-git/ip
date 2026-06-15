import { Link } from 'react-router-dom';
import { MessageSquare, BarChart3, Bot, Brain, Shield, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Анализ эмоций',
    description: 'Искусственный интеллект определяет эмоциональную окраску каждого обращения',
  },
  {
    icon: Shield,
    title: 'Выявление жалоб',
    description: 'Автоматическое обнаружение жалоб и их категоризация',
  },
  {
    icon: Bot,
    title: 'Интеграция Telegram',
    description: 'Подключите Telegram-бота и получайте обращения напрямую',
  },
  {
    icon: BarChart3,
    title: 'Аналитика обращений',
    description: 'Детальная статистика и графики по всем обращениям',
  },
  {
    icon: MessageSquare,
    title: 'Искусственный интеллект ChatGPT',
    description: 'Анализ текста на базе OpenAI ChatGPT для точных результатов',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">EmotionAI</span>
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Войти
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Зарегистрироваться
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Система анализа обращений пользователей
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Автоматическое выявление эмоций и жалоб на основе искусственного интеллекта
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-4 rounded-xl text-lg transition-all hover:shadow-lg hover:shadow-indigo-500/25"
            >
              Начать работу
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-medium px-8 py-4 rounded-xl text-lg border border-gray-200 dark:border-gray-600 transition-all"
            >
              Войти
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Возможности системы</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors">
                    <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} EmotionAI. Система анализа обращений пользователей.
        </div>
      </footer>
    </div>
  );
}
