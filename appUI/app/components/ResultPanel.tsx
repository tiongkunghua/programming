import { motion } from 'motion/react';
import { Play, RotateCcw, ChevronRight, AlertCircle, Volume } from 'lucide-react';
import React from 'react';

interface ResultPanelProps {
  targetCharacter: string;
  targetPinyin: string;
  recognizedCharacter: string;
  isCorrect: boolean;
  errorType?: 'tone' | 'initial' | 'final' | null;
  wasAmplified?: boolean;
  onRetry: () => void;
  onNext: () => void;
}

export function ResultPanel({
  targetCharacter,
  targetPinyin,
  recognizedCharacter,
  isCorrect,
  errorType = null,
  wasAmplified = false,
  onRetry,
  onNext,
}: ResultPanelProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlayback = () => {
    setIsPlaying(true);
    // Simulate playback duration
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const getErrorLabel = () => {
    switch (errorType) {
      case 'tone':
        return '🏷️ 聲調錯誤';
      case 'initial':
        return '🏷️ 聲母發音不對';
      case 'final':
        return '🏷️ 韻母發音位置不對';
      default:
        return '🏷️ 發音需要改進';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        {/* Result Banner */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`rounded-2xl p-6 mb-6 text-center ${
            isCorrect
              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
              : 'bg-gradient-to-r from-yellow-400 to-orange-400'
          }`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <p className="text-white text-4xl mb-2">
              {isCorrect ? '🎉 完美發音！' : '🤔 再試一次'}
            </p>
            <p className="text-white/90 text-lg">
              {isCorrect ? 'Perfect Pronunciation!' : 'Try Again'}
            </p>
          </motion.div>
        </motion.div>

        {/* Main Result Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          {/* Comparison Section - CRITICAL */}
          <div className="mb-6">
            <h3 className="text-gray-700 text-center mb-6 text-xl">發音對比</h3>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Target */}
              <div className="text-center p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
                <p className="text-blue-600 text-sm mb-2">目標 Target</p>
                <p className="text-gray-900 text-6xl mb-2">{targetCharacter}</p>
                <p className="text-blue-600 text-2xl">{targetPinyin}</p>
              </div>

              {/* Recognized */}
              <div className={`text-center p-6 rounded-2xl border-2 ${
                isCorrect
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`text-sm mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  AI 聽到 Detected
                </p>
                <p className={`text-6xl mb-2 ${
                  isCorrect ? 'text-gray-900' : 'text-red-600'
                }`}>
                  {recognizedCharacter}
                </p>
                {!isCorrect && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-sm mt-2"
                  >
                    ✗ 發音不符
                  </motion.p>
                )}
              </div>
            </div>

            {/* Error Attribution Tag */}
            {!isCorrect && errorType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 flex justify-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-300 rounded-full">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-700 text-sm">{getErrorLabel()}</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Playback Section */}
          <div className="mb-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600">你的錄音 Your Recording</span>
                <span className="text-gray-500 text-sm">增益處理後 Auto-Gain Applied</span>
              </div>

              {/* Auto-amplified notification */}
              {wasAmplified && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-3 flex items-center gap-2 text-orange-600 text-sm bg-orange-50 px-3 py-2 rounded-lg"
                >
                  <Volume className="w-4 h-4" />
                  <span>🎤 聲音偏小，系統已自動放大優化</span>
                </motion.div>
              )}

              {/* Playback controls */}
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={handlePlayback}
                  disabled={isPlaying}
                  className="w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 rounded-full flex items-center justify-center shadow-md transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                </motion.button>

                {/* Progress bar */}
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: '0%' }}
                    animate={{ width: isPlaying ? '100%' : '0%' }}
                    transition={{ duration: 2, ease: 'linear' }}
                  />
                </div>

                <span className="text-gray-500 text-sm">2.0s</span>
              </div>

              {/* Waveform visualization (simplified) */}
              <div className="flex items-center justify-center gap-1 mt-4 h-16">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-blue-300 rounded-full"
                    style={{
                      height: `${Math.sin(i * 0.3) * 30 + 35}%`,
                      opacity: 0.6,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              onClick={onRetry}
              className="py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-5 h-5" />
              <span>重試 Retry</span>
            </motion.button>

            <motion.button
              onClick={onNext}
              className="py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>下一題 Next</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Feedback message */}
        {!isCorrect && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-600 text-sm">
              💡 提示：注意聲調的變化，可以點擊示範按鈕多聽幾次
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}