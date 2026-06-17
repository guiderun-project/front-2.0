import { useCallback, useEffect } from 'react';

const KAKAO_DEFAULT_TEMPLATE_ORGANIZER = '장지은';
const KAKAO_CUSTOM_TEMPLATE_ID = 116263;
const KAKAO_SHARE_IMAGE_URL =
  'https://d6wueuvlxdntp.cloudfront.net/Logo.png';

type ShareLink = (
  title: string,
  organizer: string,
  content?: string,
  url?: string,
  statusUrl?: string,
) => void;

const getKakaoSdk = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.Kakao ?? null;
};

const getEventDetailBaseUrl = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.location.href.split('?')[0];
};

export const useKakaoShare = (): { shareLink: ShareLink } => {
  useEffect(() => {
    const kakao = getKakaoSdk();
    const kakaoJavascriptKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

    if (kakao === null || !kakaoJavascriptKey) {
      return;
    }

    kakao.cleanup();
    kakao.init(kakaoJavascriptKey);
  }, []);

  const shareLink = useCallback<ShareLink>(
    (
      title,
      organizer,
      content = `${organizer}님이 만든 이벤트에 참여해보세요!`,
      url,
      statusUrl,
    ) => {
      const kakao = getKakaoSdk();
      const kakaoJavascriptKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

      if (kakao === null || !kakaoJavascriptKey) {
        if (typeof window !== 'undefined') {
          window.alert('카카오톡 공유를 준비하지 못했어요.');
        }
        return;
      }

      const baseUrl = getEventDetailBaseUrl();
      const eventDetailUrl = url ?? baseUrl;
      const applicationStatusUrl = statusUrl ?? `${baseUrl}?section=matching`;

      if (organizer === KAKAO_DEFAULT_TEMPLATE_ORGANIZER) {
        kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title,
            description: content,
            imageUrl: KAKAO_SHARE_IMAGE_URL,
            link: {
              mobileWebUrl: eventDetailUrl,
              webUrl: eventDetailUrl,
            },
          },
          buttons: [
            {
              title: '이벤트 상세',
              link: {
                mobileWebUrl: eventDetailUrl,
                webUrl: eventDetailUrl,
              },
            },
            {
              title: '신청 현황',
              link: {
                mobileWebUrl: applicationStatusUrl,
                webUrl: applicationStatusUrl,
              },
            },
          ],
        });
        return;
      }

      kakao.Share.sendCustom({
        templateId: KAKAO_CUSTOM_TEMPLATE_ID,
        templateArgs: {
          title,
          content,
          REGI_WEB_DOMAIN: eventDetailUrl,
          EVENT_URL: eventDetailUrl,
          STATUS_URL: applicationStatusUrl,
        },
      });
    },
    [],
  );

  return { shareLink };
};
