import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthService } from './auth.service'
import { AuthRepository } from '../repository/auth-repository'

describe('AuthService', () => {
  let service: AuthService
  let mockRepo: AuthRepository

  beforeEach(() => {
    mockRepo = {
      exchangeCodeForSession: vi.fn(),
      getUser: vi.fn(),
      signInWithGoogle: vi.fn(),
      logout: vi.fn(),
    }
    service = new AuthService(mockRepo)
  })

  it('should call repository exchangeCodeForSession', async () => {
    const mockResponse = { data: null, error: null }
    vi.mocked(mockRepo.exchangeCodeForSession).mockResolvedValue(mockResponse)

    await service.exchangeCodeForSession('code')

    expect(mockRepo.exchangeCodeForSession).toHaveBeenCalledWith('code')
  })

  it('should call repository getUser', async () => {
    await service.getUser()
    expect(mockRepo.getUser).toHaveBeenCalled()
  })

  it('should call repository signInWithGoogle', async () => {
    await service.signInWithGoogle()
    expect(mockRepo.signInWithGoogle).toHaveBeenCalled()
  })

  it('should call repository logout', async () => {
    await service.logout()
    expect(mockRepo.logout).toHaveBeenCalled()
  })
})
