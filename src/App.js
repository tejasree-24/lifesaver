import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import MoodPage from './pages/MoodPage';
import Navbar from './components/Navbar';
import TaskInput from './components/TaskInput';
import AISchedule from './components/AISchedule';
import AgentMonitor from './components/AgentMonitor';
import AIChat from './components/AIChat';

function getUrgencyStyle(deadline, done) {
  if (done) return { border: '#86efac', label: '✅ Done', labelColor: '#166534', barColor: '#22c55e', glow: 'rgba(34,197,94,0.15)' };
  const diff = new Date(deadline) - new Date();
  const hours = diff / (1000 * 60 * 60);
  if (diff < 0) return { border: '#fca5a5', label: '🔴 Overdue', labelColor: '#991b1b', barColor: '#ef4444', glow: 'rgba(239,68,68,0.15)' };
  if (hours <= 2) return { border: '#fdba74', label: '🟠 Very Urgent', labelColor: '#9a3412', barColor: '#f97316', glow: 'rgba(249,115,22,0.15)' };
  if (hours <= 24) return { border: '#fde047', label: '🟡 Due Today', labelColor: '#854d0e', barColor: '#eab308', glow: 'rgba(234,179,8,0.15)' };
  return { border: '#7dd3fc', label: '🟢 Upcoming', labelColor: '#075985', barColor: '#38bdf8', glow: 'rgba(56,189,248,0.15)' };
}

