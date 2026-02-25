'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: 'project' | 'idea' | 'research';
  status: string;
  created_at: string;
}

export default function Knowledge() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', content: '', category: 'idea' as const });

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    const { data } = await supabase
      .from('knowledge')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setItems(data);
    setLoading(false);
  };

  const addItem = async () => {
    if (!newItem.title.trim()) return;
    
    const id = Date.now().toString();
    const { data } = await supabase
      .from('knowledge')
      .insert([{ 
        id, 
        title: newItem.title, 
        content: newItem.content, 
        category: newItem.category,
        status: 'active'
      }])
      .select()
      .single();
    
    if (data) setItems([data, ...items]);
    setNewItem({ title: '', content: '', category: 'idea' });
    setShowForm(false);
  };

  const deleteItem = async (id: string) => {
    await supabase.from('knowledge').delete().eq('id', id);
    setItems(items.filter(i => i.id !== id));
  };

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(i => i.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All', emoji: '📚' },
    { id: 'project', label: 'Projects', emoji: '🚀' },
    { id: 'idea', label: 'Ideas', emoji: '💡' },
    { id: 'research', label: 'Research', emoji: '🔬' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <a href="/" className="text-slate-400 hover:text-white mb-4 inline-block">← Back</a>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span>🧠</span> Knowledge
          </h1>
          <p className="text-slate-400 mt-2">Projects, Ideas & Research</p>
        </header>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                activeCategory === cat.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full mb-6 py-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-slate-400 hover:text-white transition"
        >
          + Add New
        </button>

        {/* Add Form */}
        {showForm && (
          <div className="bg-slate-700/50 rounded-xl p-6 mb-6 border border-slate-600">
            <input
              type="text"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              placeholder="Title..."
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:border-blue-500"
            />
            <textarea
              value={newItem.content}
              onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
              placeholder="Description..."
              rows={4}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:border-blue-500 resize-none"
            />
            <div className="flex gap-2 mb-4">
              {categories.slice(1).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setNewItem({ ...newItem, category: cat.id as any })}
                  className={`px-3 py-1 rounded text-sm ${
                    newItem.category === cat.id 
                      ? 'bg-blue-600' 
                      : 'bg-slate-600'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={addItem}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-medium transition"
              >
                Save
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-slate-600 hover:bg-slate-500 px-6 py-2 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Knowledge Items */}
        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">🧠</p>
            <p className="text-slate-400">No items yet. Add your first!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      item.category === 'project' ? 'bg-green-500/20 text-green-400' :
                      item.category === 'idea' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {item.category}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-slate-500 hover:text-red-400 transition text-sm"
                  >
                    ✕
                  </button>
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                {item.content && (
                  <p className="text-slate-400 text-sm">{item.content}</p>
                )}
                <p className="text-slate-500 text-xs mt-3">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
