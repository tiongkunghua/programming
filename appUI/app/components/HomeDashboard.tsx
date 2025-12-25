import { motion } from 'motion/react';
import { Flame, ChevronRight, Sparkles } from 'lucide-react';
import React from 'react';

interface HomeDashboardProps {
  userName: string;
  streakDays: number;
  onStartPractice: () => void;
  onNavigate: (page: 'home' | 'practice' | 'analytics' | 'settings') => void;
  currentPage: string;
}

interface DailyTask {
  id: string;
  label: string;
  completed: boolean;
}

export function HomeDashboard({ userName, streakDays, onStartPractice, onNavigate, currentPage }: HomeDashboardProps) {
  const [tasks, setTasks] = React.useState<DailyTask[]>([
    { id: '1', label: '完成 5 次練習', completed: false },
    { id: '2', label: '唸對 3 個三聲字', completed: false },
    { id: '3', label: '連續練習 10 分鐘', completed: true },
  ]);

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const isAllCompleted = completedCount === totalCount;

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div>
          <p className="text-gray-500 text-sm">早安</p>
          <p className="text-gray-900 text-xl">{userName}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
          <Flame className="w-5 h-5 text-white" />
          <span className="text-white">連續打卡 {streakDays} 天</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-6 space-y-6 overflow-auto pb-24">
        {/* Daily Mission Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-6 shadow-lg transition-all ${
            isAllCompleted 
              ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500' 
              : 'bg-white'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className={`text-xl mb-1 ${isAllCompleted ? 'text-white' : 'text-gray-900'}`}>
                每日任務 {isAllCompleted && '✨'}
              </h3>
              <p className={`text-sm ${isAllCompleted ? 'text-white/90' : 'text-gray-600'}`}>
                Daily Mission
              </p>
            </div>

            {/* Progress Circle */}
            <div className="relative w-16 h-16">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  className={isAllCompleted ? 'stroke-white/30' : 'stroke-gray-200'}
                  strokeWidth="3"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  className={isAllCompleted ? 'stroke-white' : 'stroke-blue-500'}
                  strokeWidth="3"
                  strokeDasharray="97.4"
                  initial={{ strokeDashoffset: 97.4 }}
                  animate={{ strokeDashoffset: 97.4 - (97.4 * completedCount / totalCount) }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm ${isAllCompleted ? 'text-white' : 'text-gray-900'}`}>
                  {completedCount}/{totalCount}
                </span>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.completed 
                    ? isAllCompleted ? 'bg-white border-white' : 'bg-blue-500 border-blue-500'
                    : isAllCompleted ? 'border-white/50' : 'border-gray-300'
                }`}>
                  {task.completed && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isAllCompleted ? '#f59e0b' : 'white'}
                      strokeWidth="3"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
                <span className={`flex-1 ${
                  task.completed 
                    ? isAllCompleted ? 'text-white/80 line-through' : 'text-gray-500 line-through'
                    : isAllCompleted ? 'text-white' : 'text-gray-700'
                }`}>
                  {task.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Achievement Badge */}
          {isAllCompleted && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4 pt-4 border-t border-white/30 text-center"
            >
              <p className="text-white text-lg">🏆 任務達成徽章</p>
              <p className="text-white/90 text-sm mt-1">恭喜完成今日所有任務！</p>
            </motion.div>
          )}
        </motion.div>

        {/* AI Smart Suggestion Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 shadow-lg"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-xl mb-1">AI 智慧推薦</h3>
              <p className="text-blue-100 text-sm">Smart Suggestion</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
            <p className="text-white mb-2">今日學習重點：第三聲（上聲）</p>
            <p className="text-blue-100 text-sm">
              系統發現您昨天的三聲準確率較低，建議優先練習。
            </p>
          </div>

          <div className="flex items-center gap-2 text-white/80 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>根據您的 7 天學習數據分析</span>
          </div>
        </motion.div>
      </div>

      {/* Hero Action Button - Floating */}
      <motion.div
        className="fixed bottom-24 left-0 right-0 px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={onStartPractice}
          className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            boxShadow: [
              '0 10px 40px rgba(79, 70, 229, 0.3)',
              '0 10px 60px rgba(79, 70, 229, 0.5)',
              '0 10px 40px rgba(79, 70, 229, 0.3)',
            ],
          }}
          transition={{
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          <span className="text-2xl">開始今日練習</span>
          <p className="text-blue-100 text-sm mt-1">Start Practice</p>
        </motion.button>
      </motion.div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 safe-area-inset-bottom">
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'home', label: '首頁', icon: '🏠' },
            { id: 'practice', label: '自由練習', icon: '📝' },
            { id: 'analytics', label: '學習報表', icon: '📊' },
            { id: 'settings', label: '設定', icon: '⚙️' },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => onNavigate(tab.id as any)}
              className={`py-2 px-3 rounded-xl transition-colors ${
                currentPage === tab.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-xl mb-1">{tab.icon}</div>
              <div className="text-xs">{tab.label}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
