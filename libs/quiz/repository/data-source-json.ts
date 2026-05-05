import { Question, ITCTopic, TopicOption } from '../models';
import { QuestionRepository } from './question-repository';
import itcManifest from '@/data/itc-manifest.json';

export class JSONDataSource implements QuestionRepository {
  /**
   * Dynamically imports ITC data. 
   * Next.js/Webpack will bundle all JSON files in the data folder 
   * because of the template literal pattern.
   */
  private async importITCData(itc: string): Promise<unknown> {
    try {
      // The template literal informs the bundler to include all matching files in the data directory
      const dataModule = await import(`@/data/${itc.toLowerCase()}.json`) as { default?: unknown };
      return dataModule.default || dataModule;
    } catch (error) {
      console.error(`Error dynamically importing ${itc}:`, error);
      return null;
    }
  }

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
    // itcManifest is an array of strings like ["ITC-BT-01", "ITC-BT-03", ...]
    return itcManifest.map(itcName => ({
      name: itcName as ITCTopic,
      available: true
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  private async loadFromImports(itcs?: ITCTopic[]): Promise<Record<string, Question[]>> {
    const allQuestions: Record<string, Question[]> = {};

    // Determine which ITCs to load from the manifest
    const itcsToLoad = itcs && itcs.length > 0
      ? itcs.filter(itc => itcManifest.includes(itc))
      : itcManifest as ITCTopic[];

    for (const itc of itcsToLoad) {
      try {
        const json = await this.importITCData(itc);
        if (!json) continue;
        
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
        console.error(`Error processing data for ${itc}:`, error);
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
