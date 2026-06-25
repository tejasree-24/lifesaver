import { useState } from 'react';
import { askGemini } from '../gemini';

function MoodCheckIn({ onComplete }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const moods = [
    { value: 1, emoji: '😴', label: 'Exhausted' },
    { value: 2, emoji: '😕', label: 'Low' },
    { value: 3, emoji: '😐', label: 'Okay' },
    { value: 4, emoji: '😊', label: 'Good' },
    { value: 5, emoji: '🚀', label: 'Focused' },
  ];

  async function handleSubmit() {
    if (!selected) return;
    setLoading(true);
    const mood = moods.find(m => m.value === selected);
    const prompt = `A student's focus level today is ${selected}/5 (${mood.label}). 
Give them a short, personalized productivity strategy for today in 2-3 sentences. 
Focus level ${selected} means: ${selected <= 2 ? 'start with very small easy tasks to build momentum' : selected === 3 ? 'tackle medium tasks, avoid overwhelming yourself' : 'great time to tackle the hardest most important tasks first'}.
Be encouraging and specific. End with one concrete first action.`;

    try {
      const advice = await askGemini(prompt);
      onComplete({ score: selected, emoji: mood.emoji, label: mood.label, advice });
    } catch {
      onComplete({ score: selected, emoji: mood.emoji, label: mood.label, advice: null });
    }
    setLoading(false);
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(79,70,229,0.85)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '2.5rem',
        maxWidth: '420px', width: '90%', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '0.5rem' }}>🌅</div>
        <h2 style={{ color: '#4f46e5', margin: '0 0 0.5rem', fontSize: '22px' }}>Good day!</h2>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 1.5rem' }}>
          How's your focus level today? I'll personalize your task plan based on this.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {moods.map(mood => (
            <button
              key={mood.value}
              onClick={() => setSelected(mood.value)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '0.6rem 0.5rem', borderRadius: '12px', border: '2px solid',
                borderColor: selected === mood.value ? '#4f46e5' : '#e5e7eb',
                background: selected === mood.value ? '#eef2ff' : 'white',
                cursor: 'pointer', minWidth: '60px', gap: '4px'
              }}
            >
              <span style={{ fontSize: '24px' }}>{mood.emoji}</span>
              <span style={{ fontSize: '10px', color: selected === mood.value ? '#4f46e5' : '#9ca3af', fontWeight: '600' }}>
                {mood.label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selected || loading}
          style={{
            width: '100%', padding: '0.75rem', borderRadius: '10px',
            background: selected ? '#4f46e5' : '#e5e7eb',
            color: selected ? 'white' : '#9ca3af',
            border: 'none', fontSize: '15px', fontWeight: '600',
            cursor: selected ? 'pointer' : 'not-allowed'
          }}
        >
          {loading ? '⏳ Personalizing your day...' : "Let's go →"}
        </button>
      </div>
    </div>
  );
}

export default MoodCheckIn;