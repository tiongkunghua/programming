import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Volume2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/layout/BottomNav";

const practiceCards = [
  {
    id: 1,
    character: "媽",
    pinyin: "mā",
    tone: 1,
    initial: "m",
    final: "a",
    meaning: "mother",
    toneDescription: "高平調 (1st)",
  },
  {
    id: 2,
    character: "麻",
    pinyin: "má",
    tone: 2,
    initial: "m",
    final: "a",
    meaning: "hemp",
    toneDescription: "升調 (2nd)",
  },
  {
    id: 3,
    character: "馬",
    pinyin: "mǎ",
    tone: 3,
    initial: "m",
    final: "a",
    meaning: "horse",
    toneDescription: "降升調 (3rd)",
  },
  {
    id: 4,
    character: "罵",
    pinyin: "mà",
    tone: 4,
    initial: "m",
    final: "a",
    meaning: "scold",
    toneDescription: "降調 (4th)",
  },
];

type RecordingState = "idle" | "countdown" | "recording" | "processing" | "result";
type ResultType = "success" | "fail";

const playAudio = (text: string) => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8; // Slightly slower for learning
    utterance.pitch = 1;
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.error('Web Speech API is not supported in this browser');
  }
};

export const Practice = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [countdown, setCountdown] = useState(3);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [result, setResult] = useState<ResultType | null>(null);
  const [showResultSheet, setShowResultSheet] = useState(false);

  const currentCard = practiceCards[currentIndex];

  const getToneCurve = (tone: number) => {
    switch (tone) {
      case 1:
        return "M 0 30 L 100 30";
      case 2:
        return "M 0 60 Q 50 40 100 20";
      case 3:
        return "M 0 30 Q 30 50 50 60 Q 70 50 100 20";
      case 4:
        return "M 0 20 L 100 60";
      default:
        return "M 0 40 L 100 40";
    }
  };

  const startRecording = () => {
    setRecordingState("countdown");
    setCountdown(3);
  };

  useEffect(() => {
    if (recordingState === "countdown" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (recordingState === "countdown" && countdown === 0) {
      setRecordingState("recording");
    }
  }, [recordingState, countdown]);

  useEffect(() => {
    if (recordingState === "recording") {
      // Simulate volume changes
      const volumeInterval = setInterval(() => {
        setVolumeLevel(Math.random() * 100);
      }, 100);

      // Stop after 2 seconds
      const stopTimer = setTimeout(() => {
        clearInterval(volumeInterval);
        setRecordingState("processing");
      }, 2000);

      return () => {
        clearInterval(volumeInterval);
        clearTimeout(stopTimer);
      };
    }
  }, [recordingState]);

  useEffect(() => {
    if (recordingState === "processing") {
      const timer = setTimeout(() => {
        // Randomly succeed or fail for demo
        const success = Math.random() > 0.4;
        setResult(success ? "success" : "fail");
        setRecordingState("result");
        setShowResultSheet(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [recordingState]);

  const resetRecording = () => {
    setRecordingState("idle");
    setResult(null);
    setShowResultSheet(false);
    setVolumeLevel(0);
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % practiceCards.length);
    resetRecording();
  };

  const prevCard = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + practiceCards.length) % practiceCards.length
    );
    resetRecording();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground chinese-text">
            發音練習
          </h1>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {practiceCards.length}
          </span>
        </div>
      </header>

      {/* Practice Card */}
      <div className="px-6">
        <motion.div
          key={currentCard.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="relative overflow-hidden bg-card border-border">
            {/* Tone curve watermark */}
            <svg
              className="absolute inset-0 w-full h-full opacity-5"
              viewBox="0 0 100 80"
              preserveAspectRatio="none"
            >
              <path
                d={getToneCurve(currentCard.tone)}
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            <CardContent className="p-8 relative z-10">
              {/* Character */}
              <div className="text-center mb-6">
                <motion.p
                  className="text-8xl font-bold text-foreground chinese-text mb-4"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {currentCard.character}
                </motion.p>
                <p className="text-3xl font-medium text-primary">
                  {currentCard.pinyin}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {currentCard.meaning}
                </p>
              </div>

              {/* Tags */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                  聲母: {currentCard.initial}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                  韻母: {currentCard.final}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {currentCard.toneDescription}
                </span>
              </div>

              {/* Play pronunciation button */}
              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground"
                  onClick={() => playAudio(currentCard.character)}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  播放發音
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation arrows */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevCard}
            disabled={recordingState !== "idle"}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex gap-2">
            {practiceCards.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextCard}
            disabled={recordingState !== "idle"}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Microphone Button */}
      <div className="fixed bottom-32 left-0 right-0 flex justify-center">
        <motion.div className="relative">
          {/* Halo effect during recording */}
          <AnimatePresence>
            {recordingState === "recording" && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full bg-coral"
                    initial={{ scale: 1, opacity: 0.3 }}
                    animate={{
                      scale: 1 + (volumeLevel / 100) * 0.5 + i * 0.2,
                      opacity: 0.3 - i * 0.1,
                    }}
                    exit={{ scale: 1, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          <motion.button
            onClick={recordingState === "idle" ? startRecording : undefined}
            disabled={recordingState !== "idle"}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
              recordingState === "recording"
                ? "gradient-coral shadow-coral"
                : recordingState === "idle"
                ? "gradient-primary shadow-glow"
                : "bg-muted"
            }`}
            whileTap={recordingState === "idle" ? { scale: 0.95 } : {}}
            animate={
              recordingState === "idle"
                ? {
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 0 0 hsl(var(--primary) / 0.4)",
                      "0 0 0 20px hsl(var(--primary) / 0)",
                      "0 0 0 0 hsl(var(--primary) / 0)",
                    ],
                  }
                : {}
            }
            transition={
              recordingState === "idle"
                ? { duration: 2, repeat: Infinity }
                : {}
            }
          >
            {recordingState === "processing" ? (
              <motion.div
                className="w-6 h-6 border-2 border-muted-foreground border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <Mic
                className={`w-8 h-8 ${
                  recordingState === "recording"
                    ? "text-coral-foreground"
                    : "text-primary-foreground"
                }`}
              />
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Countdown Overlay */}
      <AnimatePresence>
        {recordingState === "countdown" && (
          <motion.div
            className="fixed inset-0 bg-foreground/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              key={countdown}
              className="text-8xl font-bold text-background"
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {countdown}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Bottom Sheet */}
      <AnimatePresence>
        {showResultSheet && (
          <>
            <motion.div
              className="fixed inset-0 bg-foreground/20 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResultSheet(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-lg"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-6 pb-32">
                {/* Handle */}
                <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />

                {result === "success" ? (
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="w-16 h-16 rounded-full gradient-success flex items-center justify-center mx-auto mb-4"
                    >
                      <Check className="w-8 h-8 text-success-foreground" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-success mb-2">
                      🎉 完美！
                    </h3>
                    <p className="text-muted-foreground">
                      發音準確，繼續保持！
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-center mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.1 }}
                        className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-4"
                      >
                        <AlertCircle className="w-8 h-8 text-warning" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-warning mb-2">
                        🤔 再試一次
                      </h3>
                    </div>

                    {/* Comparison */}
                    <div className="bg-secondary rounded-xl p-4 mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <span className="text-xs text-muted-foreground">
                            目標發音
                          </span>
                          <p className="text-2xl font-bold text-success">
                            {currentCard.pinyin}
                          </p>
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-muted-foreground">
                            AI 聽到
                          </span>
                          <p className="text-2xl font-bold text-coral">
                            m{currentCard.tone === 1 ? "á" : "ā"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Error tags */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="px-3 py-1 rounded-full bg-coral/10 text-coral text-sm font-medium">
                        聲調錯誤
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={resetRecording}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    重試
                  </Button>
                  {result === "success" && (
                    <Button
                      className="flex-1 gradient-primary border-0"
                      onClick={nextCard}
                    >
                      下一個
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};
