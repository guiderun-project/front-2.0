/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ENABLE_MSW?: 'true' | 'false';
  readonly VITE_MOCK_AUTHENTICATED?: 'true' | 'false';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
