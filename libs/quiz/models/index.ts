export type ModeQuiz = 'timed' | 'standard' | 'untimed'

type Tens = '0' | '1' | '2' | '3' | '4' | '5';
type Units = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type ITCTopic = `ITC-BT-${Exclude<`${Tens}${Units}`, '00' | `4${4 | 5 | 6 | 7 | 8 | 9}` | `5${3 | 4 | 5 | 6 | 7 | 8 | 9}`>}`;

export interface TopicOption {
  name: ITCTopic;
  available: boolean;
}

export interface Option {
  id: number;
  answer: string;
  isCorrect: boolean;
  explanation: string;
}

export type OptionClient = Omit<Option, 'isCorrect' | 'explanation'>;

export interface Question {
  id: string;
  type: 'simple' | 'multiple';
  question: string;
  options: Option[];
  itc?: string;
}

export interface QuestionClient {
  id: string;
  type: 'simple' | 'multiple';
  question: string;
  options: OptionClient[];
  itc?: string;
}

export interface ConfigQuiz {
  userId: string;
  mode: ModeQuiz;
  time?: number;
  questionCount: number;
  topic: ITCTopic;
}
