export interface ApiResponse {
  message: string;
  status: string;
  timestamp?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  instructor: User;
  title: string;
  description: string;
  cover_image?: string | null;
  created_at: string;
  updated_at: string;
  materials?: Material[];
  quizzes?: Quiz[];
  materials_count?: number;
  quizzes_count?: number;
  progress?: {
    percentage: number;
    is_completed?: boolean;
    total_items?: number;
    completed_items?: number;
  };
}

export interface Material {
  id: number;
  course_id: number;
  title: string;
  content_type: "pdf" | "video";
  file_path: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: number;
  course_id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  questions?: Question[];
}

export interface Question {
  id: number;
  quiz_id: number;
  question_text: string;
  created_at: string;
  updated_at: string;
  answers?: Answer[];
}

export interface Answer {
  id: number;
  question_id: number;
  answer_text: string;
  is_correct: boolean;
  created_at: string;
  updated_at: string;
}

export interface Progress {
  id: number;
  user_id: number;
  course_id: number;
  material_id: number | null;
  quiz_id: number | null;
  is_completed: boolean;
  status: "completed";
  created_at: string;
  updated_at: string;
  course?: Course;
}

export interface ProgressUpdateResponse {
  percentage: number;
  completed_items: number;
  total_items: number;
}

export interface CourseProgressSummary {
  id: number;
  title: string;
  cover_image?: string;
  percentage: number;
  completed_items: number;
  total_items: number;
  is_completed: boolean;
}

export interface Certificate {
  id: number;
  user_id: number;
  course_id: number;
  certificate_code: string;
  issued_at: string;
  certificate_url?: string;
  course?: Course;
  user?: {
    id: number;
    name: string;
  };
}

export interface QuizSubmission {
  quiz_id: number;
  answers: {
    question_id: number;
    answer_id: number;
  }[];
}

export interface QuizResult {
  score: number;
  total_questions: number;
  correct_answers: number;
  percentage: number;
  passed: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}
