'use client';

import { useState, useEffect } from 'react';

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  hangoutLink?: string;
  attendees: number;
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/calendar')
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <a href="/" className="text-slate-400 hover:text-white mb-4 inline-block">← Back</a>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span>📅</span> Today's Calendar
          </h1>
          <p className="text-slate-400 mt-2">Your schedule at a glance</p>
        </header>

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : events.length === 0 ? (
          <div className="bg-slate-700/30 rounded-xl p-8 text-center">
            <p className="text-4xl mb-4">🎉</p>
            <p className="text-slate-400">No meetings scheduled for today!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-slate-400 text-sm mt-1">
                      {formatDate(event.start)} • {formatTime(event.start)} - {formatTime(event.end)}
                    </p>
                  </div>
                  {event.hangoutLink && (
                    <a
                      href={event.hangoutLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm transition"
                    >
                      Join
                    </a>
                  )}
                </div>
                {event.attendees > 0 && (
                  <p className="text-slate-500 text-sm mt-2">
                    {event.attendees} attendee{event.attendees > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
