import { CreateReportDto, ReportResponse } from "../repository/report-data-source";
import { ReportRepository } from "../repository/report-repository";

export class ReportService {
  constructor(private readonly repository: ReportRepository) {}

  async reportQuestion(dto: CreateReportDto): Promise<ReportResponse> {
    return this.repository.create(dto);
  }
}
