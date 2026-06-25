import { useState } from 'react';
import { askGemini } from '../gemini';

function formatResult(text) {
  return text.split('\n').map((line, i) => (
    <p key={i} style={{ margin: '0.3rem 0', lineHeight: '1.7' }}>
      {line.replace(/\*\*(.*?)\*\*/g, '$1')}
    </p>
  ));
}

function AISchedule({ tasks }) {
  const [priorityResult, setPriorityResult] = useState('');
  const [scheduleResult, setScheduleResult] = useState('');
  const [loadingPriority, setLoadingPriority] = useState(false);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  function getTaskList() {
    return tasks
      .filter(t => !t.done)
      .map((t, i) => `${i + 1}. "${t.name}" — due ${new Date(t.deadline).toLocaleString()}`)
      .join('\n');
  }

  async function handlePrioritize() {
    if (tasks.filter(t => !t.done).length === 0) {
      alert('No pending tasks to prioritize!');
      return;
    }
    setLoadingPriority(true);
    setPriorityResult('');
    const prompt = `You are a productivity AI. A student has these pending tasks:

${getTaskList()}

Current time: ${new Date().toLocaleString()}

1. Rank by urgency (most urgent first)
2. For each task, one sentence on WHY it's ranked there
3. Suggest what time they should START each task
4. One overall productivity tip

Be concise and encouraging.`;

    try {
      const response = await askGemini(prompt);
      setPriorityResult(response);
    } catch {
      setPriorityResult('Error. Please try again.');
    }
    setLoadingPriority(false);
  }

  async function handleSchedule() {
    if (tasks.filter(t => !t.done).length === 0) {
      alert('No pending tasks to schedule!');
      return;
    }
    setLoadingSchedule(true);
    setScheduleResult('');
    const prompt = `You are a productivity AI. A student has these pending tasks:

${getTaskList()}

Current time: ${new Date().toLocaleString()}

Create a detailed hour-by-hour schedule for today and tomorrow to complete all these tasks. For each time block include:
- The time slot (e.g. 3:00 PM - 4:30 PM)
- The task to work on
- Exactly what to focus on in that block
- A short break suggestion after long blocks

Also include meal breaks and buffer time. Make it realistic and achievable. End with an encouraging message.`;

    try {
      const response = await askGemini(prompt);
      setScheduleResult(response);
    } catch {
      setScheduleResult('Error. Please try again.');
    }
    setLoadingSchedule(false);
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <button
          onClick={handlePrioritize}
          disabled={loadingPriority}
          style={{
            flex: 1,
            padding: '0.75rem',
            fontSize: '14px',
            borderRadius: '8px',
            background: loadingPriority ? '#a5b4fc' : '#4f46e5',
            color: 'white',
            border: 'none',
            cursor: loadingPriority ? 'not-allowed' : 'pointer'
          }}
        >
          {loadingPriority ? '⏳ Analyzing...' : '🤖 Prioritize with AI'}
        </button>

        <button
          onClick={handleSchedule}
          disabled={loadingSchedule}
          style={{
            flex: 1,
            padding: '0.75rem',
            fontSize: '14px',
            borderRadius: '8px',
            background: loadingSchedule ? '#6ee7b7' : '#059669',
            color: 'white',
            border: 'none',
            cursor: loadingSchedule ? 'not-allowed' : 'pointer'
          }}
        >
          {loadingSchedule ? '⏳ Building schedule...' : '📅 Generate My Schedule'}
        </button>
      </div>

      {priorityResult && (
        <div style={{
          padding: '1.25rem',
          background: '#f0f0ff',
          borderRadius: '12px',
          border: '1px solid #c7d2fe',
          marginBottom: '1rem',
          fontSize: '14px',
          color: '#1e1b4b'
        }}>
          <strong style={{ fontSize: '15px' }}>🧠 AI Priority Plan:</strong>
          <div style={{ marginTop: '0.75rem' }}>{formatResult(priorityResult)}</div>
        </div>
      )}

      {scheduleResult && (
        <div style={{
          padding: '1.25rem',
          background: '#f0fdf4',
          borderRadius: '12px',
          border: '1px solid #86efac',
          fontSize: '14px',
          color: '#14532d'
        }}>
          <strong style={{ fontSize: '15px' }}>📅 Your AI Schedule:</strong>
          <div style={{ marginTop: '0.75rem' }}>{formatResult(scheduleResult)}</div>
        </div>
      )}

    </div>
  );
}

export default AISchedule;