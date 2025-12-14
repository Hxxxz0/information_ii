export enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER'
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  EXPERT = 'Expert'
}

export enum QuestionType {
  CHOICE = 'Choice',
  FILL_IN = 'Fill-in',
  CALCULATION = 'Calculation',
  COMPREHENSIVE = 'Comprehensive'
}

export interface KnowledgePoint {
  id: string;
  name: string;
  course: string; // e.g., "Communication Principles"
  mastery: number; // 0 to 100
  description: string;
}

export interface Question {
  id: string;
  content: string;
  options?: string[]; // For Choice questions
  correctAnswer: string;
  type: QuestionType;
  difficulty: Difficulty;
  knowledgePoints: string[]; // IDs
  explanation: string;
}

export interface Exam {
  id: string;
  title: string;
  totalScore: number;
  durationMinutes: number;
  questions: Question[];
  status: 'draft' | 'published' | 'completed';
  targetAudience?: string; // "Class A" or "Student X"
  score?: number; // If completed
}

export interface MisconceptionPattern {
  id: string;
  title: string;
  description: string;
  frequency: number; // Percentage of students making this error
  affectedKnowledgePoints: string[];
  remediationAdvice: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isLoading?: boolean;
  action?: {
    type: 'EXAM_GENERATED' | 'MISCONCEPTION_ANALYSIS';
    payload: any;
  };
}
