import axios from 'axios';
import { Quiz, QuizListItem } from '../types';
import { authApi } from './auth';

// Base API URL - should be set from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  data: T[];
  metadata: {
    totalRecords: number;
    limit: number;
    offset: number;
    totalPages: number;
  };
  requestId: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = authApi.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors and common error cases
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authApi.logout();
      window.location.href = '/login';
    }
    // Handle other common error cases
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    }
    if (error.response?.status === 403) {
      throw new Error('You do not have permission to perform this action');
    }
    if (error.response?.status >= 500) {
      throw new Error('Server error occurred. Please try again later');
    }
    return Promise.reject(error);
  }
);

interface SaveQuizResponse {
  message: string;
  requestId: string;
}

export const quizApi = {
  listQuizzes: async (): Promise<ApiResponse<QuizListItem>> => {
    try {
      const response = await api.get<ApiResponse<QuizListItem>>('/quizzes');
      return response.data;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  },

  getQuiz: async (quizId: string): Promise<Quiz> => {
    try {
      const response = await api.get<Quiz>(`/quizzes/${quizId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching quiz ${quizId}:`, error);
      throw error;
    }
  },

  saveQuiz: async (quiz: Quiz): Promise<SaveQuizResponse> => {
    try {
      const method = quiz.quiz_id ? 'put' : 'post';
      const url = quiz.quiz_id ? `/quizzes/${quiz.quiz_id}` : '/quizzes';
      
      // For updates, only send the allowed fields
      const quizData = quiz.quiz_id ? {
        quiz_name: quiz.quiz_name,
        description: quiz.description || '',
        styling: {
          theme: quiz.styling.theme,
          fontFamily: quiz.styling.fontFamily,
          fontSize: quiz.styling.fontSize,
          colors: {
            primary: quiz.styling.colors.primary,
            secondary: quiz.styling.colors.secondary
          },
          buttonStyle: {
            shape: quiz.styling.buttonStyle.shape,
            icon: quiz.styling.buttonStyle.icon
          }
        },
        questions: quiz.questions.map(q => ({
          question_id: q.question_id,
          type: q.type,
          text: q.text,
          question_answers: q.question_answers.map(a => ({
            answer_id: a.answer_id,
            answer: a.answer,
            image: a.image,
            score: a.score,
            order: a.order
          }))
        }))
      } : {
        // For new quizzes, send the complete object without updated_at
        quiz_name: quiz.quiz_name,
        description: quiz.description || '',
        styling: quiz.styling,
        questions: quiz.questions
      };

      const response = await api[method]<SaveQuizResponse>(url, quizData);
      
      // Check if we have a valid response with message
      if (!response.data || !response.data.message) {
        throw new Error('Invalid response from server');
      }

      return response.data;
    } catch (error: any) {
      console.error('Error saving quiz:', error);
      if (error.response?.status === 404) {
        throw new Error('Quiz not found');
      }
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to update this quiz');
      }
      throw new Error(error.response?.data?.message || 'Failed to save quiz. Please try again.');
    }
  },

  deleteQuiz: async (quizId: string): Promise<{ success: boolean }> => {
    try {
      const response = await api.delete(`/quizzes/${quizId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting quiz ${quizId}:`, error);
      throw error;
    }
  },
};

export default api;