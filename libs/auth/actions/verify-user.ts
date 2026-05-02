'use server'

import { Factory } from "@/libs/shape/factory";
import { AuthUser, DomainResponse } from "../types";

export async function verifyUser(): Promise<DomainResponse<AuthUser>> {

  const service = Factory.getAuthService()

  return service.getUser()

}