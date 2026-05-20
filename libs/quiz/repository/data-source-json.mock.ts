import { ITCTopic, Question, TopicOption } from "../models";
import { QuestionRepository } from "./question-repository";

export class JSONDataSource implements QuestionRepository {
  private mockQuestions: Question[] = [
    {
      id: "q1",
      question: "Question 1 (Simple Correct)",
      type: "simple",
      options: [
        { id: 1, answer: "Option 1", isCorrect: true, explanation: "Correct" },
        { id: 2, answer: "Option 2", isCorrect: false, explanation: "Incorrect" }
      ],
      itc: "ITC-BT-01" as ITCTopic
    },
    {
      id: "q2",
      question: "Question 2 (Multiple Correct)",
      type: "multiple",
      options: [
        { id: 1, answer: "Option 1", isCorrect: true, explanation: "Correct" },
        { id: 2, answer: "Option 2", isCorrect: true, explanation: "Correct" },
        { id: 3, answer: "Option 3", isCorrect: false, explanation: "Incorrect" }
      ],
      itc: "ITC-BT-01" as ITCTopic
    },
    {
      id: "q3",
      question: "Question 3 (Simple Incorrect)",
      type: "simple",
      options: [
        { id: 1, answer: "Option 1", isCorrect: true, explanation: "Correct" },
        { id: 2, answer: "Option 2", isCorrect: false, explanation: "Incorrect" }
      ],
      itc: "ITC-BT-01" as ITCTopic
    },
    {
      id: "q4",
      question: "Question 4 (Multiple Incorrect)",
      type: "multiple",
      options: [
        { id: 1, answer: "Option 1", isCorrect: true, explanation: "Correct" },
        { id: 2, answer: "Option 2", isCorrect: true, explanation: "Correct" },
        { id: 3, answer: "Option 3", isCorrect: false, explanation: "Incorrect" }
      ],
      itc: "ITC-BT-01" as ITCTopic
    },
    {
      id: "q5",
      question: "Question 5 (Unanswered)",
      type: "simple",
      options: [
        { id: 1, answer: "Option 1", isCorrect: true, explanation: "Correct" },
        { id: 2, answer: "Option 2", isCorrect: false, explanation: "Incorrect" }
      ],
      itc: "ITC-BT-01" as ITCTopic
    },
    {
      id: "q6",
      question: "Question 6 (ITC-BT-03)",
      type: "simple",
      options: [
        { id: 1, answer: "Option 1", isCorrect: true, explanation: "Correct" },
        { id: 2, answer: "Option 2", isCorrect: false, explanation: "Incorrect" }
      ],
      itc: "ITC-BT-03" as ITCTopic
    }
  ];

  async getAll(itc?: ITCTopic[], count?: number, excludeIds?: string[]): Promise<Question[]> {
    let filtered = [...this.mockQuestions];

    // if (itc && itc.length > 0) {
    //   filtered = filtered.filter(q => itc.includes(q.itc));
    // }

    if (excludeIds && excludeIds.length > 0) {
      filtered = filtered.filter(q => !excludeIds.includes(q.id));
    }

    return filtered.slice(0, count ?? filtered.length);
  }

  async checkAnswer(questionId: string, answerId: number): Promise<boolean> {
    const q = this.mockQuestions.find(q => q.id === questionId);
    return q?.options.find(o => o.id === answerId)?.isCorrect || false;
  }

  async getCorrectAnswer(questionIds: string[]): Promise<Question[]> {
    return this.mockQuestions.filter(q => questionIds.includes(q.id));
  }

  async getTopicsAvailability(): Promise<TopicOption[]> {
    return [
      { name: "ITC-BT-01" as ITCTopic, available: true, totalQuestions: 50 },
      { name: "ITC-BT-03" as ITCTopic, available: true, totalQuestions: 30 }
    ];
  }
}
