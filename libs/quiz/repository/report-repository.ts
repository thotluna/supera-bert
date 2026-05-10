import { CreateReportDto, ReportResponse } from "./report-data-source";

export interface ReportRepository {
  create(dto: CreateReportDto): Promise<ReportResponse>;
}
