import { DomainResponse } from "@/libs/shape/auth/types";
import { UserItcStats } from "../domain/progress";
import { ProgressService } from "../services/progress.service";

export class GetUserStatsAction {
  constructor(private readonly progressService: ProgressService) {}

  async execute(userId: string): Promise<DomainResponse<UserItcStats[]>> {
    return this.progressService.getUserProgress(userId);
  }
}
