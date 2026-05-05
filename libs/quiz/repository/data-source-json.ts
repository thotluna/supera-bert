import { Question, ITCTopic, TopicOption } from '../models';
import { QuestionRepository } from './question-repository';

// Map of statically available ITC data files to ensure they are bundled by Next.js
const ITC_DATA_MAP: Record<string, () => Promise<unknown>> = {
  'ITC-BT-01': () => import('@/data/itc-bt-01.json'),
  'ITC-BT-03': () => import('@/data/itc-bt-03.json'),
  'ITC-BT-04': () => import('@/data/itc-bt-04.json'),
  'ITC-BT-05': () => import('@/data/itc-bt-05.json'),
  'ITC-BT-06': () => import('@/data/itc-bt-06.json'),
  'ITC-BT-07': () => import('@/data/itc-bt-07.json'),
  'ITC-BT-08': () => import('@/data/itc-bt-08.json'),
  'ITC-BT-09': () => import('@/data/itc-bt-09.json'),
  'ITC-BT-10': () => import('@/data/itc-bt-10.json'),
  'ITC-BT-11': () => import('@/data/itc-bt-11.json'),
};

export class JSONDataSource implements QuestionRepository {
  async getAll(itcs?: ITCTopic[], count?: number, excludeIds?: string[]): Promise<Question[]> {
    const allData = await this.loadFromImports(itcs);
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
    const allData = await this.loadFromImports();
    const flattened = Object.values(allData).flat();

    return flattened.filter(q => questionIds.includes(q.id));
  }

  async getTopicsAvailability(): Promise<TopicOption[]> {
    const availableITCs = Object.keys(ITC_DATA_MAP);

    return availableITCs.map(itcName => ({
      name: itcName as ITCTopic,
      available: true
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  private async loadFromImports(itcs?: ITCTopic[]): Promise<Record<string, Question[]>> {
    const allQuestions: Record<string, Question[]> = {};

    // Determine which ITCs to load
    const itcsToLoad = itcs && itcs.length > 0
      ? itcs.filter(itc => ITC_DATA_MAP[itc])
      : Object.keys(ITC_DATA_MAP) as ITCTopic[];

    for (const itc of itcsToLoad) {
      const importFn = ITC_DATA_MAP[itc];
      if (!importFn) continue;

      try {
        const dataModule = await importFn() as { default?: unknown };
        // Handle different JSON structures (wrapped in default or direct)
        const json = dataModule.default || dataModule;
        
        let questions: Question[] = [];

        if (json && typeof json === 'object') {
          if (Array.isArray(json)) {
            if (json.length > 0 && (json[0] as { questions?: unknown }).questions) {
              questions = (json[0] as { questions: Question[] }).questions;
            } else {
              questions = json as Question[];
            }
          }
        }

        allQuestions[itc] = questions.map(q => ({ ...q, itc }));
      } catch (error) {
        console.error(`Error loading data for ${itc}:`, error);
      }
    }

    return allQuestions;
  }

  private async findFullQuestionById(id: string): Promise<Question | undefined> {
    const allData = await this.loadFromImports();
    return Object.values(allData).flat().find(q => q.id === id);
  }

  private shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }
}
