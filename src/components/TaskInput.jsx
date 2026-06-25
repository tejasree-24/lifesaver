import { useState } from 'react';
import VoiceInput from './VoiceInput';

function TaskInput({ onAddTask }) {
  const [taskName, setTaskName] = useState('');
  const [deadline, setDeadline] = useState('');

  function handleAdd() {
    if (!taskName.trim() || !deadline) {
      alert('Please enter both a task name and a deadline.');
      return;
    }
    onAddTask({ id: Date.now(), name: taskName, deadline, done: false });
    setTaskName('');
    setDeadline('');
  }

  return (
    <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '12px', background: '#f9f9f9' }}>
      <h2 style={{ marginTop: 0 }}>Add a Task</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Task name e.g. Submit assignment"
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
            style={{ flex: 1, padding: '0.6rem 1rem', fontSize: '15px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <VoiceInput onResult={text => setTaskName(text)} />
        </div>

        <input
          type="datetime-local"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          style={{ padding: '0.6rem 1rem', fontSize: '15px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
        <button
          onClick={handleAdd}
          style={{ padding: '0.6rem 1rem', fontSize: '15px', borderRadius: '8px', background: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Add Task
        </button>
      </div>
    </div>
  );
}

export default TaskInput;