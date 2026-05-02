import { createClient } from '@/libs/shape/supabase/server'
import { headers } from 'next/headers'
import { User } from '@supabase/supabase-js'
import {
  AuthUser,
  AuthResponse,
  OAuthResponse,
  DomainResponse,
} from '../types'

export interface AuthRepository {
  exchangeCodeForSession(code: string): Promise<DomainResponse<AuthResponse>>
  getUser(): Promise<DomainResponse<AuthUser>>
  signInWithGoogle(): Promise<DomainResponse<OAuthResponse>>
  logout(): Promise<DomainResponse<void>>
}

export class AuthRepositorySupabase implements AuthRepository {
  private mapUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name,
      avatarUrl: user.user_metadata?.avatar_url,
    }
  }

  async exchangeCodeForSession(code: string): Promise<DomainResponse<AuthResponse>> {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) return { data: null, error }
    if (!data.user || !data.session) return { data: null, error: new Error('Invalid session data') }

    const user = this.mapUser(data.user)

    return {
      data: {
        user,
        session: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          user,
        },
      },
      error: null,
    }
  }

  async getUser(): Promise<DomainResponse<AuthUser>> {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    
    if (error) return { data: null, error }
    
    return {
      data: data.user ? this.mapUser(data.user) : null,
      error: null,
    }
  }

  async signInWithGoogle(): Promise<DomainResponse<OAuthResponse>> {
    const supabase = await createClient()
    
    const headerList = await headers()
    const host = headerList.get('host')
    const protocol = host?.includes('localhost') ? 'http' : 'https'
    const origin = `${protocol}://${host}`

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })
    
    if (error) return { data: null, error }
    if (!data.url) return { data: null, error: new Error('No redirect URL provided') }
    
    return { data: { url: data.url }, error: null }
  }

  async logout(): Promise<DomainResponse<void>> {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) return { data: null, error }
    
    return { data: undefined, error: null }
  }
}