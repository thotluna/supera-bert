'use server'

import { Factory } from "@/libs/shape/factory"

export const signoutAction = async () => {
  const service = Factory.getAuthService()

  const result = await service.logout()

  return result
}