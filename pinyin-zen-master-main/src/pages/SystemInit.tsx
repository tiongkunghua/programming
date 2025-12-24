import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Check, Volume2 } from "lucide-react";

const statusMessages = [
  "正在掃描音訊設備...",
  "測試 44.1kHz...",
  "測試 48kHz...",
  "已鎖定: 48kHz",
];

const trafficLightStates = [
  { color: "bg-muted", label: "檢測中..." },
  { color: "bg-warning", label: "環境偵測中..." },
  { color: "bg-success", label: "環境安靜 (適合練習)" },
];

export const SystemInit = () => {
  const navigate = useNavigate();
  const [statusIndex, setStatusIndex] = useState(0);
  const [trafficState, setTrafficState] = useState(0);
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    // Cycle through status messages
    const statusTimer = setInterval(() => {
      setStatusIndex((prev) => {
        if (prev < statusMessages.length - 1) return prev + 1;
        return prev;
      });
    }, 800);

    // Traffic light progression
    const trafficTimer = setTimeout(() => {
      setTrafficState(1);
      setTimeout(() => setTrafficState(2), 1000);
    }, 1500);

    // Navigate after complete
    const navTimer = setTimeout(() => {
      navigate("/home");
    }, 4000);

    // Pulse animation counter
    const pulseTimer = setInterval(() => {
      setPulseCount((prev) => prev + 1);
    }, 2000);

    return () => {
      clearInterval(statusTimer);
      clearTimeout(trafficTimer);
      clearTimeout(navTimer);
      clearInterval(pulseTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

      {/* Radar Animation Container */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-12">
        {/* Outer pulse rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`pulse-${i}-${pulseCount}`}
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{
              duration: 2,
              delay: i * 0.6,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Radar scan line */}
        <motion.div
          className="absolute w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left gradient-primary opacity-60" />
        </motion.div>

        {/* Inner glow circle */}
        <motion.div
          className="absolute w-32 h-32 rounded-full gradient-primary opacity-20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Center icon */}
        <motion.div
          className="relative z-10 w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-glow"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <Mic className="w-10 h-10 text-primary-foreground" />
        </motion.div>
      </div>

      {/* Status Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={statusIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center mb-8"
        >
          <p className="text-lg font-medium text-foreground">
            {statusMessages[statusIndex]}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Traffic Light Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-500 ${
                trafficState >= i
                  ? i === 2
                    ? "bg-success shadow-[0_0_12px_hsl(var(--success))]"
                    : i === 1
                    ? "bg-warning shadow-[0_0_12px_hsl(var(--warning))]"
                    : "bg-muted-foreground"
                  : "bg-muted"
              }`}
              animate={trafficState === i ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={trafficState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            {trafficState === 2 && (
              <Check className="w-4 h-4 text-success" />
            )}
            <span
              className={`text-sm font-medium ${
                trafficState === 2 ? "text-success" : "text-muted-foreground"
              }`}
            >
              {trafficLightStates[trafficState].label}
            </span>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* App Title */}
      <motion.div
        className="absolute top-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gradient chinese-text">
          聲韻大師
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Pinyin Master</p>
      </motion.div>

      {/* Volume indicator */}
      <motion.div
        className="absolute bottom-8 flex items-center gap-2 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Volume2 className="w-4 h-4" />
        <span className="text-xs">系統初始化中...</span>
      </motion.div>
    </div>
  );
};
