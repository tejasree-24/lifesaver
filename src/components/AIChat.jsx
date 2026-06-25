import { useState, useRef, useEffect } from 'react';
import { askGemini } from '../gemini';

function AIChat({ tasks, onAddTask, onDeleteTask, onMarkDone }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi! I'm your AI assistant 🤖 You can:\n• Add a task: \"I have Java exam tomorrow\"\n• Delete: \"delete the Java exam task\"\n• Mark done: \"mark Java exam as done\"\n• Ask questions: \"explain deadlocks\""
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    const taskContext = tasks.length > 0
      ? `Current tasks: ${tasks.filter(t => !t.done).map(t => `"${t.name}" due ${new Date(t.deadline).toLocaleString()}`).join(', ')}`
      : 'No tasks added yet.';

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);
    const todayStr = now.toISOString().slice(0, 10);

    const prompt = `You are a smart AI productivity assistant AND academic tutor for a student.

${taskContext}
Current time: ${now.toLocaleString()}
Today's date: ${todayStr}
Tomorrow's date: ${tomorrowStr}

User message: "${userMessage}"

CRITICAL RULES — always output JSON on the FIRST LINE, then your message:

1. If the user mentions ANY task, assignment, exam, project, or thing they need to do:
   Output: {"action":"add_task","name":"task name","deadline":"YYYY-MM-DDTHH:mm"}
   Time assumptions: "tomorrow" = ${tomorrowStr}T09:00, "tonight" = ${todayStr}T21:00, "evening" = ${todayStr}T18:00, no time = ${tomorrowStr}T09:00
   NEVER ask for more details. Always assume and act.

2. If the user wants to delete a task:
   Output: {"action":"delete_task","name":"closest matching task name from the list above"}
   Then confirm you deleted it.

3. If the user wants to mark a task as done:
   Output: {"action":"mark_done","name":"closest matching task name from the list above"}
   Then confirm you marked it done.

4. If the user asks an academic question (explain X, what is X, how does X work):
   Answer like a friendly tutor in under 150 words with a simple example. No JSON needed.

5. If the user asks what to do or needs advice:
   Look at their tasks and give specific advice. No JSON needed.

6. NEVER ask for more information. Always make smart assumptions and act immediately.`;

    try {
      const response = await askGemini(prompt);

      const jsonMatch = response.match(/\{"action":".*?\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.action === 'add_task' && parsed.name && parsed.deadline) {
            onAddTask({ id: Date.now(), name: parsed.name, deadline: parsed.deadline, done: false });
          } else if (parsed.action === 'delete_task' && parsed.name) {
            onDeleteTask(parsed.name);
          } else if (parsed.action === 'mark_done' && parsed.name) {
            onMarkDone(parsed.name);
          }
        } catch {}
      }

      const cleanResponse = response.replace(/\{"action":".*?\}\n?/, '').trim();
      setMessages(prev => [...prev, { role: 'ai', text: cleanResponse }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I had trouble responding. Please try again!' }]);
    }
    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div style={{ border: '1.5px solid #e0e7ff', borderRadius: '16px', overflow: 'hidden', marginTop: '1.5rem', boxShadow: '0 2px 12px rgba(79,70,229,0.08)' }}>
      <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>🤖</span>
        <div>
          <p style={{ margin: 0, color: 'white', fontWeight: '600', fontSize: '14px' }}>AI Assistant</p>
          <p style={{ margin: 0, color: '#c4b5fd', fontSize: '11px' }}>Add • Delete • Mark done • Ask anything</p>
        </div>
      </div>

      <div style={{ height: '300px', overflowY: 'auto', padding: '1rem', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%', padding: '0.6rem 0.9rem', borderRadius: '12px',
              fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap',
              background: msg.role === 'user' ? '#4f46e5' : 'white',
              color: msg.role === 'user' ? 'white' : '#1e1b4b',
              border: msg.role === 'ai' ? '1px solid #e0e7ff' : 'none',
              borderBottomRightRadius: msg.role === 'user' ? '4px' : '12px',
              borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '12px',
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '0.6rem 0.9rem', borderRadius: '12px', borderBottomLeftRadius: '4px', background: 'white', border: '1px solid #e0e7ff', fontSize: '13px', color: '#9ca3af' }}>
              ⏳ Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '0.75rem', background: 'white', borderTop: '1px solid #e0e7ff', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder='Try: "I have Java exam tomorrow" or "explain recursion"'
          style={{ flex: 1, padding: '0.6rem 0.9rem', fontSize: '13px', borderRadius: '8px', border: '1.5px solid #e0e7ff', outline: 'none' }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{ padding: '0.6rem 1rem', borderRadius: '8px', background: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default AIChat;