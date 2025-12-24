import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Target,
  Sparkles,
  Check,
  Circle,
  CheckCircle2,
  Play,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/layout/BottomNav";

const initialMissions = [
  { id: 1, text: "完成 5 次練習", completed: true },
  { id: 2, text: "練習第三聲調", completed: true },
  { id: 3, text: "使用學習報表", completed: false },
];

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "早安";
  if (hour < 18) return "午安";
  return "晚安";
};

export const HomeDashboard = () => {
  const navigate = useNavigate();
  const [missions, setMissions] = useState(initialMissions);
  
  const completedCount = missions.filter((m) => m.completed).length;
  const progress = (completedCount / missions.length) * 100;
  const isComplete = progress === 100;

  const toggleMission = (id: number) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        className="px-6 pt-12 pb-6 flex-shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground chinese-text">
              {getTimeGreeting()}，小明
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              繼續保持你的練習節奏！
            </p>
          </div>
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20"
            whileHover={{ scale: 1.05 }}
          >
            <Flame className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold text-warning">5 天</span>
          </motion.div>
        </div>
      </motion.header>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 space-y-5 pb-40">
        {/* Daily Mission Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card
            className={`overflow-hidden transition-all duration-500 ${
              isComplete
                ? "bg-gradient-to-br from-gold/10 to-warning/5 border-gold/30"
                : "bg-card"
            }`}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target
                    className={`w-5 h-5 ${
                      isComplete ? "text-gold" : "text-primary"
                    }`}
                  />
                  <h3 className="font-semibold text-foreground">每日任務</h3>
                </div>
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="4"
                    />
                    <motion.circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke={isComplete ? "hsl(var(--gold))" : "hsl(var(--primary))"}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={125.6}
                      initial={{ strokeDashoffset: 125.6 }}
                      animate={{ strokeDashoffset: 125.6 - (progress / 100) * 125.6 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                    {completedCount}/{missions.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {missions.map((mission, index) => (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    onClick={() => toggleMission(mission.id)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-muted/30 rounded-lg p-2 -m-2 transition-colors"
                  >
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className="flex-shrink-0"
                    >
                      {mission.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </motion.div>
                    <span
                      className={`text-sm transition-all duration-200 ${
                        mission.completed
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}
                    >
                      {mission.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Mission Complete Badge */}
              <AnimatePresence>
                {isComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="mt-4 flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-gold/20 border border-gold/30"
                  >
                    <Trophy className="w-4 h-4 text-gold" />
                    <span className="text-sm font-semibold text-gold">任務完成！</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Suggestion Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden gradient-primary border-0">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary-foreground mb-1">
                    AI 學習建議
                  </h3>
                  <p className="text-sm text-primary-foreground/80">
                    今天重點加強：<span className="font-bold">第三聲調</span>
                  </p>
                  <p className="text-xs text-primary-foreground/60 mt-2">
                    根據你的發音分析，第三聲的準確度可以再提升
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-xs text-muted-foreground">本週進步</span>
              </div>
              <p className="text-2xl font-bold text-foreground">+12%</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">準確率</span>
              </div>
              <p className="text-2xl font-bold text-foreground">78%</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Hero Action Button */}
      <motion.div
        className="fixed bottom-24 left-0 right-0 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => navigate("/practice")}
            className="w-full h-14 text-lg font-semibold gradient-primary border-0 shadow-glow animate-breathe"
            style={{ animationDuration: '3.5s', animationTimingFunction: 'ease-in-out' }}
          >
            <Play className="w-5 h-5 mr-2" />
            開始練習
          </Button>
        </motion.div>
      </motion.div>

      <BottomNav />
    </div>
  );
};
