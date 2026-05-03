import { TopicOption } from "../models";
import { QuestionRepository } from "../repository/question-repository";

export class QuizService {
  constructor(private readonly repository: QuestionRepository) {}

  async getTopics(): Promise<TopicOption[]> {
    return this.repository.getTopicsAvailability();
  }
}
