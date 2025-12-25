// Text-to-Speech utility using Web Speech API

export function speak(text: string, options: { rate?: number; lang?: string } = {}) {
  // Check if browser supports speech synthesis
  if (!('speechSynthesis' in window)) {
    console.warn('Speech Synthesis not supported in this browser');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set language to Chinese
  utterance.lang = options.lang || 'zh-CN';
  
  // Set speech rate (0.1 to 10, default is 1)
  utterance.rate = options.rate || 1;
  
  // Set pitch (0 to 2, default is 1)
  utterance.pitch = 1;
  
  // Set volume (0 to 1, default is 1)
  utterance.volume = 1;

  // Try to use a Chinese voice if available
  const voices = window.speechSynthesis.getVoices();
  const chineseVoice = voices.find(voice => 
    voice.lang.includes('zh') || voice.lang.includes('cmn')
  );
  
  if (chineseVoice) {
    utterance.voice = chineseVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// Preload voices (some browsers need this)
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices();
    
    if (voices.length) {
      resolve(voices);
      return;
    }

    // Wait for voices to load
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
    };
  });
}

// Stop any ongoing speech
export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
