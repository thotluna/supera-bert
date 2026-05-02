import { AuthService } from "@/libs/auth/services/auth.service"
import { AuthRepositorySupabase } from "../auth/repository/auth-repository"

export class Factory {

  static getAuthService() {
    const authRepository: AuthRepositorySupabase = new AuthRepositorySupabase()
    return new AuthService(authRepository)
  }
}