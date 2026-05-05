'use server'

import { Factory } from "@/libs/shape/factory";
import { verifyUser } from "@/libs/auth/actions/verify-user";
import { DomainResponse } from "@/libs/shape/auth/types";
import { UserStats } from "../domain/stats";

export async function getUserStatsAction(): Promise<DomainResponse<UserStats>> {
  const userResult = await verifyUser();
  if (userResult.error || !userResult.data) {
    return { data: null, error: userResult.error || new Error("Unauthorized") };
  }

  const statsService = await Factory.getStatsService();
  return statsService.getUserStats(userResult.data.id);
}
