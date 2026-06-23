/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_KAKAO_JAVASCRIPT_KEY?: string;
  readonly VITE_KAKAO_REST_API_KEY?: string;
  readonly VITE_KAKAO_REDIRECT_URI?: string;
  readonly VITE_ENABLE_MSW?: 'true' | 'false';
  readonly VITE_MOCK_AUTHENTICATED?: 'true' | 'false';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type KakaoShareLink = {
  mobileWebUrl: string;
  webUrl: string;
};

type KakaoShareDefaultOptions = {
  objectType: 'feed';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: KakaoShareLink;
  };
  buttons: {
    title: string;
    link: KakaoShareLink;
  }[];
};

type KakaoShareCustomOptions = {
  templateId: number;
  templateArgs: {
    title: string;
    content: string;
    REGI_WEB_DOMAIN: string;
    EVENT_URL: string;
    STATUS_URL: string;
  };
};

type KakaoJavascriptSdk = {
  cleanup: () => void;
  init: (javascriptKey: string) => void;
  Share: {
    sendDefault: (options: KakaoShareDefaultOptions) => void;
    sendCustom: (options: KakaoShareCustomOptions) => void;
  };
};

interface Window {
  Kakao?: KakaoJavascriptSdk;
}
