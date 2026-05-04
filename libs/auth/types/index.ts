export interface AuthUser {
  id: string
  email: string | undefined
  name?: string
  avatarUrl?: string
}

export interface AuthSession {
  accessToken: string
  refreshToken?: string
  user: AuthUser
}

export interface AuthResponse {
  user: AuthUser
  session: AuthSession
}

export interface OAuthResponse {
  url: string
}

