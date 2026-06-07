import type {
  EventMatchingStatusResponse,
  MatchingGroup,
  MatchingRow,
  MatchingUser,
} from '@/api/types';

type MatchingStatusRowType = 'matched' | 'unmatchedVi' | 'unmatchedGuide';

export type MatchingStatusViewRow = {
  accessibilityLabel: string;
  guides: MatchingUser[];
  id: string;
  type: MatchingStatusRowType;
  vi: MatchingUser | null;
};

export type MatchingStatusViewGroup = Omit<MatchingGroup, 'rows'> & {
  rows: MatchingStatusViewRow[];
};

export type MatchingStatusViewModel = {
  groups: MatchingStatusViewGroup[];
  isEmpty: boolean;
  myPartners: MatchingUser[];
};

export const createMatchingStatusViewModel = (
  data: EventMatchingStatusResponse,
): MatchingStatusViewModel => {
  const groups = data.groups
    .map<MatchingStatusViewGroup>((group) => ({
      ...group,
      rows: group.rows.flatMap((row, rowIndex) =>
        createViewRows(row, `${group.runningGroup}-${rowIndex}`),
      ),
    }))
    .filter((group) => group.rows.length > 0);

  return {
    groups,
    isEmpty: groups.length === 0,
    myPartners: data.myPartners,
  };
};

const createViewRows = (
  row: MatchingRow,
  rowKey: string,
): MatchingStatusViewRow[] => {
  if (row.vi && row.guides.length > 0) {
    return [
      {
        accessibilityLabel: `${row.vi.name}의 가이드러너 ${formatGuideNames(row.guides)}`,
        guides: row.guides,
        id: `${rowKey}-${row.vi.userId}`,
        type: 'matched',
        vi: row.vi,
      },
    ];
  }

  if (row.vi) {
    return [
      {
        accessibilityLabel: `${row.vi.name} 매칭되지 않음`,
        guides: [],
        id: `${rowKey}-${row.vi.userId}`,
        type: 'unmatchedVi',
        vi: row.vi,
      },
    ];
  }

  return row.guides.map((guide) => ({
    accessibilityLabel: `${guide.name} 매칭되지 않음`,
    guides: [guide],
    id: `${rowKey}-${guide.userId}`,
    type: 'unmatchedGuide',
    vi: null,
  }));
};

const formatGuideNames = (guides: MatchingUser[]) => {
  return guides.map((guide) => guide.name).join(', ');
};
