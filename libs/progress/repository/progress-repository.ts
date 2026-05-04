import { DomainResponse } from "@/libs/shape/auth/types";
import { UserItcStats } from "../domain/progress";

export interface ProgressRepository {
  getAllStats(userId: string): Promise<DomainResponse<UserItcStats[]>>;
  
  getStatsByItc(userId: string, itcCode: string): Promise<DomainResponse<UserItcStats>>;
}
