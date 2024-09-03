export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Question {
  _id: string;
  questionText: string;
  answers: Answer[];
}
