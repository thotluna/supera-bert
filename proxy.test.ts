import { describe, it, expect, vi, beforeEach } from 'vitest'
import { proxy } from './proxy'
import { NextResponse, NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Mock next/server
vi.mock('next/server', () => ({
  NextResponse: {
    next: vi.fn().mockImplementation((options) => ({
      ...options,
      cookies: { set: vi.fn() },
    })),
    redirect: vi.fn().mockImplementation((url) => ({
      url,
      status: 302,
    })),
  },
  NextRequest: vi.fn(),
}))

// Mock supabase/ssr
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}))

describe('Auth Proxy Middleware', () => {
  const mockGetUser = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(createServerClient).mockReturnValue({
      auth: { getUser: mockGetUser },
    } as unknown as ReturnType<typeof createServerClient>)
  })

  it('should redirect to /login if user is not authenticated and route is private', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    
    const request = {
      nextUrl: { pathname: '/dashboard' },
      url: 'http://localhost:3000/dashboard',
      headers: new Headers(),
      cookies: { 
        getAll: vi.fn().mockReturnValue([]),
        get: vi.fn().mockReturnValue(undefined)
      },
    } as unknown as NextRequest

    await proxy(request)

    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/login'
    }))
  })

  it('should redirect to / if user is authenticated and tries to access /login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: '1' } } })
    
    const request = {
      nextUrl: { pathname: '/login' },
      url: 'http://localhost:3000/login',
      headers: new Headers(),
      cookies: { 
        getAll: vi.fn().mockReturnValue([]),
        get: vi.fn().mockReturnValue(undefined)
      },
    } as unknown as NextRequest

    await proxy(request)

    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/'
    }))
  })

  it('should allow access to public routes even if not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    
    const request = {
      nextUrl: { pathname: '/login' },
      url: 'http://localhost:3000/login',
      headers: new Headers(),
      cookies: { 
        getAll: vi.fn().mockReturnValue([]),
        get: vi.fn().mockReturnValue(undefined)
      },
    } as unknown as NextRequest

    await proxy(request)

    expect(NextResponse.next).toHaveBeenCalled()
  })
})
