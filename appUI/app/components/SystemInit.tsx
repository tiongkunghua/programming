import React from 'react';
import { motion } from 'motion/react';
import { Check, RefreshCw } from 'lucide-react';

interface SystemInitProps {
  onComplete: () => void;
}

export function SystemInit({ onComplete }: SystemInitProps) {
  const [stage, setStage] = React.useState<'scanning' | 'testing' | 'success'>('scanning');
  const [frequency, setFrequency] = React.useState('44.1kHz');
  const [envQuality, setEnvQuality] = React.useState<'quiet' | 'noisy'>('quiet');

  React.useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage('testing');
      
      const freqInterval = setInterval(() => {
        setFrequency(prev => prev === '44.1kHz' ? '48kHz' : '44.1kHz');
      }, 800);

      const timer2 = setTimeout(() => {
        clearInterval(freqInterval);
        setFrequency('48kHz');
        // Randomly set environment quality for demo
        setEnvQuality(Math.random() > 0.3 ? 'quiet' : 'noisy');
        setStage('success');
        
        const timer3 = setTimeout(() => {
          onComplete();
        }, 2500);

        return () => clearTimeout(timer3);
      }, 3000);

      return () => {
        clearInterval(freqInterval);
        clearTimeout(timer2);
      };
    }, 1500);

    return () => clearTimeout(timer1);
  }, [onComplete]);

  const handleRecalibrate = () => {
    setStage('scanning');
    setFrequency('44.1kHz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center relative">
      <div className="flex flex-col items-center gap-8">
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-white text-5xl mb-2">聲韻大師</h1>
          <p className="text-blue-100 text-xl">Pinyin Master</p>
        </motion.div>

        {stage !== 'success' ? (
          <>
            {/* Radar Animation */}
            <div className="relative w-64 h-64">
              {/* Outer circles */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 border-2 border-blue-300/30 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.2],
                    opacity: [0.6, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: 'easeOut',
                  }}
                />
              ))}

              {/* Center pulse */}
              <motion.div
                className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full shadow-lg shadow-blue-400/50"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 20px rgba(96, 165, 250, 0.5)',
                    '0 0 40px rgba(96, 165, 250, 0.8)',
                    '0 0 20px rgba(96, 165, 250, 0.5)',
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <motion.div
                    className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </motion.div>

              {/* Scanning line */}
              <motion.div
                className="absolute inset-0 m-auto w-1 h-32 bg-gradient-to-b from-transparent via-blue-300 to-transparent origin-bottom"
                style={{ transformOrigin: 'center' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* Status text */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-white text-xl mb-2">
                {stage === 'scanning' ? '正在掃描音訊裝置' : '麥克風頻率校正'}
              </p>
              <p className="text-white/90">
                {stage === 'scanning' ? 'Scanning Audio Devices...' : `${frequency} 鎖定`}
              </p>
            </motion.div>

            {/* Environment Quality Indicator */}
            {stage === 'testing' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20"
              >
                <motion.div
                  className={`w-3 h-3 rounded-full ${envQuality === 'quiet' ? 'bg-green-400' : 'bg-orange-400'}`}
                  animate={{
                    opacity: [1, 0.5, 1],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <p className="text-white/90 text-sm">
                  檢測環境品質...
                </p>
              </motion.div>
            )}
          </>
        ) : (
          /* Success state */
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div
              className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-2xl"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(34, 197, 94, 0.4)',
                  '0 0 0 20px rgba(34, 197, 94, 0)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Check className="w-20 h-20 text-white" strokeWidth={3} />
            </motion.div>
            
            <div className="text-center">
              <p className="text-white text-2xl mb-1">設備優化完成</p>
              <p className="text-blue-100 text-lg">Device Optimized</p>
            </div>

            {/* Environment Quality Final Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`flex items-center gap-3 px-6 py-3 rounded-full ${
                envQuality === 'quiet' 
                  ? 'bg-green-500/20 border border-green-400/30' 
                  : 'bg-orange-500/20 border border-orange-400/30'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${envQuality === 'quiet' ? 'bg-green-400' : 'bg-orange-400'}`} />
              <p className="text-white text-sm">
                {envQuality === 'quiet' 
                  ? '🟢 環境安靜，適合練習 (Quiet Environment)'
                  : '🟠 背景稍吵，請靠近麥克風'}
              </p>
            </motion.div>

            <motion.button
              className="px-8 py-4 bg-white text-blue-600 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
            >
              開始練習
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Recalibrate Button - Bottom Right */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        whileHover={{ opacity: 1 }}
        onClick={handleRecalibrate}
        className="absolute bottom-8 right-8 flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        <span>重新檢測裝置</span>
      </motion.button>
    </div>
  );
}