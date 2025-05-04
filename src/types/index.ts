
export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at?: string;
}

export interface Teacher extends User {
  role: 'teacher';
}

export interface Student extends User {
  role: 'student';
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: Difficulty;
}

export interface QuizResult {
  id: string;
  studentId: string;
  studentName: string;
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  date: string;
}
