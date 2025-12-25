import React from 'react';
import { SystemInit } from './components/SystemInit';
import { HomeDashboard } from './components/HomeDashboard';
import { PracticeCard } from './components/PracticeCard';
import { RecordingOverlay } from './components/RecordingOverlay';
import { ResultPanel } from './components/ResultPanel';
import { AnalyticsPage } from './components/AnalyticsPage';
import { SettingsPage } from './components/SettingsPage';
import { AnimatePresence } from 'motion/react';
import { loadVoices } from './utils/speech';

type AppStage = 'init' | 'home' | 'practice' | 'recording' | 'result' | 'analytics' | 'settings';

interface PinyinData {
  character: string;
  pinyin: string;
  initial: string;
  final: string;
  tone: string;
}

// Sample practice data
const practiceData: PinyinData[] = [
  { character: '媽', pinyin: 'mā', initial: 'm', final: 'a', tone: '1' },
  { character: '麻', pinyin: 'má', initial: 'm', final: 'a', tone: '2' },
  { character: '馬', pinyin: 'mǎ', initial: 'm', final: 'a', tone: '3' },
  { character: '罵', pinyin: 'mà', initial: 'm', final: 'a', tone: '4' },
  { character: '吧', pinyin: 'ba', initial: 'b', final: 'a', tone: '0' },
  { character: '爸', pinyin: 'bà', initial: 'b', final: 'a', tone: '4' },
  { character: '打', pinyin: 'dǎ', initial: 'd', final: 'a', tone: '3' },
  { character: '大', pinyin: 'dà', initial: 'd', final: 'a', tone: '4' },
  { character: '他', pinyin: 'tā', initial: 't', final: 'a', tone: '1' },
  { character: '她', pinyin: 'tā', initial: 't', final: 'a', tone: '1' },
];

// Error types for simulation
const errorTypes: Array<'tone' | 'initial' | 'final' | null> = ['tone', 'initial', 'final', null];

export default function App() {
  const [stage, setStage] = React.useState<AppStage>('init');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [recognizedText, setRecognizedText] = React.useState('');
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [errorType, setErrorType] = React.useState<'tone' | 'initial' | 'final' | null>(null);
  const [wasAmplified, setWasAmplified] = React.useState(false);

  // Load speech synthesis voices on mount
  React.useEffect(() => {
    loadVoices();
  }, []);

  const currentData = practiceData[currentIndex];

  const handleSystemComplete = () => {
    setStage('home');
  };

  const handleNavigate = (page: 'home' | 'practice' | 'analytics' | 'settings') => {
    if (page === 'practice') {
      setStage('practice');
    } else {
      setStage(page);
    }
  };

  const handleStartPractice = () => {
    setStage('practice');
  };

  const handleStartRecording = () => {
    setStage('recording');
  };

  const handleRecordingComplete = (recognized: string) => {
    setRecognizedText(recognized);
    const correct = recognized === currentData.character;
    setIsCorrect(correct);
    
    // Simulate error type and amplification for demo
    if (!correct) {
      setErrorType(errorTypes[Math.floor(Math.random() * errorTypes.length)]);
    } else {
      setErrorType(null);
    }
    setWasAmplified(Math.random() > 0.7); // 30% chance of amplification
    
    setStage('result');
  };

  const handleRetry = () => {
    setStage('practice');
  };

  const handleNext = () => {
    if (currentIndex < practiceData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Go back to home after completing all exercises
      setCurrentIndex(0);
      setStage('home');
      return;
    }
    setStage('practice');
  };

  const handleDemo = () => {
    // In a real app, this would play TTS audio
    console.log('Playing demo audio for:', currentData.character);
  };

  const handlePracticeWord = (word: string) => {
    // Find the word in practice data and start practice
    const wordIndex = practiceData.findIndex(d => d.character === word);
    if (wordIndex !== -1) {
      setCurrentIndex(wordIndex);
      setStage('practice');
    }
  };

  const handleExitPractice = () => {
    setStage('home');
  };

  const handleRecalibrate = () => {
    setStage('init');
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {stage === 'init' && (
          <SystemInit key="init" onComplete={handleSystemComplete} />
        )}

        {stage === 'home' && (
          <HomeDashboard
            key="home"
            userName="小明"
            streakDays={5}
            onStartPractice={handleStartPractice}
            onNavigate={handleNavigate}
            currentPage="home"
          />
        )}

        {stage === 'practice' && (
          <PracticeCard
            key="practice"
            data={currentData}
            onStartRecording={handleStartRecording}
            onDemo={handleDemo}
            onExit={handleExitPractice}
          />
        )}

        {stage === 'result' && (
          <ResultPanel
            key="result"
            targetCharacter={currentData.character}
            targetPinyin={currentData.pinyin}
            recognizedCharacter={recognizedText}
            isCorrect={isCorrect}
            errorType={errorType}
            wasAmplified={wasAmplified}
            onRetry={handleRetry}
            onNext={handleNext}
          />
        )}

        {stage === 'analytics' && (
          <div key="analytics" className="w-full h-screen overflow-y-auto">
            <AnalyticsPage onPracticeWord={handlePracticeWord} />
            {/* Bottom Nav */}
            <BottomNav currentPage="analytics" onNavigate={handleNavigate} />
          </div>
        )}

        {stage === 'settings' && (
          <div key="settings" className="w-full h-screen overflow-y-auto">
            <SettingsPage onRecalibrate={handleRecalibrate} />
            {/* Bottom Nav */}
            <BottomNav currentPage="settings" onNavigate={handleNavigate} />
          </div>
        )}
      </AnimatePresence>

      {stage === 'recording' && (
        <RecordingOverlay onComplete={handleRecordingComplete} />
      )}
    </div>
  );
}

// Bottom Navigation Component
function BottomNav({ 
  currentPage, 
  onNavigate 
}: { 
  currentPage: string; 
  onNavigate: (page: 'home' | 'practice' | 'analytics' | 'settings') => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 safe-area-inset-bottom z-50">
      <div className="grid grid-cols-4 gap-2">
        {[
          { id: 'home', label: '首頁', icon: '🏠' },
          { id: 'practice', label: '自由練習', icon: '📝' },
          { id: 'analytics', label: '學習報表', icon: '📊' },
          { id: 'settings', label: '設定', icon: '⚙️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id as any)}
            className={`py-2 px-3 rounded-xl transition-colors ${
              currentPage === tab.id
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="text-xl mb-1">{tab.icon}</div>
            <div className="text-xs">{tab.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}