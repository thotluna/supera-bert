import { Question, ITCTopic, TopicOption } from '../models';
import { QuestionRepository } from './question-repository';
import itcManifest from '@/data/itc-manifest.json';

const GENERAL_POOL_IDS = ["ree-general", "itc-bt-scopes", "ip-ik"];

export class JSONDataSource implements QuestionRepository {
  private async importITCData(itc: string): Promise<unknown> {
    try {
      const dataModule = await import(`@/data/${itc.toLowerCase()}.json`) as { default?: unknown };
      return dataModule.default || dataModule;
    } catch (error) {
      console.error(`Error dynamically importing ${itc}:`, error);
      return null;
    }
  }

  async getAll(itcs?: ITCTopic[], count?: number, excludeIds?: string[]): Promise<Question[]> {
    const totalDesired = count || 20;
    const itcList = itcs || [];
    const topicTarget = totalDesired;

    const allTopicData = await this.loadFromImports(itcList);
    const finalQuestions: Question[] = [];

    const effectiveITCs = itcList.length > 0 
      ? itcList 
      : (await this.getTopicsAvailability()).map(t => t.name);

    const perTopicQuota = Math.floor(topicTarget / effectiveITCs.length);
    const remainder = topicTarget % effectiveITCs.length;
    const shuffledITCs = this.shuffle([...effectiveITCs]);

    shuffledITCs.forEach((itc, index) => {
      let questions = allTopicData[itc] || [];
      if (excludeIds) {
        questions = questions.filter(q => !excludeIds.includes(q.id));
      }
      
      const quota = perTopicQuota + (index < remainder ? 1 : 0);
      if (quota > 0) {
        const selected = this.shuffle(questions).slice(0, quota);
        finalQuestions.push(...selected);
      }
    });

    if (finalQuestions.length < totalDesired) {
       const allAvailable = Object.values(allTopicData).flat()
         .filter(q => !finalQuestions.find(fq => fq.id === q.id));
       
       if (excludeIds) {
         const filtered = allAvailable.filter(q => !excludeIds.includes(q.id));
         finalQuestions.push(...this.shuffle(filtered).slice(0, totalDesired - finalQuestions.length));
       } else {
         finalQuestions.push(...this.shuffle(allAvailable).slice(0, totalDesired - finalQuestions.length));
       }
    }

    return this.shuffle(finalQuestions);
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
    return itcManifest.map(itcName => ({
      name: itcName as ITCTopic,
      available: true
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  private async loadFromImports(itcs?: ITCTopic[]): Promise<Record<string, Question[]>> {
    const allQuestions: Record<string, Question[]> = {};

    const itcsToLoad = itcs && itcs.length > 0
      ? itcs.filter(itc => itcManifest.includes(itc))
      : itcManifest as ITCTopic[];

    const results = await Promise.all(
      itcsToLoad.map(async (itc) => {
        try {
          const json = await this.importITCData(itc);
          if (!json) return { itc, questions: [] };
          
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
          return { itc, questions: questions.map(q => ({ ...q, itc })) };
        } catch (error) {
          console.error(`Error processing data for ${itc}:`, error);
          return { itc, questions: [] };
        }
      })
    );

    results.forEach(({ itc, questions }) => {
      if (questions.length > 0) {
        allQuestions[itc] = questions;
      }
    });

    return allQuestions;
  }

  private async loadGeneralPool(): Promise<Record<string, Question[]>> {
    const allQuestions: Record<string, Question[]> = {};

    const results = await Promise.all(
      GENERAL_POOL_IDS.map(async (itc) => {
        try {
          const json = await this.importITCData(itc);
          if (!json) return { itc, questions: [] };
          
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
          return { itc, questions: questions.map(q => ({ ...q, itc: itc as ITCTopic })) };
        } catch (error) {
          console.error(`Error processing general pool data for ${itc}:`, error);
          return { itc, questions: [] };
        }
      })
    );

    results.forEach(({ itc, questions }) => {
      if (questions.length > 0) {
        allQuestions[itc] = questions;
      }
    });

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
