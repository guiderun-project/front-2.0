import type {
  EventMatchingStatusResponse,
  MatchingGroup,
  MatchingRow,
  MatchingUser,
} from '@/api/types';

type MatchingStatusRowType = 'matched' | 'unmatchedVi' | 'unmatchedGuide';

export type MatchingStatusViewRow = {
  guides: MatchingUser[];
  id: string;
  type: MatchingStatusRowType;
  vi: MatchingUser | null;
};

type MatchingStatusViewGroup = Omit<MatchingGroup, 'rows'> & {
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
        guides: [],
        id: `${rowKey}-${row.vi.userId}`,
        type: 'unmatchedVi',
        vi: row.vi,
      },
    ];
  }

  return row.guides.map((guide) => ({
    guides: [guide],
    id: `${rowKey}-${guide.userId}`,
    type: 'unmatchedGuide',
    vi: null,
  }));
};
