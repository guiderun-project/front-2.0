import { Fragment, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { Icon, Text } from '@/components';

type AccountMenuItem = {
  key: string;
  label: string;
  onClick?: () => void;
};

type AccountMenuProps = {
  onInquiry?: () => void;
  onViewTerms?: () => void;
  onWithdraw?: () => void;
  onLogout?: () => void;
};

export const AccountMenu = ({
  onInquiry,
  onViewTerms,
  onWithdraw,
  onLogout,
}: AccountMenuProps): ReactElement => {
  const items: AccountMenuItem[] = [
    { key: 'inquiry', label: '문의하러 가기', onClick: onInquiry },
    { key: 'terms', label: '약관보기', onClick: onViewTerms },
    { key: 'withdraw', label: '탈퇴하기', onClick: onWithdraw },
    { key: 'logout', label: '로그아웃하기', onClick: onLogout },
  ];

  return (
    <Card aria-label="계정 설정">
      {items.map((item, index) => (
        <Fragment key={item.key}>
          {index > 0 ? <Divider aria-hidden={true} /> : null}
          <MenuItem type="button" onClick={item.onClick}>
            <MenuLabel color="text.primary" font="body-m-sb">
              {item.label}
            </MenuLabel>
            <Icon color="icon.tertiary" icon="chevron-right-lined" size={20} />
          </MenuItem>
        </Fragment>
      ))}
    </Card>
  );
};

const Card = styled.section(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xl,
  width: '100%',
  padding: `${theme.spacing.xl} ${theme.spacing['2xl']}`,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.color.bg.elevated,
}));

const MenuItem = styled.button(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.xl,
  width: '100%',
  padding: 0,
  border: 0,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const MenuLabel = styled(Text)({
  flex: '1 1 0',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const Divider = styled.hr(({ theme }) => ({
  width: '100%',
  height: 0,
  margin: 0,
  border: 0,
  borderTop: `1px solid ${theme.color.border.subtle}`,
}));
