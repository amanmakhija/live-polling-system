export interface QuestionType {
  question: string;
  options: string[];
  correctAnswers: number[];
  duration: number;
  responses?: Record<string, string>;
}