function App() {
  const [screen, setScreen] = useState('landing');
  const [page, setPage] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [mood, setMood] = useState(null);

  function handleAddTask(task) { setTasks(prev => [...prev, task]); }
  function handleToggleDone(id) { setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t)); }
  function handleDelete(id) { setTasks(prev => prev.filter(t => t.id !== id)); }
  function handleDeleteByName(name) { setTasks(prev => prev.filter(t => !t.name.toLowerCase().includes(name.toLowerCase()))); }
  function handleMarkDoneByName(name) { setTasks(prev => prev.map(t => t.name.toLowerCase().includes(name.toLowerCase()) ? { ...t, done: true } : t)); }

  const pending = tasks.filter(t => !t.done).length;
  const done = tasks.filter(t => t.done).length;
  const overdue = tasks.filter(t => !t.done && new Date(t.deadline) < new Date()).length;

  if (screen === 'landing') return <LandingPage onGetStarted={() => setScreen('mood')} />;
  if (screen === 'mood') return <MoodPage onComplete={m => { setMood(m); setScreen('app'); }} />;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 60%, #fda085 100%)',
      fontFamily: "'Segoe UI', sans-serif",
      position: 'relative'
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .glass { background: rgba(255,255,255,0.15) !important; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.3) !important; }
        .glass-white { background: rgba(255,255,255,0.85) !important; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.6) !important; }
        .task-card:hover { transform: translateY(-3px) !important; box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important; }
        .task-card { transition: all 0.25s ease !important; }
        .action-btn:hover { transform: scale(1.05); }
        .action-btn { transition: all 0.15s ease; }
      `}</style>

      {/* Floating background blobs */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: '-100px', left: '-100px', animation: 'float 6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', bottom: '10%', right: '-80px', animation: 'float 8s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: '40%', left: '5%', animation: 'float 7s ease-in-out infinite' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar page={page} setPage={setPage} mood={mood} pending={pending} overdue={overdue} />

        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>

          {page === 'dashboard' && (
            <div style={{ animation: 'fadeUp 0.5s ease' }}>

              {/* Today's Mission */}
              {mood && (
                <div className="glass" style={{
                  borderRadius: '24px', padding: '1.5rem',
                  marginBottom: '1.5rem',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      background: 'rgba(255,255,255,0.25)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: '24px'
                    }}>
                      {mood.emoji}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: '800', fontSize: '16px', color: 'white' }}>Today's Mission</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Personalized for your {mood.label} day</p>
                    </div>
                    <span style={{
                      marginLeft: 'auto', background: 'rgba(255,255,255,0.25)',
                      color: 'white', padding: '0.3rem 0.85rem',
                      borderRadius: '999px', fontSize: '12px', fontWeight: '700',
                      border: '1px solid rgba(255,255,255,0.4)'
                    }}>
                      Focus {mood.score}/5
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '15px', color: 'rgba(255,255,255,0.95)', lineHeight: 1.75, fontStyle: 'italic' }}>
                    "{mood.advice}"
                  </p>
                </div>
              )}

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Pending', value: pending, icon: '📋', color: 'rgba(167,139,250,1)' },
                  { label: 'Completed', value: done, icon: '✅', color: 'rgba(52,211,153,1)' },
                  { label: 'Overdue', value: overdue, icon: '🔴', color: 'rgba(252,165,165,1)' },
                ].map(s => (
                  <div key={s.label} className="glass" style={{
                    borderRadius: '20px', padding: '1.25rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ fontSize: '26px', marginBottom: '0.4rem' }}>{s.icon}</div>
                    <div style={{ fontSize: '34px', fontWeight: '900', color: 'white', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontWeight: '600', marginTop: '0.3rem' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Agent Monitor */}
              <AgentMonitor tasks={tasks} />

              {/* Task Input */}
              <div className="glass-white" style={{ borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <TaskInput onAddTask={handleAddTask} />
              </div>

              {/* Task List */}
              {tasks.length === 0 ? (
                <div className="glass" style={{
                  textAlign: 'center', padding: '3rem 1rem',
                  borderRadius: '24px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
                }}>
                  <div style={{ fontSize: '56px', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>📋</div>
                  <p style={{ fontSize: '18px', fontWeight: '800', color: 'white', margin: '0 0 0.5rem' }}>No tasks yet!</p>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                    Add one above or chat with AI below!
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                    Your Tasks ({tasks.length})
                  </p>
                  {tasks.map(task => {
                    const s = getUrgencyStyle(task.deadline, task.done);
                    return (
                      <div key={task.id} className="task-card glass-white" style={{
                        borderRadius: '16px', marginBottom: '0.75rem', overflow: 'hidden',
                        boxShadow: `0 4px 20px ${s.glow}`
                      }}>
                        <div style={{ height: '4px', background: `linear-gradient(90deg, ${s.barColor}, ${s.barColor}66)` }} />
                        <div style={{ padding: '1rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ flex: 1 }}>
                            <p style={{
                              margin: 0, fontWeight: '700', fontSize: '15px',
                              textDecoration: task.done ? 'line-through' : 'none',
                              color: task.done ? '#9ca3af' : '#1e1b4b'
                            }}>
                              {task.name}
                            </p>
                            <p style={{ margin: '4px 0 6px', fontSize: '12px', color: '#9ca3af' }}>
                              📅 {new Date(task.deadline).toLocaleString()}
                            </p>
                            <span style={{
                              display: 'inline-block', fontSize: '11px', fontWeight: '700',
                              color: s.labelColor, background: `${s.glow}`,
                              padding: '3px 10px', borderRadius: '999px',
                              border: `1.5px solid ${s.border}`
                            }}>
                              {s.label}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginLeft: '1rem' }}>
                            <button className="action-btn" onClick={() => handleToggleDone(task.id)} style={{
                              padding: '0.35rem 0.9rem', fontSize: '12px', borderRadius: '8px',
                              border: '1.5px solid #a5b4fc',
                              background: task.done ? '#e0e7ff' : 'white',
                              cursor: 'pointer', fontWeight: '700', color: '#4f46e5'
                            }}>
                              {task.done ? 'Undo' : '✓ Done'}
                            </button>
                            <button className="action-btn" onClick={() => handleDelete(task.id)} style={{
                              padding: '0.35rem 0.9rem', fontSize: '12px', borderRadius: '8px',
                              border: '1.5px solid #fca5a5', background: 'white',
                              cursor: 'pointer', fontWeight: '700', color: '#dc2626'
                            }}>
                              🗑 Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {page === 'chat' && (
            <div style={{ animation: 'fadeUp 0.4s ease' }}>
              <div className="glass" style={{ borderRadius: '20px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
                <h2 style={{ color: 'white', margin: '0 0 0.25rem', fontSize: '22px', fontWeight: '800' }}>🤖 AI Assistant</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '14px' }}>Add tasks, ask questions, manage your list — all by chatting</p>
              </div>
              <div className="glass-white" style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                <AIChat
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteByName}
                  onMarkDone={handleMarkDoneByName}
                />
              </div>
            </div>
          )}

          {page === 'schedule' && (
            <div style={{ animation: 'fadeUp 0.4s ease' }}>
              <div className="glass" style={{ borderRadius: '20px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
                <h2 style={{ color: 'white', margin: '0 0 0.25rem', fontSize: '22px', fontWeight: '800' }}>📅 AI Schedule</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '14px' }}>Let Gemini build your hour-by-hour plan and prioritize what matters</p>
              </div>
              <div className="glass-white" style={{ borderRadius: '20px', padding: '1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                <AISchedule tasks={tasks} />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;