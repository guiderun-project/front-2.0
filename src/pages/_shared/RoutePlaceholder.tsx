import { useEffect, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { HiddenText } from '@/components/HiddenText';
import { Text } from '@/components/Text';

// 새로 삽입된 라이브 리전을 브라우저/스크린리더가 인식할 시간을 준 뒤 텍스트를
// 주입해야 낭독 누락을 막을 수 있다 (Loader 의 LIVE_REGION_ANNOUNCE_DELAY_MS 와 동기화).
const LIVE_REGION_ANNOUNCE_DELAY_MS = 150;

// TODO: Remove this scaffold component as each route is replaced with its real page UI.
type RoutePlaceholderProps = {
  description: string;
  /**
   * 로딩/오류 같은 상태 메시지 용도일 때 true.
   * 시각 텍스트는 즉시 렌더하고, 별도의 숨김 라이브 리전(role="status")을
   * 빈 상태로 마운트한 뒤 지연 주입해 초기 마운트와 동일 위치 내용 교체
   * 모두 polite 낭독을 보장한다. 시각적 변화는 없다.
   */
  status?: boolean;
  title: string;
};

export const RoutePlaceholder = ({
  description,
  status = false,
  title,
}: RoutePlaceholderProps): ReactElement => {
  const [announcedMessage, setAnnouncedMessage] = useState('');

  useEffect(() => {
    if (!status) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setAnnouncedMessage(`${title} ${description}`);
    }, LIVE_REGION_ANNOUNCE_DELAY_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [description, status, title]);

  return (
    <PlaceholderSection>
      {status ? <HiddenText role="status">{announcedMessage}</HiddenText> : null}
      <Text as="h1" font="heading-s-sb">
        {title}
      </Text>
      <Text as="p" color="text.tertiary" font="body-s-r">
        {description}
      </Text>
    </PlaceholderSection>
  );
};

const PlaceholderSection = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing['4xl']} ${theme.spacing['2xl']}`};
`;
