import { motion } from "framer-motion";
import { Mic, Volume2, Bell, Eye, Gauge, RotateCcw, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/layout/BottomNav";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    showToneCurve: true,
    slowTTS: false,
    dailyReminder: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success("設定已更新");
  };

  const handleRecalibrate = () => {
    toast.info("正在重新校準麥克風...");
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header
        className="px-6 pt-12 pb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground chinese-text">
          設定
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          自訂你的學習體驗
        </p>
      </motion.header>

      <div className="px-6 space-y-5">
        {/* Display Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            顯示設定
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">顯示聲調曲線</p>
                    <p className="text-xs text-muted-foreground">
                      在練習卡片上顯示聲調走勢
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.showToneCurve}
                  onCheckedChange={() => toggleSetting("showToneCurve")}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Audio Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            音訊設定
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Gauge className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">慢速語音</p>
                    <p className="text-xs text-muted-foreground">
                      放慢 TTS 語音播放速度
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.slowTTS}
                  onCheckedChange={() => toggleSetting("slowTTS")}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            通知設定
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">每日提醒</p>
                    <p className="text-xs text-muted-foreground">
                      每天推送練習提醒通知
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.dailyReminder}
                  onCheckedChange={() => toggleSetting("dailyReminder")}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Microphone Calibration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            系統設定
          </h2>
          <Card>
            <CardContent className="p-4">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4"
                onClick={handleRecalibrate}
              >
                <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center mr-3">
                  <Mic className="w-5 h-5 text-coral" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">重新校準麥克風</p>
                  <p className="text-xs text-muted-foreground">
                    重新掃描並校準音訊設備
                  </p>
                </div>
                <RotateCcw className="w-4 h-4 ml-auto text-muted-foreground" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-secondary/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Info className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">聲韻大師 v1.0.0</p>
                  <p className="text-xs">Pinyin Master</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};
