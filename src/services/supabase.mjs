import { createServerClient as _createServerClient } from '@supabase/ssr'

export const createServerClient = () => {
  return _createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ADMIN_KEY,
    {
      cookies: {
        get() {
          return ''
        },
        set() {
          try {
          } catch (error) {}
        },
        remove() {
          try {
          } catch (error) {}
        },
      },
    }
  )
}
