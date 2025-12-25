import { motion } from 'motion/react';
import { TrendingUp, Target, RotateCcw, AlertCircle, Clock, Hash, ChevronDown, ChevronUp, XCircle, AlertTriangle, Calendar, X } from 'lucide-react';
import React, { useState } from 'react';

interface AnalyticsPageProps {
  onPracticeWord: (word: string) => void;
}

// Mock data for error analysis
const errorData = [
  { type: '聲調錯誤', label: 'Tone Error', count: 15, color: '#ef4444' },
  { type: '聲母錯誤', label: 'Initial Error', count: 8, color: '#f97316' },
  { type: '韻母錯誤', label: 'Final Error', count: 12, color: '#eab308' },
];

// Accuracy distribution data
const accuracyDistribution = [
  { label: '完全正確', englishLabel: 'Perfect', count: 45, percentage: 60, color: '#22c55e' },
  { label: '部分正確', englishLabel: 'Partial', count: 15, percentage: 20, color: '#eab308' },
  { label: '錯誤', englishLabel: 'Incorrect', count: 15, percentage: 20, color: '#ef4444' },
];

// Detailed question breakdown
const partiallyCorrectWords = [
  { character: '好', userPinyin: 'háo', correctPinyin: 'hǎo', issue: '聲調標註錯誤' },
  { character: '馬', userPinyin: 'má', correctPinyin: 'mǎ', issue: '聲調識別錯誤' },
  { character: '你', userPinyin: 'ní', correctPinyin: 'nǐ', issue: '三聲發音不完整' },
  { character: '水', userPinyin: 'suǐ', correctPinyin: 'shuǐ', issue: '韻母發音偏差' },
  { character: '老', userPinyin: 'láo', correctPinyin: 'lǎo', issue: '聲調判斷錯誤' },
];

const incorrectWords = [
  { character: '懂', userPinyin: 'dòng', correctPinyin: 'dǒng', issue: '聲調完全錯誤' },
  { character: '請', userPinyin: 'qǐn', correctPinyin: 'qǐng', issue: '韻母發音錯誤' },
  { character: '讓', userPinyin: 'ràng', correctPinyin: 'ràng', issue: '聲調識別失敗' },
  { character: '想', userPinyin: 'shǎng', correctPinyin: 'xiǎng', issue: '聲母發音錯誤' },
  { character: '兩', userPinyin: 'lǎng', correctPinyin: 'liǎng', issue: '韻母與聲母混淆' },
];

// Daily practice data
const dailyPracticeData = [
  { day: '周一', date: '12/13', duration: 15, count: 8 },
  { day: '周二', date: '12/14', duration: 22, count: 12 },
  { day: '周三', date: '12/15', duration: 18, count: 10 },
  { day: '周四', date: '12/16', duration: 30, count: 15 },
  { day: '周五', date: '12/17', duration: 12, count: 6 },
  { day: '周六', date: '12/18', duration: 25, count: 14 },
  { day: '周日', date: '12/19', duration: 20, count: 11 },
];

const toneAccuracy = {
  tone1: 90,
  tone2: 85,
  tone3: 65, // Weakness
  tone4: 88,
  neutral: 75,
};

const weakWords = [
  { character: '懂', pinyin: 'dǒng', errorCount: 5 },
  { character: '馬', pinyin: 'mǎ', errorCount: 4 },
  { character: '好', pinyin: 'hǎo', errorCount: 3 },
  { character: '水', pinyin: 'shuǐ', errorCount: 3 },
];

