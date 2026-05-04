import { ITCTopic, Question, TopicOption } from "../models";

export interface QuestionRepository {
  getAll(itc?: ITCTopic[], count?: number, excludeIds?: string[]): Promise<Question[]>;
  checkAnswer(questionId: string, answerId: number): Promise<boolean>;
  getCorrectAnswer(questionIds: string[]): Promise<Question[]>;
  getTopicsAvailability(): Promise<TopicOption[]>;
}