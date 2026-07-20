import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactElement,
} from "react";

import styled from "@emotion/styled";
import {
  createSearchParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { MY_ACTIVITY_PARTNER_SORTS } from "@/api/constants/user";
import type { MyActivityPartnerSort } from "@/api/types";
import { HiddenText, PageLayout, TopNavigation } from "@/components";
import { useAnnouncedMessage } from "@/pages/my/hooks/useAnnouncedMessage";

import { MyRunningTab } from "./components/MyRunningTab";

import { MyActivityPartnersContent } from "./partners";

const MY_ACTIVITY_TAB_ITEMS = [
  { key: "event", label: "나의 러닝" },
  { key: "partner", label: "함께 달린 파트너" },
] as const;

const DEFAULT_PARTNER_PAGE = 1;
const DEFAULT_PARTNER_SORT = MY_ACTIVITY_PARTNER_SORTS.RECENT;

type MyActivityTab = (typeof MY_ACTIVITY_TAB_ITEMS)[number]["key"];

const resolveTab = (value: string | null): MyActivityTab =>
  value === "partner" ? "partner" : "event";

const resolvePartnerSort = (value: string | null): MyActivityPartnerSort =>
  value === MY_ACTIVITY_PARTNER_SORTS.OLD
    ? MY_ACTIVITY_PARTNER_SORTS.OLD
    : DEFAULT_PARTNER_SORT;

const resolvePage = (value: string | null): number => {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : DEFAULT_PARTNER_PAGE;
};

export const MyEventsPage = (): ReactElement => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // 정렬/페이지 변경 시 트랜지션으로 기존 목록을 유지해, 재서스펜드로
  // 누르던 버튼이 숨겨지며 포커스(SR 커서)가 유실되는 것을 막는다.
  const [, startTransition] = useTransition();
  const selectedTab = resolveTab(searchParams.get("tab"));
  const partnerSort = resolvePartnerSort(searchParams.get("sort"));
  const partnerPage = resolvePage(searchParams.get("page"));
  const rawPartnerPage = searchParams.get("page");

  // 정렬 변경 시 목록이 조용히 교체되므로, 데이터 로드 완료 후 SR 전용
  // 리전으로 갱신을 안내한다. (페이지 이동은 Pagination이 자동 안내하므로 제외)
  const pendingSortAnnouncementRef = useRef(false);
  const [partnerListNotice, setPartnerListNotice] = useState({
    message: "",
    revision: 0,
  });
  const announcedPartnerListNotice = useAnnouncedMessage(
    partnerListNotice.message,
    partnerListNotice.revision,
  );

  const scrollToPageTop = useCallback(() => {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "auto",
    });
  }, []);

  useEffect(() => {
    if (selectedTab !== "partner") {
      return;
    }

    if (rawPartnerPage !== null && partnerPage !== Number(rawPartnerPage)) {
      setSearchParams(
        createSearchParams({
          tab: "partner",
          sort: partnerSort,
          page: String(DEFAULT_PARTNER_PAGE),
        }),
        { replace: true },
      );
    }
  }, [partnerPage, partnerSort, rawPartnerPage, selectedTab, setSearchParams]);

  const handlePartnerSortChange = useCallback(
    (nextSort: MyActivityPartnerSort) => {
      pendingSortAnnouncementRef.current = true;
      startTransition(() => {
        setSearchParams(
          createSearchParams({
            tab: "partner",
            sort: nextSort,
            page: String(DEFAULT_PARTNER_PAGE),
          }),
          { replace: true },
        );
      });
      window.requestAnimationFrame(scrollToPageTop);
    },
    [scrollToPageTop, setSearchParams],
  );

  const handlePartnerPageChange = useCallback(
    (nextPage: number) => {
      startTransition(() => {
        setSearchParams(
          createSearchParams({
            tab: "partner",
            sort: partnerSort,
            page: String(nextPage),
          }),
          { replace: true },
        );
      });
      window.requestAnimationFrame(scrollToPageTop);
    },
    [partnerSort, scrollToPageTop, setSearchParams],
  );

  const handlePartnersLoaded = useCallback((totalCount: number) => {
    if (!pendingSortAnnouncementRef.current) {
      return;
    }

    pendingSortAnnouncementRef.current = false;
    setPartnerListNotice((previous) => ({
      message:
        totalCount > 0
          ? `정렬을 변경해 총 ${totalCount}명의 파트너 목록을 갱신했어요.`
          : "정렬을 변경했어요. 아직 함께 달린 파트너가 없어요.",
      revision: previous.revision + 1,
    }));
  }, []);

  useEffect(() => {
    if (selectedTab !== "partner") {
      pendingSortAnnouncementRef.current = false;
    }
  }, [selectedTab]);

  return (
    <Page background="bg.subtle">
      <TopNavigation
        left={{
          icon: "chevron-left-lined",
          ariaLabel: "뒤로가기",
          onClick: () => navigate(-1),
        }}
        title="나의 활동"
      />

      <TabNav aria-label="나의 활동">
        {MY_ACTIVITY_TAB_ITEMS.map(({ key, label }) => (
          <TabLink
            key={key}
            aria-current={selectedTab === key ? "page" : undefined}
            replace
            to={{ search: createSearchParams({ tab: key }).toString() }}
          >
            {label}
          </TabLink>
        ))}
      </TabNav>

      {selectedTab === "event" ? <MyRunningTab /> : null}

      {selectedTab === "partner" ? (
        <MyActivityPartnersContent
          page={partnerPage}
          sort={partnerSort}
          onLoaded={handlePartnersLoaded}
          onPageChange={handlePartnerPageChange}
          onSortChange={handlePartnerSortChange}
        />
      ) : null}

      <HiddenText role="status">{announcedPartnerListNotice}</HiddenText>
    </Page>
  );
};

const Page = styled(PageLayout)({
  display: "flex",
  flexDirection: "column",
});

const TabNav = styled.nav(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.none,
  padding: theme.spacing["2xl"],
}));

const TabLink = styled(Link)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: theme.pxToRem(42),
  paddingInline: theme.spacing.xl,
  borderRadius: theme.radius.md,
  color: theme.color.text.tertiary,
  textDecoration: "none",
  ...theme.typography["body-m-m"],
  transition: "color 120ms ease, background-color 120ms ease",

  '&[aria-current="page"]': {
    backgroundColor: theme.color.bg.overlay,
    color: theme.color.text.secondary,
    ...theme.typography["body-m-sb"],
  },

  "&:focus-visible": {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },

  "@media (hover: hover)": {
    '&:hover:not([aria-current="page"])': {
      color: theme.color.text.secondary,
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
}));
