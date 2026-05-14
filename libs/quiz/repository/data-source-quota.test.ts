import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSONDataSource } from './data-source-json';
import itcManifest from '@/data/itc-manifest.json';

// Mocking the dynamic imports and manifest
vi.mock('@/data/itc-manifest.json', () => ({
  default: ['itc-bt-test']
}));

describe('JSONDataSource Quota Regression', () => {
  let dataSource: JSONDataSource;

  beforeEach(() => {
    dataSource = new JSONDataSource();
    // @ts-ignore - Mocking private method for testing
    vi.spyOn(dataSource, 'loadFromImports').mockResolvedValue({
      'itc-bt-test': Array.from({ length: 50 }, (_, i) => ({
        id: `q-${i}`,
        question: `Question ${i}`,
        options: [],
        itc: 'itc-bt-test',
        type: 'simple'
      }))
    });
  });

  it('should return the full requested quota even if most questions are excluded (Regression #2)', async () => {
    // Escenario: El usuario ha acertado 48 de las 50 preguntas.
    const masteredIds = Array.from({ length: 48 }, (_, i) => `q-${i}`);
    
    // El usuario pide un quiz de 10 preguntas.
    // Antes, esto devolvería solo 2 (las no acertadas).
    const questions = await dataSource.getAll(['itc-bt-test' as any], 10, masteredIds);

    expect(questions.length).toBe(10);
    
    // Verificamos que incluya las 2 preguntas "nuevas" que quedaban
    const newQuestions = questions.filter(q => !masteredIds.includes(q.id));
    expect(newQuestions.length).toBe(2);

    // Y que haya rellenado las otras 8 con preguntas de repaso
    const reviewQuestions = questions.filter(q => masteredIds.includes(q.id));
    expect(reviewQuestions.length).toBe(8);
  });
});
