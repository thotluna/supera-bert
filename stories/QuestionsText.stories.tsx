import type { Meta, StoryObj } from '@storybook/react';
import { QuestionsText } from '../app/quiz/components/questions-text';
import { useQuizStore } from '@/libs/stores/quiz-store';
import { Question } from '@/libs/quiz/models';
import { useEffect } from 'react';

const meta: Meta<typeof QuestionsText> = {
  title: 'Quiz/QuestionsText',
  component: QuestionsText,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story, context) => {
      const { question } = context.args as { question: Question };
      
      useEffect(() => {
        if (question) {
          useQuizStore.setState({ 
            currentQuestion: question,
            isPaused: false
          });
        }
      }, [question]);

      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<{ question: Question }>;

export const Default: Story = {
  args: {
    question: {
      id: 'q1',
      question: '¿Cuál es la tensión nominal en corriente alterna para instalaciones de baja tensión según el REBT?',
      type: 'simple',
      itc: 'ITC-BT-08',
      options: [
        { id: 1, answer: '230/400 V', isCorrect: true, explanation: 'Tensiones normalizadas.' },
        { id: 2, answer: '127/220 V', isCorrect: false, explanation: 'Tensiones obsoletas.' }
      ]
    }
  },
};

export const LongQuestion: Story = {
  args: {
    question: {
      id: 'q2',
      question: 'Considerando una instalación industrial con una potencia instalada superior a 100 kW y varios receptores trifásicos, ¿cuál es el procedimiento normativo para la compensación del factor de potencia y qué ITC regula las condiciones de instalación de baterías de condensadores?',
      type: 'simple',
      itc: 'ITC-BT-43',
      options: [
        { id: 1, answer: 'Se regula en la ITC-BT-43', isCorrect: true, explanation: 'Correcto.' }
      ]
    }
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
  args: {
    question: {
      id: 'q3',
      question: '¿Qué tipo de cable se debe utilizar en una instalación de enlace?',
      type: 'simple',
      itc: 'ITC-BT-15',
      options: [
        { id: 1, answer: 'Cables unipolares', isCorrect: true, explanation: 'Según normativa.' }
      ]
    }
  },
};
