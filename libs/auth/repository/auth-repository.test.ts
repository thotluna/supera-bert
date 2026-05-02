import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthRepositorySupabase } from './auth-repository'

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue('localhost:3000'),
  }),
}))

const mockSupabase = vi.hoisted(() => ({
  auth: {
    exchangeCodeForSession: vi.fn(),
    getUser: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
  },
}))

vi.mock('@/libs/shape/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabase),
}))

describe('AuthRepositorySupabase', () => {
  let repository: AuthRepositorySupabase

  beforeEach(() => {
    repository = new AuthRepositorySupabase()
    vi.clearAllMocks()
  })

  describe('exchangeCodeForSession', () => {
    it('should return session data on success', async () => {
      const mockUser = { id: '1', email: 'test@example.com', user_metadata: { full_name: 'Test User' } }
      const mockSession = { access_token: 'access', refresh_token: 'refresh' }
      
      mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      })

      const response = await repository.exchangeCodeForSession('valid-code')

      expect(response.data).not.toBeNull()
      expect(response.error).toBeNull()
      expect(response.data?.user.id).toBe('1')
      expect(response.data?.session.accessToken).toBe('access')
    })

    it('should return error when supabase returns error', async () => {
      const mockError = new Error('Supabase error')
      mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      })

      const response = await repository.exchangeCodeForSession('invalid-code')

      expect(response.data).toBeNull()
      expect(response.error).toBe(mockError)
    })

    it('should return error when session data is missing', async () => {
      mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      })

      const response = await repository.exchangeCodeForSession('valid-code')

      expect(response.data).toBeNull()
      expect(response.error?.message).toBe('Invalid session data')
    })
  })

  describe('getUser', () => {
    it('should return user data when session exists', async () => {
      const mockUser = { id: '1', email: 'test@example.com', user_metadata: { full_name: 'Test User' } }
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const response = await repository.getUser()

      expect(response.data?.id).toBe('1')
      expect(response.error).toBeNull()
    })
  })
})
