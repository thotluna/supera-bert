'use server'

import { Factory } from "@/libs/shape/factory"

export async function signInWithGoogle() {

  const service = Factory.getAuthService()

  return service.signInWithGoogle()
}