export function AnalyticsPage({ onPracticeWord }: AnalyticsPageProps) {
  const maxErrorCount = Math.max(...errorData.map(d => d.count));
  const totalErrors = errorData.reduce((sum, d) => sum + d.count, 0);
  const maxDuration = Math.max(...dailyPracticeData.map(d => d.duration));
  const maxCount = Math.max(...dailyPracticeData.map(d => d.count));
  const totalDuration = dailyPracticeData.reduce((sum, d) => sum + d.duration, 0);
  const avgDuration = Math.round(totalDuration / dailyPracticeData.length);

  const [showWeakWords, setShowWeakWords] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Generate calendar data for December 2024
  const calendarData = Array.from({ length: 31 }, (_, i) => {
    const date = i + 1;
    const practiceData = dailyPracticeData.find(d => d.date === `12/${date}`);
    return {
      date,
      duration: practiceData?.duration || 0,
      count: practiceData?.count || 0,
      day: practiceData?.day || '',
    };
  });

  // Get color intensity based on duration
  const getHeatmapColor = (duration: number) => {
    if (duration === 0) return 'bg-gray-100';
    if (duration < 15) return 'bg-blue-200';
    if (duration < 22) return 'bg-blue-400';
    if (duration < 28) return 'bg-blue-600';
    return 'bg-blue-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-gray-900 text-3xl mb-2">學習成效報表</h1>
          <p className="text-gray-600">Analytics & Progress</p>
        </div>

        {/* Error Type Analysis Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-gray-900 text-xl mb-1">錯誤類型分析</h3>
              <p className="text-gray-600 text-sm">Error Type Analysis</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">共 {totalErrors} 次錯誤</span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="space-y-6">
            {errorData.map((item, index) => (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="space-y-2"
              >
                {/* Label and count */}
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-900 font-medium">{item.type}</span>
                    <span className="text-gray-500 ml-2">({item.label})</span>
                  </div>
                  <span className="text-gray-700 font-semibold">{item.count} 次</span>
                </div>

                {/* Bar */}
                <div className="relative h-12 bg-gray-100 rounded-xl overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-xl flex items-center justify-end pr-4"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / maxErrorCount) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.4, ease: 'easeOut' }}
                  >
                    <motion.span
                      className="text-white font-bold text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.8 }}
                    >
                      {item.count}
                    </motion.span>
                  </motion.div>
                </div>

                {/* Percentage */}
                <div className="text-right text-xs text-gray-500">
                  占比 {((item.count / totalErrors) * 100).toFixed(1)}%
                </div>
              </motion.div>
            ))}
          </div>

          {/* Analysis Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 p-4 bg-blue-50 rounded-2xl flex items-start gap-3"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">💡</span>
            </div>
            <div className="flex-1">
              <p className="text-blue-900 font-medium mb-1">學習建議</p>
              <p className="text-blue-800 text-sm">
                您的聲調錯誤次數最多，建議多練習聲調變化。可以在下方「待加強字匯」中針對性練習。
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Tone Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg p-6"
        >
          <h3 className="text-gray-900 text-xl mb-4">聲調雷達圖</h3>
          <p className="text-gray-600 text-sm mb-6">Tone Accuracy Analysis</p>

          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64">
              {/* Pentagon radar background */}
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Grid circles */}
                {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
                  <polygon
                    key={i}
                    points="100,20 181,76 162,162 38,162 19,76"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    transform={`scale(${scale}) translate(${100 - 100 * scale}, ${100 - 100 * scale})`}
                  />
                ))}

                {/* Axis lines */}
                {['100,20', '181,76', '162,162', '38,162', '19,76'].map((point, i) => (
                  <line
                    key={i}
                    x1="100"
                    y1="100"
                    x2={point.split(',')[0]}
                    y2={point.split(',')[1]}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}

                {/* Data area */}
                <motion.polygon
                  points={[
                    `100,${100 - toneAccuracy.tone1 * 0.8}`,
                    `${100 + toneAccuracy.tone2 * 0.8 * Math.cos(-Math.PI / 10)},${100 - toneAccuracy.tone2 * 0.8 * Math.sin(-Math.PI / 10)}`,
                    `${100 + toneAccuracy.tone4 * 0.8 * Math.cos(Math.PI * 3 / 10)},${100 + toneAccuracy.tone4 * 0.8 * Math.sin(Math.PI * 3 / 10)}`,
                    `${100 - toneAccuracy.neutral * 0.8 * Math.cos(Math.PI * 3 / 10)},${100 + toneAccuracy.neutral * 0.8 * Math.sin(Math.PI * 3 / 10)}`,
                    `${100 - toneAccuracy.tone3 * 0.8 * Math.cos(-Math.PI / 10)},${100 - toneAccuracy.tone3 * 0.8 * Math.sin(-Math.PI / 10)}`,
                  ].join(' ')}
                  fill="rgba(59, 130, 246, 0.3)"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  style={{ transformOrigin: '100px 100px' }}
                />
              </svg>

              {/* Labels */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
                <span className="text-sm text-gray-700">一聲 {toneAccuracy.tone1}%</span>
              </div>
              <div className="absolute top-8 right-0 translate-x-8">
                <span className="text-sm text-gray-700">二聲 {toneAccuracy.tone2}%</span>
              </div>
              <div className="absolute bottom-8 right-0 translate-x-8">
                <span className="text-sm text-gray-700">四聲 {toneAccuracy.tone4}%</span>
              </div>
              <div className="absolute bottom-8 left-0 -translate-x-8">
                <span className="text-sm text-gray-700">輕聲 {toneAccuracy.neutral}%</span>
              </div>
              <div className="absolute top-8 left-0 -translate-x-12">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">三聲 {toneAccuracy.tone3}%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Accuracy Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-lg p-6"
        >
          <h3 className="text-gray-900 text-xl mb-4">正確率分布</h3>
          <p className="text-gray-600 text-sm mb-6">Accuracy Distribution</p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Pie Chart */}
            <div className="relative w-64 h-64">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                {(() => {
                  let currentAngle = 0;
                  return accuracyDistribution.map((item, index) => {
                    const startAngle = currentAngle;
                    const angle = (item.percentage / 100) * 360;
                    currentAngle += angle;
                    
                    // Calculate path for pie slice
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = ((startAngle + angle) * Math.PI) / 180;
                    const x1 = 100 + 90 * Math.cos(startRad);
                    const y1 = 100 + 90 * Math.sin(startRad);
                    const x2 = 100 + 90 * Math.cos(endRad);
                    const y2 = 100 + 90 * Math.sin(endRad);
                    const largeArc = angle > 180 ? 1 : 0;

                    return (
                      <motion.path
                        key={index}
                        d={`M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={item.color}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          delay: 0.5 + index * 0.1, 
                          duration: 0.6,
                          type: 'spring',
                          stiffness: 100 
                        }}
                        style={{ transformOrigin: '100px 100px' }}
                      />
                    );
                  })
                })()}
                
                {/* Center white circle */}
                <circle cx="100" cy="100" r="50" fill="white" />
                
                {/* Center text */}
                <text 
                  x="100" 
                  y="95" 
                  textAnchor="middle" 
                  className="text-2xl font-bold rotate-90"
                  fill="#1f2937"
                  transform="rotate(90 100 100)"
                >
                  75題
                </text>
                <text 
                  x="100" 
                  y="110" 
                  textAnchor="middle" 
                  className="text-sm rotate-90"
                  fill="#6b7280"
                  transform="rotate(90 100 100)"
                >
                  Total
                </text>
              </svg>
            </div>

            {/* Legend */}
            <div className="space-y-4">
              {accuracyDistribution.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-4 min-w-[200px]"
                >
                  <div 
                    className="w-6 h-6 rounded-lg flex-shrink-0 shadow-md"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-900 font-medium">{item.label}</span>
                      <span className="text-gray-500 text-sm">({item.englishLabel})</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-bold" style={{ color: item.color }}>
                        {item.percentage}%
                      </span>
                      <span className="text-gray-500 text-sm">({item.count} 題)</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-6 p-4 bg-green-50 rounded-2xl flex items-start gap-3"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl">🎯</span>
            </div>
            <div className="flex-1">
              <p className="text-green-900 font-medium mb-1">學習成果</p>
              <p className="text-green-800 text-sm">
                您的完全正確率達到 60%，表現良好！繼續保持，爭取突破 70%。
              </p>
            </div>
          </motion.div>

          {/* Detailed Question Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <button
              onClick={() => setShowWeakWords(!showWeakWords)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="text-gray-900 font-medium">查看部分正確與錯誤題目明細</span>
                </div>
                <span className="text-sm text-gray-500">
                  ({partiallyCorrectWords.length + incorrectWords.length} 題)
                </span>
              </div>
              {showWeakWords ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {showWeakWords && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-4"
              >
                {/* Partially Correct Words */}
                <div className="bg-yellow-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <h4 className="text-yellow-900 font-medium">部分正確 ({partiallyCorrectWords.length} 題)</h4>
                  </div>
                  <div className="space-y-3">
                    {partiallyCorrectWords.map((word, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl p-3"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xl font-bold">{word.character}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 whitespace-nowrap">您的發音:</span>
                                <span className="text-red-700 font-medium line-through text-sm">{word.userPinyin}</span>
                              </div>
                              <span className="text-gray-400 hidden sm:inline">→</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 whitespace-nowrap">正確:</span>
                                <span className="text-green-700 font-bold text-sm">{word.correctPinyin}</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600">
                              <span className="text-yellow-600">⚠</span> {word.issue}
                            </p>
                          </div>
                          <button
                            onClick={() => onPracticeWord(word.character)}
                            className="px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg text-xs transition-colors flex items-center gap-1 flex-shrink-0 w-full sm:w-auto justify-center"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>重練</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Incorrect Words */}
                <div className="bg-red-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <h4 className="text-red-900 font-medium">錯誤 ({incorrectWords.length} 題)</h4>
                  </div>
                  <div className="space-y-3">
                    {incorrectWords.map((word, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl p-3"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-400 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xl font-bold">{word.character}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 whitespace-nowrap">您的發音:</span>
                                <span className="text-red-700 font-medium line-through text-sm">{word.userPinyin}</span>
                              </div>
                              <span className="text-gray-400 hidden sm:inline">→</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 whitespace-nowrap">正確:</span>
                                <span className="text-green-700 font-bold text-sm">{word.correctPinyin}</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600">
                              <span className="text-red-600">✖</span> {word.issue}
                            </p>
                          </div>
                          <button
                            onClick={() => onPracticeWord(word.character)}
                            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs transition-colors flex items-center gap-1 flex-shrink-0 w-full sm:w-auto justify-center"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>重練</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Daily Practice Duration & Count Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-gray-900 text-xl mb-1">每日練習時長與次數</h3>
              <p className="text-gray-600 text-sm">Daily Practice Duration & Count</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{avgDuration} 分鐘</p>
              <p className="text-sm text-gray-500">平均時長</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">點擊日期查看詳情</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">練習強度:</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                <span className="text-xs text-gray-500">無</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-200 rounded"></div>
                <span className="text-xs text-gray-500">低</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span className="text-xs text-gray-500">中</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-800 rounded"></div>
                <span className="text-xs text-gray-500">高</span>
              </div>
            </div>
          </div>

          {/* Calendar Heatmap Grid */}
          <div className="mb-6">
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['日', '一', '二', '三', '四', '五', '六'].map((day, i) => (
                <div key={i} className="text-center text-xs text-gray-500 font-medium">{day}</div>
              ))}
            </div>

            {/* Calendar dates grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for first week offset (December 2024 starts on Sunday) */}
              {Array.from({ length: 0 }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}
              
              {/* Date cells */}
              {calendarData.map((dayData, index) => (
                <motion.button
                  key={dayData.date}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ scale: dayData.duration > 0 ? 1.05 : 1 }}
                  whileTap={{ scale: dayData.duration > 0 ? 0.95 : 1 }}
                  onClick={() => dayData.duration > 0 && setSelectedDate(selectedDate === dayData.date ? null : dayData.date)}
                  className={`
                    aspect-square rounded-lg flex flex-col items-center justify-center p-1
                    transition-all duration-200 border-2 overflow-hidden
                    ${selectedDate === dayData.date ? 'border-blue-600 shadow-lg' : 'border-transparent'}
                    ${dayData.duration > 0 ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}
                    ${getHeatmapColor(dayData.duration)}
                  `}
                >
                  <span className={`text-xs font-bold leading-none ${dayData.duration > 20 ? 'text-white' : dayData.duration > 0 ? 'text-blue-900' : 'text-gray-400'}`}>
                    {dayData.date}
                  </span>
                  {dayData.duration > 0 && (
                    <span className={`text-[10px] leading-none mt-0.5 ${dayData.duration > 20 ? 'text-blue-100' : 'text-blue-700'}`}>
                      {dayData.duration}'
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Detail Modal/Panel */}
          {selectedDate && (() => {
            const dayData = calendarData.find(d => d.date === selectedDate);
            if (!dayData || dayData.duration === 0) return null;
            
            return (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 mb-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-blue-900">
                        {dayData.day} - 12月{dayData.date}日
                      </h4>
                      <p className="text-sm text-blue-700">練習詳情</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="w-8 h-8 hover:bg-white/50 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-blue-700" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Duration Card */}
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600">練習時長</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{dayData.duration}</p>
                    <p className="text-sm text-gray-500 mt-1">分鐘</p>
                  </div>

                  {/* Count Card */}
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600">練習次數</span>
                    </div>
                    <p className="text-3xl font-bold text-green-600">{dayData.count}</p>
                    <p className="text-sm text-gray-500 mt-1">次</p>
                  </div>
                </div>

                {/* Progress bar comparison */}
                <div className="mt-4 p-4 bg-white rounded-xl">
                  <p className="text-sm text-gray-600 mb-3">與平均值對比</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">時長</span>
                        <span className="text-blue-600 font-medium">
                          {dayData.duration >= avgDuration ? '+' : ''}{dayData.duration - avgDuration} 分鐘
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${Math.min((dayData.duration / 30) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">次數</span>
                        <span className="text-green-600 font-medium">{dayData.count} / 15</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600 rounded-full transition-all"
                          style={{ width: `${Math.min((dayData.count / 15) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })()}

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-gray-200"
          >
            <div className="p-4 bg-blue-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-blue-600">{totalDuration}</p>
              <p className="text-sm text-gray-600 mt-1">總時長 (分)</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-green-600">{dailyPracticeData.reduce((sum, d) => sum + d.count, 0)}</p>
              <p className="text-sm text-gray-600 mt-1">總練習次數</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-purple-600">{dailyPracticeData.length}</p>
              <p className="text-sm text-gray-600 mt-1">連續學習天數</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Weakness Words List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-lg p-6"
        >
          <h3 className="text-gray-900 text-xl mb-2">待加強字匯</h3>
          <p className="text-gray-600 text-sm mb-6">Needs Practice</p>

          <div className="space-y-3">
            {weakWords.map((word, index) => (
              <motion.div
                key={word.character}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">{word.character}</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{word.pinyin}</p>
                  <p className="text-gray-500 text-sm">錯誤 {word.errorCount} 次</p>
                </div>
                <motion.button
                  onClick={() => onPracticeWord(word.character)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>單字重練</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}