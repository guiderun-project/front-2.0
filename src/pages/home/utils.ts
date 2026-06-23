import type { UpcomingEventsGetResponse } from "@/api/types";

export type UpcomingGuestEvent = Extract<
  UpcomingEventsGetResponse,
  { viewerType: "GUEST" }
>["items"][number];

export type UpcomingMemberEvent = Extract<
  UpcomingEventsGetResponse,
  { viewerType: "MEMBER" }
>["items"][number];

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

const pad2 = (value: number) => String(value).padStart(2, "0");

export const formatGuestEventDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.split("-").map(Number);

  if (!year || !month || !day) {
    return isoDate;
  }

  const weekday = WEEKDAY_LABELS[new Date(year, month - 1, day).getDay()];

  return `${year}. ${pad2(month)}. ${pad2(day)} ${weekday}`;
};

export const formatDday = (dDay: number): string =>
  dDay <= 0 ? "D-DAY" : `D-${dDay}`;

export const formatDdayLabel = (dDay: number): string =>
  dDay <= 0 ? "오늘" : `${dDay}일 뒤`;

type RunnerStageHeadline = {
  connector: string;
  body: string;
};

const RUNNER_STAGE_HEADLINES: ReadonlyArray<
  RunnerStageHeadline & { maxCount: number }
> = [
  { maxCount: 1, connector: ",", body: "드디어 첫 발을 뗐어요!" },
  { maxCount: 3, connector: "은", body: "슬슬 달리기 맛을 알아가는 중" },
  { maxCount: 5, connector: "은", body: "나만의 페이스를 찾는 중" },
  { maxCount: 9, connector: "은", body: "이제 제법 러너 티가 나기 시작했어요." },
  { maxCount: 14, connector: "은", body: "바쁠 때도 어떻게든 뛰어요" },
  { maxCount: 25, connector: "은", body: "안 뛰면 하루가 허전한 사람" },
  { maxCount: 30, connector: "은", body: "거의 러닝 고인물이에요" },
  { maxCount: Infinity, connector: "은", body: "직업이 러너신가요..?" },
];

export const getRunnerStageHeadline = (
  participationCount: number,
): RunnerStageHeadline => {
  const stage =
    RUNNER_STAGE_HEADLINES.find(
      ({ maxCount }) => participationCount <= maxCount,
    ) ?? RUNNER_STAGE_HEADLINES[RUNNER_STAGE_HEADLINES.length - 1];

  return { connector: stage.connector, body: stage.body };
};
