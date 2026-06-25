import { useState } from 'react';
import { askGemini } from '../gemini';

function MoodPage({ onComplete }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const moods = [
    { value: 1, emoji: '😴', label: 'Exhausted', desc: 'Running on empty', color: '#6b7280' },
    { value: 2, emoji: '😕', label: 'Low', desc: 'Not feeling it', color: '#f59e0b' },
    { value: 3, emoji: '😐', label: 'Okay', desc: 'Getting by', color: '#3b82f6' },
    { value: 4, emoji: '😊', label: 'Good', desc: 'Ready to go!', color: '#8b5cf6' },
    { value: 5, emoji: '🚀', label: 'Focused', desc: 'In the zone!', color: '#10b981' },
  ];

  async function handleSubmit() {
    if (!selected) return;
    setLoading(true);
    const mood = moods.find(m => m.value === selected);
    const prompt = `A student's focus level is ${selected}/5 (${mood.label}).
Write a powerful, personalized "Today's Mission" for them in exactly 2 sentences.
${selected <= 2 ? 'They are tired — suggest starting with one tiny easy task to build momentum. Be gentle and encouraging.' : selected === 3 ? 'They are okay — suggest tackling medium tasks and avoiding distractions.' : 'They are energized — push them to attack their hardest most important task first right now.'}
Make it feel like a coach talking directly to them. Be specific, motivating, and end with exactly what they should do first.`;

    try {
      const advice = await askGemini(prompt);
      onComplete({ score: selected, emoji: mood.emoji, label: mood.label, color: mood.color, advice });
    } catch {
      onComplete({ score: selected, emoji: mood.emoji, label: mood.label, color: mood.color, advice: "Today is your day to make progress. Start with your most urgent task right now and build unstoppable momentum!" });
    }
    setLoading(false);
  }

  const selectedMood = moods.find(m => m.value === selected);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif", padding: '2rem'
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .mood-btn:hover { transform: translateY(-4px) scale(1.05) !important; }
      `}</style>

      <div style={{ maxWidth: '520px', width: '100%', animation: 'fadeUp 0.6s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '0.5rem' }}>
            {selected ? selectedMood.emoji : '🌅'}
          </div>
          <h2 style={{ color: 'white', margin: '0 0 0.5rem', fontSize: '28px', fontWeight: '800', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            {selected ? `Feeling ${selectedMood.label}!` : "How's your energy today?"}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', margin: 0 }}>
            {selected ? "Your AI will build a plan around this." : "This helps your AI personalize everything for you."}
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.3)' }}>
          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {moods.map(mood => (
              <button
                key={mood.value}
                className="mood-btn"
                onClick={() => setSelected(mood.value)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '1rem 0.75rem', borderRadius: '16px', border: '2px solid',
                  borderColor: selected === mood.value ? 'white' : 'rgba(255,255,255,0.3)',
                  background: selected === mood.value ? 'white' : 'rgba(255,255,255,0.1)',
                  cursor: 'pointer', minWidth: '80px', gap: '6px',
                  transition: 'all 0.25s ease',
                  transform: selected === mood.value ? 'translateY(-4px) scale(1.05)' : 'scale(1)',
                  boxShadow: selected === mood.value ? '0 8px 25px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                <span style={{ fontSize: '32px' }}>{mood.emoji}</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: selected === mood.value ? mood.color : 'white' }}>
                  {mood.label}
                </span>
                <span style={{ fontSize: '10px', color: selected === mood.value ? '#6b7280' : 'rgba(255,255,255,0.7)' }}>
                  {mood.desc}
                </span>
              </button>
            ))}
          </div>

          {selected && (
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.2)' }}>
              <p style={{ margin: 0, color: 'white', fontSize: '13px', textAlign: 'center' }}>
                ✨ Your AI will optimize your task schedule for a <strong>{selectedMood?.label}</strong> day
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!selected || loading}
            style={{
              width: '100%', padding: '1rem', borderRadius: '14px',
              background: selected ? 'white' : 'rgba(255,255,255,0.3)',
              color: selected ? '#764ba2' : 'rgba(255,255,255,0.5)',
              border: 'none', fontSize: '16px', fontWeight: '800',
              cursor: selected ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              boxShadow: selected ? '0 4px 20px rgba(0,0,0,0.2)' : 'none'
            }}
          >
            {loading ? '🧠 Building your personalized plan...' : selected ? `Start my ${selectedMood?.label} day →` : 'Pick your mood first'}
          </button>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textAlign: 'center', marginTop: '1rem' }}>
          Your mood helps AI decide task order, urgency, and advice
        </p>
      </div>
    </div>
  );
}

export default MoodPage;