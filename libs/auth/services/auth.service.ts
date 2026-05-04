import { AuthRepository } from "../repository/auth-repository"
import { AuthResponse, AuthUser, OAuthResponse } from "../types"
import { DomainResponse } from "@/libs/shape/auth/types"

export class AuthService {
  constructor(private readonly repo: AuthRepository) {}

  async exchangeCodeForSession(code: string): Promise<DomainResponse<AuthResponse>> {
    return this.repo.exchangeCodeForSession(code)
  }

  async getUser(): Promise<DomainResponse<AuthUser>> {
    return this.repo.getUser()
  }

  async signInWithGoogle(): Promise<DomainResponse<OAuthResponse>> {
    return this.repo.signInWithGoogle()
  }

  async logout(): Promise<DomainResponse<void>> {
    return this.repo.logout()
  }
}