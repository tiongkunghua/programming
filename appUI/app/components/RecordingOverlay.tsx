import { motion, AnimatePresence } from 'motion/react';
import { Square } from 'lucide-react';
import React from 'react';

interface RecordingOverlayProps {
  onComplete: (recognizedText: string) => void;
}

export function RecordingOverlay({ onComplete }: RecordingOverlayProps) {
  const [countdown, setCountdown] = React.useState(3);
  const [isRecording, setIsRecording] = React.useState(false);
  const [waveformHeights, setWaveformHeights] = React.useState<number[]>(
    Array(30).fill(0)
  );

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsRecording(true);
      
      // Simulate waveform animation
      const interval = setInterval(() => {
        setWaveformHeights(prev =>
          prev.map(() => Math.random() * 100)
        );
      }, 100);

      // Auto-complete after 3 seconds
      const autoComplete = setTimeout(() => {
        clearInterval(interval);
        onComplete('媽'); // Simulated recognition result
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(autoComplete);
      };
    }
  }, [countdown, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <AnimatePresence mode="wait">
        {countdown > 0 ? (
          /* Countdown */
          <motion.div
            key="countdown"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-center"
          >
            <motion.div
              className="text-white text-9xl"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 0.5 }}
            >
              {countdown}
            </motion.div>
          </motion.div>
        ) : (
          /* Recording */
          <motion.div
            key="recording"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg px-6"
          >
            {/* Instruction text */}
            <motion.div
              className="text-center mb-8"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="text-white text-3xl mb-2">請大聲朗讀！</p>
              <p className="text-white/80 text-lg">Speak clearly into the microphone</p>
            </motion.div>

            {/* Waveform */}
            <div className="bg-gray-900/50 rounded-3xl p-8 backdrop-blur-md border border-white/10">
              <div className="flex items-end justify-center gap-1 h-32">
                {waveformHeights.map((height, index) => (
                  <motion.div
                    key={index}
                    className="w-2 bg-gradient-to-t from-red-500 to-pink-400 rounded-full"
                    style={{
                      height: `${height}%`,
                      minHeight: '8px',
                    }}
                    animate={{
                      height: `${height}%`,
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 0.3,
                      opacity: {
                        duration: 1,
                        repeat: Infinity,
                        delay: index * 0.05,
                      },
                    }}
                  />
                ))}
              </div>

              {/* Recording indicator */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <motion.div
                  className="w-3 h-3 bg-red-500 rounded-full"
                  animate={{
                    opacity: [1, 0.3, 1],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
                <span className="text-white/90 text-sm">錄音中...</span>
              </div>
            </div>

            {/* Stop button */}
            <motion.button
              onClick={() => onComplete('媽')}
              className="mt-8 w-full flex items-center justify-center gap-3 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md border border-white/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Square className="w-5 h-5" />
              <span>停止錄音</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
