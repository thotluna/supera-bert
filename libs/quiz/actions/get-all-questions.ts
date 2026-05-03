import { QuestionClient, ITCTopic } from "../models";
import { QuestionRepository } from "../repository/question-repository";
import { JSONDataSource } from "../repository/data-source-json";

export async function getAllQuestions(topics: ITCTopic[], count: number): Promise<QuestionClient[]> {
  const repository: QuestionRepository = new JSONDataSource();
  return await repository.getAll(topics, count);
}