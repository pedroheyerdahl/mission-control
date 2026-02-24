'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (data) setTasks(data);
    setLoading(false);
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    const id = Date.now().toString();
    const { data } = await supabase
      .from('tasks')
      .insert([{ id, text: newTask, completed: false, priority: 'medium' }])
      .select()
      .single();
    
    if (data) setTasks([...tasks, data]);
    setNewTask('');
  };

  const toggleTask = async (id: string, completed: boolean) => {
    await supabase
      .from('tasks')
      .update({ completed: !completed })
      .eq('id', id);
    
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !completed } : t
    ));
  };

  const deleteTask = async (id: string) => {
    await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    setTasks(tasks.filter(t => t.id !== id));
  };

  const priorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <a href="/" className="text-slate-400 hover:text-white mb-4 inline-block">← Back</a>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span>✅</span> Tasks
          </h1>
          <p className="text-slate-400 mt-2">Track priorities and goals</p>
        </header>

        {/* Add Task */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={addTask}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-medium transition"
          >
            Add
          </button>
        </div>

        {/* Task List */}
        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`flex items-center gap-4 p-4 rounded-lg bg-slate-700/30 border border-slate-600/50 ${
                  task.completed ? 'opacity-50' : ''
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id, task.completed)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                    task.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-slate-500 hover:border-green-500'
                  }`}
                >
                  {task.completed && <span>✓</span>}
                </button>
                
                <span className={`flex-1 ${task.completed ? 'line-through text-slate-500' : ''}`}>
                  {task.text}
                </span>
                
                <span className={`text-xs px-2 py-1 rounded border ${priorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-slate-500 hover:text-red-400 transition"
                >
                  ✕
                </button>
              </div>
            ))}
            
            {tasks.length === 0 && (
              <p className="text-center text-slate-500 py-8">No tasks yet. Add one above!</p>
            )}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-700 text-sm text-slate-500">
          <p>💡 Tip: The Lobster can add tasks for you. Just ask!</p>
        </div>
      </div>
    </div>
  );
}
