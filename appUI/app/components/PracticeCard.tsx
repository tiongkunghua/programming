import { motion } from 'motion/react';
import { Volume2, Mic, X } from 'lucide-react';
import React from 'react';
import { speak } from '../utils/speech';

interface PinyinData {
  character: string;
  pinyin: string;
  initial: string;  // 聲母
  final: string;    // 韻母
  tone: string;
}

interface PracticeCardProps {
  data: PinyinData;
  onStartRecording: () => void;
  onDemo: () => void;
  onExit?: () => void;
  volumeLevel?: number; // 0-100
}

// Tone curve paths for background watermark
const toneCurves: Record<string, string> = {
  '1': 'M 20 50 L 180 50', // Flat line - first tone
  '2': 'M 20 70 Q 100 30 180 40', // Rising - second tone
  '3': 'M 20 50 Q 70 80 100 70 Q 130 30 180 40', // Dip then rise - third tone (checkmark)
  '4': 'M 20 30 L 180 90', // Falling - fourth tone
  '0': 'M 20 60 L 180 60', // Neutral tone
};

export function PracticeCard({ data, onStartRecording, onDemo, onExit, volumeLevel = 0 }: PracticeCardProps) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [micVolume, setMicVolume] = React.useState(0);
  const [isPlayingDemo, setIsPlayingDemo] = React.useState(false);

  // Simulate volume changes for demo
  React.useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setMicVolume(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setMicVolume(0);
    }
  }, [isRecording]);

  const handleMicClick = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      onStartRecording();
    }
  };

  const handleDemoClick = () => {
    setIsPlayingDemo(true);
    // Speak the character using browser TTS
    speak(data.character, { rate: 0.8 }); // Slower rate for learning
    onDemo();
    
    // Reset playing state after a delay
    setTimeout(() => {
      setIsPlayingDemo(false);
    }, 1500);
  };

  // Determine volume status color
  const getVolumeColor = () => {
    if (micVolume < 30) return 'gray'; // Too quiet
    if (micVolume > 80) return 'orange'; // Too loud
    return 'red'; // Perfect
  };

  const volumeColor = getVolumeColor();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Exit Button */}
        {onExit && (
          <motion.button
            onClick={onExit}
            className="mb-4 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-full shadow-md flex items-center gap-2 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5" />
            <span>退出練習</span>
          </motion.button>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-gray-800 text-3xl mb-2">拼音練習</h2>
          <p className="text-gray-600">Pinyin Practice</p>
        </div>

        {/* Main Card */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-12 relative overflow-hidden"
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          {/* Tone Curve Watermark - Background */}
          <svg
            className="absolute inset-0 w-full h-full opacity-5 pointer-events-none"
            viewBox="0 0 200 100"
            preserveAspectRatio="none"
          >
            <path
              d={toneCurves[data.tone] || toneCurves['1']}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className="text-gray-900"
            />
          </svg>

          {/* Pinyin */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6 relative z-10"
          >
            <p className="text-blue-600 text-5xl tracking-wider">{data.pinyin}</p>
          </motion.div>

          {/* Chinese Character */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-center mb-8 relative z-10"
          >
            <p className="text-gray-900 text-9xl">{data.character}</p>
          </motion.div>

          {/* Structure Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-4 mb-10 relative z-10"
          >
            <div className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-md">
              <span className="opacity-80 text-sm">聲母:</span>{' '}
              <span className="text-lg">{data.initial || 'ø'}</span>
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full shadow-md">
              <span className="opacity-80 text-sm">韻母:</span>{' '}
              <span className="text-lg">{data.final}</span>
            </div>
          </motion.div>

          {/* Demo Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mb-8 relative z-10"
          >
            <motion.button
              onClick={handleDemoClick}
              disabled={isPlayingDemo}
              className={`w-20 h-20 rounded-full shadow-lg flex items-center justify-center group relative ${
                isPlayingDemo 
                  ? 'bg-blue-400' 
                  : 'bg-gradient-to-br from-blue-500 to-blue-600'
              }`}
              whileHover={{ scale: isPlayingDemo ? 1 : 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={isPlayingDemo ? {
                scale: [1, 1.1, 1],
              } : {}}
              transition={{
                scale: {
                  duration: 0.5,
                  repeat: isPlayingDemo ? Infinity : 0,
                }
              }}
            >
              <Volume2 className="w-10 h-10 text-white" />
              <motion.div
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
              >
                示範 Demo
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Record Button with Volume Halo */}
          <motion.div className="relative flex justify-center">
            {/* Volume Sensing Halo */}
            {isRecording && (
              <motion.div
                className="absolute inset-0 m-auto rounded-full"
                style={{
                  width: `${80 + micVolume * 0.5}px`,
                  height: `${80 + micVolume * 0.5}px`,
                  border: volumeColor === 'gray' ? '3px solid #9ca3af' :
                         volumeColor === 'red' ? '3px solid #ef4444' :
                         '3px solid #f97316',
                  filter: volumeColor === 'orange' ? 'blur(2px)' : 'none',
                }}
                animate={{
                  scale: volumeColor === 'orange' ? [1, 1.2, 1] : 1,
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                }}
              />
            )}

            <motion.button
              onClick={handleMicClick}
              className={`w-20 h-20 rounded-full shadow-lg flex items-center justify-center relative z-10 transition-all ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gradient-to-r from-coral-500 to-red-500 hover:shadow-xl'
              }`}
              style={{ 
                background: isRecording ? undefined : 'linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%)' 
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mic className="w-10 h-10 text-white" />
            </motion.button>
          </motion.div>

          <p className="text-center text-gray-600 text-sm mt-4 relative z-10">
            {isRecording ? '錄音中...' : '點擊麥克風開始錄音'}
          </p>
        </motion.div>

        {/* Progress indicator */}
        <div className="text-center mt-6 text-gray-500">
          <p className="text-sm">練習進度 1/10</p>
        </div>
      </motion.div>
    </div>
  );
}