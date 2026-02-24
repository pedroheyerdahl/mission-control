import { NextResponse } from 'next/server';

const WORK_ACCESS_TOKEN = process.env.GOOGLE_WORK_ACCESS_TOKEN;

export async function GET() {
  if (!WORK_ACCESS_TOKEN) {
    return NextResponse.json({ error: 'Calendar not configured' }, { status: 500 });
  }
  
  try {
    const now = new Date();
    const timeMin = now.toISOString();
    const timeMax = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/pedro@kilocode.ai/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          'Authorization': `Bearer ${WORK_ACCESS_TOKEN}`,
        },
      }
    );
    
    const data = await response.json();
    
    const events = (data.items || []).map((event: any) => ({
      id: event.id,
      title: event.summary,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      hangoutLink: event.hangoutLink,
      attendees: event.attendees?.length || 0,
    }));
    
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch calendar' }, { status: 500 });
  }
}
