/// <reference types="vite/client" />

/**
 * TypeScript IntelliSense for Vite environment variables.
 * Context7 recommended pattern: augment ImportMetaEnv in vite-env.d.ts.
 * See: https://vite.dev/guide/env-and-mode
 */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL:      string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
