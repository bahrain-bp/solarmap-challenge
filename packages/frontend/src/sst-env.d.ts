/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_REGION: string
  readonly VITE_MAP_NAME: string
  readonly VITE_IDENTITY_POOL_ID: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}