import { useState } from 'react';

function VoiceInput({ onResult }) {
  const [listening, setListening] = useState(false);
  const [supported] = useState(() => 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      setListening(false);
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone in your browser settings.');
      }
    };

    recognition.start();
  }

  if (!supported) return null;

  return (
    <button
      onClick={startListening}
      disabled={listening}
      title="Click and speak your task name"
      style={{
        padding: '0.6rem 1rem',
        fontSize: '15px',
        borderRadius: '8px',
        border: '1px solid #c7d2fe',
        background: listening ? '#e0e7ff' : 'white',
        cursor: listening ? 'not-allowed' : 'pointer',
        color: listening ? '#4f46e5' : '#666',
        whiteSpace: 'nowrap'
      }}
    >
      {listening ? '🎙️ Listening...' : '🎤 Speak'}
    </button>
  );
}

export default VoiceInput;