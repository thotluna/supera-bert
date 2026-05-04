'use server'

import { Factory } from "@/libs/shape/factory";
import { AuthUser } from "../types";
import { DomainResponse } from "@/libs/shape/auth/types";

export async function verifyUser(): Promise<DomainResponse<AuthUser>> {

  const service = Factory.getAuthService()

  return service.getUser()

}