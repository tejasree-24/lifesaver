function LandingPage({ onGetStarted }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #fda085 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif", padding: '2rem', textAlign: 'center'
    }}>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0 }}>
        {['📅', '⚡', '🎯', '🚀', '✅', '🧠', '⏰', '💡'].map((emoji, i) => (
          <div key={i} style={{
            position: 'absolute', fontSize: `${20 + (i * 8)}px`, opacity: 0.15,
            top: `${10 + (i * 11)}%`, left: `${5 + (i * 12)}%`,
            animation: `float ${3 + i}s ease-in-out infinite alternate`
          }}>{emoji}</div>
        ))}
      </div>

      <style>{`
        @keyframes float { from { transform: translateY(0px) rotate(0deg); } to { transform: translateY(-20px) rotate(10deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      `}</style>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
        <div style={{ fontSize: '72px', marginBottom: '1rem', animation: 'pulse 2s ease-in-out infinite' }}>⚡</div>

        <h1 style={{
          fontSize: '52px', fontWeight: '800', color: 'white', margin: '0 0 1rem',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)', animation: 'fadeUp 0.8s ease forwards',
          lineHeight: 1.1
        }}>
          Life Saver
        </h1>

        <p style={{
          fontSize: '20px', color: 'rgba(255,255,255,0.9)', margin: '0 0 0.75rem',
          fontWeight: '500', animation: 'fadeUp 1s ease forwards'
        }}>
          Your AI-powered productivity companion
        </p>

        <p style={{
          fontSize: '15px', color: 'rgba(255,255,255,0.75)', margin: '0 0 2.5rem',
          lineHeight: 1.7, animation: 'fadeUp 1.2s ease forwards'
        }}>
          Stop missing deadlines. Let AI prioritize your tasks, build your schedule,
          and proactively rescue you before things go wrong.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {['🤖 AI Prioritization', '📅 Smart Scheduling', '🔔 Agentic Reminders', '🎤 Voice Input'].map((f, i) => (
            <span key={i} style={{
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
              color: 'white', padding: '0.4rem 1rem', borderRadius: '999px',
              fontSize: '13px', fontWeight: '500', border: '1px solid rgba(255,255,255,0.3)'
            }}>{f}</span>
          ))}
        </div>

        <button
          onClick={onGetStarted}
          style={{
            padding: '1rem 3rem', fontSize: '18px', fontWeight: '700',
            borderRadius: '50px', border: 'none', cursor: 'pointer',
            background: 'white', color: '#764ba2',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease',
            animation: 'fadeUp 1.4s ease forwards'
          }}
          onMouseOver={e => e.target.style.transform = 'translateY(-3px)'}
          onMouseOut={e => e.target.style.transform = 'translateY(0)'}
        >
          Get Started →
        </button>

        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginTop: '1.5rem' }}>
          Free • No signup required • Powered by Gemini AI
        </p>
      </div>
    </div>
  );
}

export default LandingPage;