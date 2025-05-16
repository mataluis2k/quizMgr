import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { quizApi } from '../services/api';
import { Quiz } from '../types';
import Button from '../components/ui/Button';
import QuizPreview from '../components/quiz/QuizPreview';

const QuizPreviewPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (quizId) {
      loadQuiz(quizId);
    }
  }, [quizId]);

  const loadQuiz = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await quizApi.getQuiz(id);
      setQuiz(data);
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz not found</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/')}
          icon={<ArrowLeft size={18} />}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            icon={<ArrowLeft size={18} />}
          >
            Back to Dashboard
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <QuizPreview quiz={quiz} />
        </div>
      </div>
    </div>
  );
};

export default QuizPreviewPage;