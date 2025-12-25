import { motion } from 'motion/react';
import { RefreshCw, Bell, Zap } from 'lucide-react';
import React from 'react';

interface SettingsPageProps {
  onRecalibrate: () => void;
}

export function SettingsPage({ onRecalibrate }: SettingsPageProps) {
  const [showToneCurve, setShowToneCurve] = React.useState(true);
  const [demoSpeed, setDemoSpeed] = React.useState<'slow' | 'normal'>('normal');
  const [notifications, setNotifications] = React.useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-gray-900 text-3xl mb-2">個人設定</h1>
          <p className="text-gray-600">Preferences</p>
        </div>

        {/* Settings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
        >
          {/* Learning Preferences Section */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-700 mb-4">學習偏好設定</h3>

            {/* Tone Curve Toggle */}
            <div className="flex items-center justify-between py-4">
              <div className="flex-1">
                <p className="text-gray-900 mb-1">顯示聲調輔助線</p>
                <p className="text-gray-500 text-sm">Show Tone Curve</p>
              </div>
              <motion.button
                onClick={() => setShowToneCurve(!showToneCurve)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  showToneCurve ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ left: showToneCurve ? '28px' : '4px' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>

            {/* Demo Speed Toggle */}
            <div className="flex items-center justify-between py-4 border-t border-gray-100">
              <div className="flex-1">
                <p className="text-gray-900 mb-1">TTS 示範語速</p>
                <p className="text-gray-500 text-sm">Demo Speed</p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setDemoSpeed('slow')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    demoSpeed === 'slow'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  慢速
                </motion.button>
                <motion.button
                  onClick={() => setDemoSpeed('normal')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    demoSpeed === 'normal'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  正常
                </motion.button>
              </div>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between py-4 border-t border-gray-100">
              <div className="flex items-start gap-3 flex-1">
                <Bell className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-gray-900 mb-1">每日任務提醒</p>
                  <p className="text-gray-500 text-sm">Daily Task Notification</p>
                </div>
              </div>
              <motion.button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  notifications ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ left: notifications ? '28px' : '4px' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>
          </div>

          {/* Hardware Section */}
          <div className="p-6">
            <h3 className="text-gray-700 mb-4">硬體設定</h3>

            {/* Recalibrate Button */}
            <motion.button
              onClick={onRecalibrate}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-2xl shadow-md transition-all flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">重新校正麥克風</p>
                <p className="text-sm text-white/80">Recalibrate Hardware</p>
              </div>
            </motion.button>

            <div className="mt-4 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-blue-900 text-sm">
                如果遇到錄音問題或切換了音訊設備，建議重新校正以獲得最佳體驗。
              </p>
            </div>
          </div>

          {/* App Info Section */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="text-center space-y-2">
              <h2 className="text-gray-900 text-2xl">聲韻大師</h2>
              <p className="text-gray-600">Pinyin Master</p>
              <p className="text-gray-500 text-sm mt-4">Version 1.0.0</p>
              <p className="text-gray-400 text-xs mt-2">
                基於 Python 自動修復技術的漢語拼音學習工具
              </p>
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-500 text-sm">
            💡 所有設定會自動保存
          </p>
        </motion.div>
      </div>
    </div>
  );
}