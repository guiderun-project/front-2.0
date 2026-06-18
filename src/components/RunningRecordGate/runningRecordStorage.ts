const STORAGE_KEY = 'guiderun.running-record.dismissed';

const readDismissedEventIds = (): number[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];

    return Array.isArray(parsed)
      ? parsed.filter((id): id is number => typeof id === 'number')
      : [];
  } catch {
    return [];
  }
};

export const getDismissedEventIds = (): Set<number> =>
  new Set(readDismissedEventIds());

export const dismissEventId = (eventId: number): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const next = Array.from(new Set([...readDismissedEventIds(), eventId]));

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 저장 실패는 무시한다. 메모리 상태로만 닫힘이 유지된다.
  }
};
