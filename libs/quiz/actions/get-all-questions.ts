import { Factory } from "@/libs/shape/factory";
import { Question, ITCTopic } from "../models";

export async function getAllQuestions(topics: ITCTopic[], count: number): Promise<Question[]> {
  const service = await Factory.getQuizService();
  return await service.getAll(topics, count);
}