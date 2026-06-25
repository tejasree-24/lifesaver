import { useEffect, useState } from 'react';
import { askGemini } from '../gemini';

function AgentMonitor({ tasks, onReschedule }) {
  const [agentMessage, setAgentMessage] = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (tasks.length === 0) return;

    async function checkOverdue() {
      const overdueTasks = tasks.filter(t => {
        const diff = new Date(t.deadline) - new Date();
        return diff < 0 && !t.done;
      });

      if (overdueTasks.length === 0) return;

      setChecking(true);
      const overdueList = overdueTasks
        .map(t => `"${t.name}" was due ${new Date(t.deadline).toLocaleString()}`)
        .join('\n');

      const pendingList = tasks
        .filter(t => !t.done)
        .map(t => `"${t.name}" due ${new Date(t.deadline).toLocaleString()}`)
        .join('\n');

      const prompt = `You are a proactive AI productivity assistant. 

The following tasks are OVERDUE and not yet completed:
${overdueList}

All pending tasks (including overdue):
${pendingList}

Current time: ${new Date().toLocaleString()}

Without being asked, automatically:
1. Acknowledge the overdue tasks with empathy (one sentence)
2. Suggest new realistic deadlines for each overdue task
3. Reorganize ALL pending tasks into a new priority order
4. Give one action the user should take RIGHT NOW

Be direct, brief, and encouraging. This is an automatic agent response.`;

      try {
        const response = await askGemini(prompt);
        setAgentMessage(response);
        if (onReschedule) onReschedule(overdueTasks);
      } catch {
        // silent fail — agent runs in background
      }
      setChecking(false);
    }

    checkOverdue();
    const interval = setInterval(checkOverdue, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  if (!agentMessage && !checking) return null;

  return (
    <div style={{
      padding: '1.25rem',
      background: '#fff7ed',
      border: '1.5px solid #fdba74',
      borderRadius: '12px',
      marginBottom: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '18px' }}>🤖</span>
        <strong style={{ color: '#9a3412', fontSize: '15px' }}>
          AI Agent — Automatic Reschedule
        </strong>
        <span style={{
          fontSize: '11px',
          background: '#fed7aa',
          color: '#9a3412',
          padding: '2px 8px',
          borderRadius: '999px',
          marginLeft: 'auto'
        }}>
          AUTO-TRIGGERED
        </span>
      </div>
      {checking && <p style={{ color: '#9a3412', fontSize: '14px' }}>⏳ Agent is analyzing your tasks...</p>}
      {agentMessage && (
        <div style={{ fontSize: '14px', color: '#7c2d12', lineHeight: '1.7' }}>
          {agentMessage.split('\n').map((line, i) => (
            <p key={i} style={{ margin: '0.25rem 0' }}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default AgentMonitor;