import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, AlertTriangle, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/layout/BottomNav";

const errorTypeData = [
  { name: "聲調", count: 45, fill: "hsl(var(--coral))" },
  { name: "聲母", count: 28, fill: "hsl(var(--warning))" },
  { name: "韻母", count: 15, fill: "hsl(var(--gold))" },
];

const toneRadarData = [
  { tone: "一聲", accuracy: 85, fullMark: 100 },
  { tone: "二聲", accuracy: 72, fullMark: 100 },
  { tone: "三聲", accuracy: 58, fullMark: 100 },
  { tone: "四聲", accuracy: 78, fullMark: 100 },
  { tone: "輕聲", accuracy: 65, fullMark: 100 },
];

const accuracyData = [
  { name: "完美", value: 45, color: "hsl(var(--success))" },
  { name: "部分", value: 35, color: "hsl(var(--gold))" },
  { name: "需改進", value: 20, color: "hsl(var(--coral))" },
];

const dailyActivityData = [
  { day: "一", duration: 15, count: 25 },
  { day: "二", duration: 20, count: 35 },
  { day: "三", duration: 10, count: 18 },
  { day: "四", duration: 25, count: 42 },
  { day: "五", duration: 30, count: 50 },
  { day: "六", duration: 12, count: 20 },
  { day: "日", duration: 18, count: 30 },
];

const weaknessList = [
  { pinyin: "zhī / zhǐ / zhì", description: "zh 聲母混淆", severity: "high" },
  { pinyin: "ān / áng", description: "前後鼻音", severity: "medium" },
  { pinyin: "第三聲調", description: "調值不到位", severity: "high" },
];

export const Analytics = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header
        className="px-6 pt-12 pb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground chinese-text">
          學習分析
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          查看你的發音進步情況
        </p>
      </motion.header>

      <div className="px-6 space-y-5">
        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card className="bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">78%</p>
              <p className="text-xs text-muted-foreground">整體準確率</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-success">+12%</p>
              <p className="text-xs text-muted-foreground">本週進步</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">156</p>
              <p className="text-xs text-muted-foreground">總練習次數</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Error Type Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-coral" />
                錯誤類型分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={errorTypeData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    width={40}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[0, 8, 8, 0]}
                    animationDuration={1000}
                    animationBegin={300}
                  >
                    {errorTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tone Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                聲調雷達圖
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={toneRadarData}>
                  <PolarGrid
                    stroke="hsl(var(--border))"
                    strokeDasharray="3 3"
                  />
                  <PolarAngleAxis
                    dataKey="tone"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Radar
                    name="準確率"
                    dataKey="accuracy"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    animationDuration={1000}
                    animationBegin={400}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <p className="text-center text-xs text-muted-foreground mt-2">
                💡 第三聲需要加強練習
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Accuracy Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                準確度分佈
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={accuracyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={1000}
                    animationBegin={500}
                  >
                    {accuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    formatter={(value: string) => (
                      <span className="text-sm text-muted-foreground">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                每日活動
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={dailyActivityData}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis hide />
                  <Bar
                    dataKey="duration"
                    name="時間(分)"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1000}
                    animationBegin={600}
                  />
                  <Bar
                    dataKey="count"
                    name="次數"
                    fill="hsl(var(--success))"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1000}
                    animationBegin={700}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-primary" />
                  <span className="text-xs text-muted-foreground">
                    時間(分)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-success" />
                  <span className="text-xs text-muted-foreground">練習次數</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weakness List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                弱點清單
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weaknessList.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {item.pinyin}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8 px-3"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    快速練習
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};
