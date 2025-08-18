/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
  readonly VITE_ENVIRONMENT: string;
  readonly NODE_ENV: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Global types for testing
declare global {
  // eslint-disable-next-line no-var
  var global: typeof globalThis;
  namespace NodeJS {
    interface Global {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    }
  }
}

export {};
