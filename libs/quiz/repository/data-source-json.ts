import fs from 'fs';
import path from 'path';
import { Question, ITCTopic, TopicOption } from '../models';
import { QuestionRepository } from './question-repository';

export class JSONDataSource implements QuestionRepository {
  private static readonly DATA_PATH = path.join(process.cwd(), 'data');

  async getAll(itcs?: ITCTopic[], count?: number, excludeIds?: string[]): Promise<Question[]> {
    const allData = await this.loadFromFiles(itcs);
    let combinedQuestions: Question[] = Object.values(allData).flat();

    if (excludeIds && excludeIds.length > 0) {
      combinedQuestions = combinedQuestions.filter(q => !excludeIds.includes(q.id));
    }

    combinedQuestions = this.shuffle(combinedQuestions);

    if (count && count > 0) {
      combinedQuestions = combinedQuestions.slice(0, count);
    }

    return combinedQuestions;
  }

  async checkAnswer(questionId: string, answerId: number): Promise<boolean> {
    const question = await this.findFullQuestionById(questionId);
    if (!question) return false;

    const option = question.options.find(o => o.id === answerId);
    return option?.isCorrect ?? false;
  }

  async getCorrectAnswer(questionIds: string[]): Promise<Question[]> {
    const allData = await this.loadFromFiles();
    const flattened = Object.values(allData).flat();

    return flattened.filter(q => questionIds.includes(q.id));
  }

  async getTopicsAvailability(): Promise<TopicOption[]> {
    if (!fs.existsSync(JSONDataSource.DATA_PATH)) return [];

    const files = fs.readdirSync(JSONDataSource.DATA_PATH)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', '').toUpperCase());

    return files.map(itcName => ({
      name: itcName as ITCTopic,
      available: true
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  private async loadFromFiles(itcs?: ITCTopic[]): Promise<Record<string, Question[]>> {
    if (!fs.existsSync(JSONDataSource.DATA_PATH)) {
      throw new Error(`Data directory not found at: ${JSONDataSource.DATA_PATH}`);
    }

    const files = fs.readdirSync(JSONDataSource.DATA_PATH)
      .filter(f => f.endsWith('.json'))
      .filter(f => {
        if (!itcs || itcs.length === 0) return true;
        const fileITC = f.replace('.json', '').toUpperCase();
        return itcs.includes(fileITC as ITCTopic);
      });

    const allQuestions: Record<string, Question[]> = {};

    for (const file of files) {
      const filePath = path.join(JSONDataSource.DATA_PATH, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const json = JSON.parse(content);
      const itcKey = file.replace('.json', '').toUpperCase();

      let questions: Question[] = [];

      if (Array.isArray(json) && json.length > 0 && json[0].questions) {
        questions = json[0].questions;
      } else if (Array.isArray(json)) {
        questions = json;
      }

      allQuestions[itcKey] = questions.map(q => ({ ...q, itc: itcKey }));
    }

    return allQuestions;
  }

  private async findFullQuestionById(id: string): Promise<Question | undefined> {
    const allData = await this.loadFromFiles();
    return Object.values(allData).flat().find(q => q.id === id);
  }

  private shuffle<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
  }


}
