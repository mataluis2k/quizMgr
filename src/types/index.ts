export type Theme = 'light' | 'dark' | 'custom';
export type ButtonShape = 'rounded' | 'square';
export type QuestionType = 'multiple_choice' | 'user_input';

export interface Colors {
  primary: string;
  secondary: string;
}

export interface ButtonStyle {
  shape: ButtonShape;
  icon: string;
}

export interface Styling {
  theme: Theme;
  fontFamily: string;
  fontSize: string;
  colors: Colors;
  buttonStyle: ButtonStyle;
}

export interface Answer {
  answer_id?: string;
  answer: string;
  image?: string;
  order: number;
}

export interface Question {
  question_id?: string;
  type: QuestionType;
  text: string;
  styling?: Record<string, string>;
  question_answers: Answer[];
}

export interface Quiz {
  quiz_id?: string;
  quiz_name: string;
  description?: string;
  styling: Styling;
  questions: Question[];
}

export interface QuizListItem {
  quiz_id: string;
  quiz_name: string;
  updated_at: string;
}