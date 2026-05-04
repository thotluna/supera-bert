import { DomainResponse } from "@/libs/shape/auth/types";
import { UserItcStats } from "../domain/progress";
import { ProgressRepository } from "../repository/progress-repository";

export class ProgressService {
  constructor(private readonly repository: ProgressRepository) {}

  async getUserProgress(userId: string): Promise<DomainResponse<UserItcStats[]>> {
    return this.repository.getAllStats(userId);
  }

  async getItcPerformance(
    userId: string,
    itcCode: string
  ): Promise<DomainResponse<UserItcStats>> {
    return this.repository.getStatsByItc(userId, itcCode);
  }
}
