function Navbar({ page, setPage, mood, pending, overdue }) {
  const tabs = [
    { id: 'dashboard', label: '🏠 Dashboard' },
    { id: 'chat', label: '🤖 AI Chat' },
    { id: 'schedule', label: '📅 Schedule' },
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      boxShadow: '0 4px 20px rgba(79,70,229,0.3)',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>⚡</span>
            <div>
              <p style={{ margin: 0, color: 'white', fontWeight: '700', fontSize: '16px' }}>Life Saver</p>
              <p style={{ margin: 0, color: '#c4b5fd', fontSize: '11px' }}>AI productivity companion</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {mood && (
              <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.3rem 0.7rem', borderRadius: '999px', fontSize: '12px' }}>
                {mood.emoji} {mood.label}
              </span>
            )}
            {overdue > 0 && (
              <span style={{ background: '#ef4444', color: 'white', padding: '0.3rem 0.7rem', borderRadius: '999px', fontSize: '12px', fontWeight: '700' }}>
                🔴 {overdue} overdue
              </span>
            )}
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#a5b4fc', padding: '0.3rem 0.7rem', borderRadius: '999px', fontSize: '12px' }}>
              {pending} pending
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', paddingBottom: '0' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setPage(tab.id)}
              style={{
                padding: '0.6rem 1.1rem', fontSize: '13px', fontWeight: '600',
                border: 'none', cursor: 'pointer', borderRadius: '8px 8px 0 0',
                background: page === tab.id ? 'white' : 'transparent',
                color: page === tab.id ? '#4f46e5' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Navbar;