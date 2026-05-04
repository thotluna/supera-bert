'use server'

import { Factory } from "@/libs/shape/factory";
import { AuthService } from "../services/auth.service";
import { AuthResponse } from "../types";
import { DomainResponse } from "@/libs/shape/auth/types";

export async function exchangeCodeForSession(code: string): Promise<DomainResponse<AuthResponse>> {

  const service: AuthService = Factory.getAuthService()

  return service.exchangeCodeForSession(code)

}

