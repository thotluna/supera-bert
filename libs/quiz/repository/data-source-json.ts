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
    const allTopicData = await this.loadFromImports(itcList);
    
    const effectiveITCs = itcList.length > 0 
      ? itcList 
      : (await this.getTopicsAvailability()).map(t => t.name);

    // 1. Obtener el universo completo de preguntas de los ITCs seleccionados
    const allAvailableQuestions: Question[] = effectiveITCs.flatMap(itc => allTopicData[itc] || []);
    
    // 2. Separar en Prioritarias (Nuevas) y Secundarias (Ya acertadas/vistas)
    const newQuestions = this.shuffle(
      allAvailableQuestions.filter(q => !excludeIds?.includes(q.id))
    );
    
    const secondaryQuestions = this.shuffle(
      allAvailableQuestions.filter(q => excludeIds?.includes(q.id))
    );

    // 3. Unir ambos mundos manteniendo la prioridad de las nuevas
    const combinedPool = [...newQuestions, ...secondaryQuestions];

    // 4. Tomar el total solicitado
    return combinedPool.slice(0, totalDesired);
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
    const topicData = await this.loadFromImports();
    return itcManifest.map(itcName => ({
      name: itcName as ITCTopic,
      available: true,
      totalQuestions: topicData[itcName]?.length || 0
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
