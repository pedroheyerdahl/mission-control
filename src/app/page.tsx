'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<{temp: string, condition: string, humidity?: string} | null>(null);
  const [greeting, setGreeting] = useState('Good day');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const brusselsTime = now.toLocaleTimeString('en-US', { 
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit', 
        minute: '2-digit' 
      });
      const dateStr = now.toLocaleDateString('en-US', { 
        timeZone: 'America/Sao_Paulo',
        weekday: 'long',
        month: 'long', 
        day: 'numeric'
      });
      setTime(brusselsTime);
      setDate(dateStr);
      
      const hour = now.getHours();
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('https://wttr.in/Rio+de+Janeiro?format=j1')
      .then(res => res.json())
      .then(data => {
        if (data.current_condition) {
          setWeather({
            temp: data.current_condition[0].temp_C,
            condition: data.current_condition[0].weatherDesc[0].value,
            humidity: data.current_condition[0].humidity
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <img src="/lobster.png" alt="The Lobster" className="w-16 h-16 rounded-full" />
            <div>
              <h1 className="text-3xl font-bold">The Lobster's Mission Control</h1>
              <p className="text-slate-400">Pedro & The Lobster 🦞</p>
            </div>
          </div>
        </header>

        {/* Time & Weather */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-700/50 rounded-xl p-6 backdrop-blur">
            <p className="text-slate-400 text-sm mb-1">{date}</p>
            <p className="text-5xl font-light">{time}</p>
            <p className="text-slate-400 mt-2">São Paulo, Brazil</p>
          </div>
          
          <div className="bg-slate-700/50 rounded-xl p-6 backdrop-blur">
            {weather ? (
              <>
                <p className="text-slate-400 text-sm mb-1">Rio de Janeiro</p>
                <p className="text-4xl font-light">{weather.temp}°C</p>
                <p className="text-slate-400 mt-2">{weather.condition}</p>
              </>
            ) : (
              <p className="text-slate-400">Loading weather...</p>
            )}
          </div>
        </div>

        {/* Greeting */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 mb-8 border border-blue-500/30">
          <h2 className="text-xl font-semibold mb-2">{greeting}, Pedro! 👋</h2>
          <p className="text-slate-300">
            Your AI assistant is online and ready. This mission control will grow over time.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/tasks" className="bg-slate-700/50 hover:bg-slate-600/50 rounded-xl p-4 text-center transition">
            <span className="text-2xl mb-2 block">✅</span>
            <span className="text-sm">Tasks</span>
          </a>
          <a href="/calendar" className="bg-slate-700/50 hover:bg-slate-600/50 rounded-xl p-4 text-center transition">
            <span className="text-2xl mb-2 block">📅</span>
            <span className="text-sm">Calendar</span>
          </a>
          <a href="/brief" className="bg-slate-700/50 hover:bg-slate-600/50 rounded-xl p-4 text-center transition">
            <span className="text-2xl mb-2 block">📋</span>
            <span className="text-sm">Morning Brief</span>
          </a>
          <a href="/settings" className="bg-slate-700/50 hover:bg-slate-600/50 rounded-xl p-4 text-center transition">
            <span className="text-2xl mb-2 block">⚙️</span>
            <span className="text-sm">Settings</span>
          </a>
        </div>

        {/* Status */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <h3 className="text-sm font-semibold text-slate-400 mb-4">SYSTEM STATUS</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Claude Sonnet 4.5</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>GitHub Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Google Calendar</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Gmail</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
