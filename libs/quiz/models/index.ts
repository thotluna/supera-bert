export type ModeQuiz = 'timed' | 'standard' | 'untimed'

type Tens = '0' | '1' | '2' | '3' | '4' | '5';
type Units = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type ITCTopic = `ITC-BT-${Exclude<`${Tens}${Units}`, '00' | `4${4 | 5 | 6 | 7 | 8 | 9}` | `5${3 | 4 | 5 | 6 | 7 | 8 | 9}`>}`;

export interface TopicOption {
  name: ITCTopic;
  available: boolean;
  totalQuestions: number;
}

export interface Option {
  id: number;
  answer: string;
  isCorrect: boolean;
  explanation: string;
}
export type QuestionType = 'simple' | 'multiple';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options: Option[];
  itc?: string;
}


export interface ResponseQuestion {
  id: string;
  question: string;
  selectedOptions: Option[]; // Opciones validadas con explicación e isCorrect
  time: number;
  points: number;
  isCorrect: boolean;
  itc?: string;
}


export interface ConfigQuiz {
  userId: string;
  mode: ModeQuiz;
  time?: number;
  questionCount: number;
  topics: ITCTopic[];
}

export type PauseReason = 'visibility' | 'modal' | 'feedback' | 'manual';
