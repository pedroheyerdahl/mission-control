'use client';

import { useState, useEffect } from 'react';

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  hangoutLink?: string;
}

export default function Brief() {
  const [events, setEvents] = useState<Event[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/calendar').then(r => r.json()),
      fetch('https://wttr.in/Rio+de+Janeiro?format=j1').then(r => r.json()),
      fetch('https://newsapi.org/v2/top-headlines?category=technology&country=us&apiKey=demo').then(r => r.json()).catch(() => ({ articles: [] }))
    ])
    .then(([calData, weatherData, newsData]) => {
      setEvents(calData.events || []);
      if (weatherData.current_condition) {
        setWeather({
          temp: weatherData.current_condition[0].temp_C,
          condition: weatherData.current_condition[0].weatherDesc[0].value,
        });
      }
      setNews(newsData.articles?.slice(0, 3) || []);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 flex items-center justify-center">
        <p className="text-slate-400">Loading your brief...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <a href="/" className="text-slate-400 hover:text-white mb-4 inline-block">← Back</a>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span>🌅</span> Morning Brief
          </h1>
          <p className="text-slate-400 mt-2">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </header>

        {/* Weather */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Weather</h2>
          <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl p-6 border border-orange-500/30">
            {weather ? (
              <div className="flex items-center gap-4">
                <span className="text-5xl">☀️</span>
                <div>
                  <p className="text-3xl font-light">{weather.temp}°C</p>
                  <p className="text-slate-400">{weather.condition}</p>
                  <p className="text-sm text-slate-500 mt-1">Rio de Janeiro</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">Unable to load weather</p>
            )}
          </div>
        </section>

        {/* Schedule */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Schedule</h2>
          {events.length === 0 ? (
            <p className="text-slate-400">No meetings today!</p>
          ) : (
            <div className="space-y-2">
              {events.map((event) => (
                <div key={event.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-slate-400">{formatTime(event.start)} - {formatTime(event.end)}</p>
                  </div>
                  {event.hangoutLink && (
                    <a href={event.hangoutLink} target="_blank" className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm">Join</a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* News */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Top Tech News</h2>
          <div className="space-y-3">
            {news.map((article, i) => (
              <a key={i} href={article.url} target="_blank" className="block bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 hover:border-blue-500/50 transition">
                <p className="font-medium">{article.title}</p>
                <p className="text-sm text-slate-500 mt-1">{article.source?.name}</p>
              </a>
            ))}
            {news.length === 0 && (
              <p className="text-slate-400">Unable to load news</p>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <a href="/tasks" className="bg-slate-700/30 hover:bg-slate-600/30 rounded-lg p-4 text-center border border-slate-600/50">
              View Tasks
            </a>
            <a href="https://mail.google.com" target="_blank" className="bg-slate-700/30 hover:bg-slate-600/30 rounded-lg p-4 text-center border border-slate-600/50">
              Check Email
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
