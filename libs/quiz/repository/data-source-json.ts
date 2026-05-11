import { Question, ITCTopic, TopicOption } from '../models';
import { QuestionRepository } from './question-repository';
import itcManifest from '@/data/itc-manifest.json';

const GENERAL_POOL_IDS = ["ree-general", "itc-bt-anexo-1", "itc-bt-scopes"];

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
    const totalCount = count || 20; // Default count if not provided
    const generalCount = Math.floor(totalCount * 0.1);
    const topicCount = totalCount - generalCount;

    // 1. Load topic-specific questions
    const topicData = await this.loadFromImports(itcs);
    let topicQuestions: Question[] = Object.values(topicData).flat();
    
    if (excludeIds && excludeIds.length > 0) {
      topicQuestions = topicQuestions.filter(q => !excludeIds.includes(q.id));
    }
    topicQuestions = this.shuffle(topicQuestions).slice(0, topicCount);

    // 2. Load general pool questions (10%)
    const generalData = await this.loadGeneralPool();
    let generalQuestions: Question[] = Object.values(generalData).flat();
    
    if (excludeIds && excludeIds.length > 0) {
      generalQuestions = generalQuestions.filter(q => !excludeIds.includes(q.id));
    }
    generalQuestions = this.shuffle(generalQuestions).slice(0, generalCount);

    // 3. Combine and shuffle again
    const finalQuestions = this.shuffle([...topicQuestions, ...generalQuestions]);

    return finalQuestions;
  }

  async checkAnswer(questionId: string, answerId: number): Promise<boolean> {
    const question = await this.findFullQuestionById(questionId);
    if (!question) return false;

    const option = question.options.find(o => o.id === answerId);
    return option?.isCorrect ?? false;
  }

  async getCorrectAnswer(questionIds: string[]): Promise<Question[]> {
    const topicData = await this.loadFromImports();
    const generalData = await this.loadGeneralPool();
    const flattened = [
      ...Object.values(topicData).flat(),
      ...Object.values(generalData).flat()
    ];

    const questionsMap = new Map(flattened.map(q => [q.id, q]));
    return questionIds
      .map(id => questionsMap.get(id))
      .filter((q): q is Question => !!q);
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

  private async loadGeneralPool(): Promise<Record<string, Question[]>> {
    const allQuestions: Record<string, Question[]> = {};

    for (const itc of GENERAL_POOL_IDS) {
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

        allQuestions[itc] = questions.map(q => ({ ...q, itc: itc as ITCTopic }));
      } catch (error) {
        console.error(`Error processing general pool data for ${itc}:`, error);
      }
    }

    return allQuestions;
  }

  private async findFullQuestionById(id: string): Promise<Question | undefined> {
    const topicData = await this.loadFromImports();
    const generalData = await this.loadGeneralPool();
    const allQuestions = [
      ...Object.values(topicData).flat(),
      ...Object.values(generalData).flat()
    ];
    return allQuestions.find(q => q.id === id);
  }

  private shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }
}
