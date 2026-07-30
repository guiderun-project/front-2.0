import { useEffect, useState, type ReactElement } from "react";

import styled from "@emotion/styled";

import {
  EVENT_LIST_TYPE_FILTERS,
  RECRUIT_STATUS_FILTERS,
} from "@/api/constants/common";
import type { EventListTypeFilter, RecruitStatusFilter } from "@/api/types";
import { Filter, HiddenText, Text, type SelectOptions } from "@/components";

const TYPE_FILTER_OPTIONS: SelectOptions<EventListTypeFilter> = [
  { label: "전체", value: EVENT_LIST_TYPE_FILTERS.TOTAL },
  { label: "대회", value: EVENT_LIST_TYPE_FILTERS.COMPETITION },
  { label: "훈련", value: EVENT_LIST_TYPE_FILTERS.TRAINING },
];

const RECRUIT_FILTER_OPTIONS: SelectOptions<RecruitStatusFilter> = [
  { label: "전체", value: RECRUIT_STATUS_FILTERS.ALL },
  { label: "모집중", value: RECRUIT_STATUS_FILTERS.OPEN },
  { label: "모집예정", value: RECRUIT_STATUS_FILTERS.UPCOMING },
  { label: "모집마감", value: RECRUIT_STATUS_FILTERS.CLOSE },
];

// 결과 갱신 안내 낭독이 끝난 뒤 리전을 비우기까지의 지연. 리전 텍스트가 계속
// 남아 있으면 인접한 가시 문구('총 N건' 등)와 함께 탐색 시 두 번 낭독된다.
const STATUS_CLEAR_DELAY_MS = 3000;

type EventResultHeaderProps = {
  totalCount: number;
  showFilters: boolean;
  /**
   * 결과 갱신을 스크린리더에 안내하는 SR 전용 문구. 필터·검색어 변경으로
   * 결과가 바뀌면 상시 마운트된 status 리전에서 낭독된다. 페이지 이동은
   * Pagination 이 자체 안내하므로 건수 중심 문구만 전달한다.
   */
  srStatusMessage: string;
  typeFilter: EventListTypeFilter | undefined;
  recruitFilter: RecruitStatusFilter | undefined;
  onTypeChange: (value: EventListTypeFilter) => void;
  onRecruitChange: (value: RecruitStatusFilter) => void;
};

export const EventResultHeader = ({
  onRecruitChange,
  onTypeChange,
  recruitFilter,
  showFilters,
  srStatusMessage,
  totalCount,
  typeFilter,
}: EventResultHeaderProps): ReactElement => {
  // 라이브 리전은 비어 있는 상태로 먼저 마운트한 뒤 다음 프레임에 메시지를
  // 채워야 결과 갱신이 스크린리더에 안정적으로 낭독된다.
  const [announcedStatus, setAnnouncedStatus] = useState("");

  useEffect(() => {
    let clearTimerId: number | undefined;
    const frameId = window.requestAnimationFrame(() => {
      setAnnouncedStatus(srStatusMessage);
      // 낭독이 끝날 만큼 기다린 뒤 리전을 비워 가시 텍스트와의 중복 탐색
      // 낭독을 막는다. status 리전의 기본 aria-relevant("additions text")에서
      // 텍스트 제거는 낭독되지 않으므로 비우기는 조용히 처리된다.
      clearTimerId = window.setTimeout(() => {
        setAnnouncedStatus("");
      }, STATUS_CLEAR_DELAY_MS);
    });

    return () => {
      window.cancelAnimationFrame(frameId);

      if (clearTimerId !== undefined) {
        window.clearTimeout(clearTimerId);
      }
    };
  }, [srStatusMessage]);

  return (
    <CountRow>
      <Text color="text.secondary" font="body-s-m">
        총 {totalCount}건
      </Text>
      <HiddenText role="status">{announcedStatus}</HiddenText>
      {showFilters ? (
        <Filters>
          <Filter
            ariaLabel="유형 필터"
            icon="chevron-down-lined"
            neutralValue={EVENT_LIST_TYPE_FILTERS.TOTAL}
            options={TYPE_FILTER_OPTIONS}
            placeholder="유형"
            sheetTitle="유형 선택"
            value={typeFilter}
            onChange={onTypeChange}
          />
          <Filter
            ariaLabel="모집구분 필터"
            icon="chevron-down-lined"
            neutralValue={RECRUIT_STATUS_FILTERS.ALL}
            options={RECRUIT_FILTER_OPTIONS}
            placeholder="모집구분"
            sheetTitle="모집구분 선택"
            value={recruitFilter}
            onChange={onRecruitChange}
          />
        </Filters>
      ) : null}
    </CountRow>
  );
};

const CountRow = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const Filters = styled.div(({ theme }) => ({
  display: "flex",
  gap: theme.spacing.sm,
}));
