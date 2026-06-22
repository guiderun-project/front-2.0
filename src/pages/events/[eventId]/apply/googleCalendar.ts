const GOOGLE_CALENDAR_EVENT_URL = 'https://calendar.google.com/calendar/render';
const GOOGLE_CALENDAR_TIME_ZONE = 'Asia/Seoul';

type GoogleCalendarEvent = {
  content: string;
  name: string;
  place: string;
  schedule: {
    date: string;
    endTime: string;
    startTime: string;
  };
};

const formatGoogleCalendarDateTime = (date: string, time: string) => {
  return `${date.replaceAll('-', '')}T${time.replace(':', '')}00`;
};

export const createGoogleCalendarEventUrl = (
  event: GoogleCalendarEvent,
): string => {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.name,
    dates: [
      formatGoogleCalendarDateTime(event.schedule.date, event.schedule.startTime),
      formatGoogleCalendarDateTime(event.schedule.date, event.schedule.endTime),
    ].join('/'),
    details: event.content,
    location: event.place,
    ctz: GOOGLE_CALENDAR_TIME_ZONE,
  });

  return `${GOOGLE_CALENDAR_EVENT_URL}?${params.toString()}`;
};
