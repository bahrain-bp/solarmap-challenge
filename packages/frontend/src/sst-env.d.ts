/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_REGION: string
  readonly VITE_MAP_NAME: string
  readonly VITE_IDENTITY_POOL_ID: string
  readonly VITE_TILER_API_KEY: string
  readonly VITE_USER_POOL_ID: string
  readonly VITE_USER_POOL_CLIENT_ID: string
  readonly VITE_WEB_SOCKET_API_KEY: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}