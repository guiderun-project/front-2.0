import type { AttendedGuideRunner } from '@/api/types';

const CSV_HEADERS = ['이름', '생년월일', '1365 ID'] as const;
const CSV_UTF8_BOM = '\uFEFF';

type BuildAttendanceGuideCsvFilenameParams = {
  eventDate: string;
  eventId: number;
  eventName: string;
};

type DownloadCsvFileParams = {
  content: string;
  filename: string;
};

const escapeCsvValue = (value: string | null) => {
  const text = value ?? '';

  if (!/[",\r\n]/.test(text)) {
    return text;
  }

  return `"${text.replace(/"/g, '""')}"`;
};

const buildCsvRow = (values: readonly (string | null)[]) => {
  return values.map(escapeCsvValue).join(',');
};

const sanitizeFilenamePart = (value: string, fallback: string) => {
  const sanitized = value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  return sanitized || fallback;
};

export const buildAttendedGuideRunnerCsv = (
  items: readonly AttendedGuideRunner[],
) => {
  const rows = [
    buildCsvRow(CSV_HEADERS),
    ...items.map((item) =>
      buildCsvRow([item.name, item.birthDate, item.id1365]),
    ),
  ];

  return `${CSV_UTF8_BOM}${rows.join('\r\n')}\r\n`;
};

export const buildAttendanceGuideCsvFilename = ({
  eventDate,
  eventId,
  eventName,
}: BuildAttendanceGuideCsvFilenameParams) => {
  const fallback = `event-${eventId}`;
  const safeEventDate = sanitizeFilenamePart(eventDate, fallback);
  const safeEventName = sanitizeFilenamePart(eventName, fallback);

  return `출석_가이드러너_명단_${safeEventDate}_${safeEventName}.csv`;
};

export const downloadCsvFile = ({
  content,
  filename,
}: DownloadCsvFileParams) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  window.setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 0);
};
