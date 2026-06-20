const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export const formatActivityEventDate = (date: string): string => {
  const [year, month, day] = date.split('-').map(Number);
  const weekday = WEEKDAY_LABELS[new Date(year, month - 1, day).getDay()];

  return `${year}. ${String(month).padStart(2, '0')}. ${String(day).padStart(2, '0')} ${weekday}`;
};
