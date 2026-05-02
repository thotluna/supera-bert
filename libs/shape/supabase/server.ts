import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { cache } from 'react'

export const createClient = cache(async () => {
  const cookieStore = await cookies()

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // El método `setAll` fue llamado desde un Server Component.
            // Esto es normal y se puede ignorar en Server Components.
          }
        },
      },
    }
  )

  return client
})
