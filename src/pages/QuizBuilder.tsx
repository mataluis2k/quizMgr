import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusCircle, Save, ArrowLeft, Check, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { Quiz, Question, QuestionType } from '../types';
import { quizApi } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import QuestionCard from '../components/quiz/QuestionCard';
import QuizStyling from '../components/quiz/QuizStyling';
import QuizPreview from '../components/quiz/QuizPreview';

const QuizBuilder: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [quiz, setQuiz] = useState<Quiz>({
    quiz_name: '',
    styling: {
      theme: 'light',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      colors: {
        primary: '#4F46E5',
        secondary: '#0D9488',
      },
      buttonStyle: {
        shape: 'rounded',
        icon: 'check',
      },
    },
    questions: [],
  });
  
  // Form validation
  const [errors, setErrors] = useState<{
    quiz_name?: string;
    questions?: string;
  }>({});
  
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
      toast.error('Failed to load quiz. Please try again.');
      console.error('Error loading quiz:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz({ ...quiz, quiz_name: e.target.value });
    // Clear error if it exists
    if (errors.quiz_name) {
      setErrors({ ...errors, quiz_name: undefined });
    }
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuiz({ ...quiz, description: e.target.value });
  };
  
  const handleStylingUpdate = (updatedStyling: Quiz['styling']) => {
    setQuiz({ ...quiz, styling: updatedStyling });
  };
  
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      question_id: uuidv4(),
      type: 'multiple_choice' as QuestionType,
      text: '',
      question_answers: [],
    };
    
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, newQuestion],
    });
    
    // Clear questions error if it exists
    if (errors.questions) {
      setErrors({ ...errors, questions: undefined });
    }
  };
  
  const handleQuestionUpdate = (index: number, updatedQuestion: Question) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = updatedQuestion;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };
  
  const handleQuestionRemove = (index: number) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions.splice(index, 1);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(quiz.questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setQuiz({ ...quiz, questions: items });
  };
  
  const validateQuiz = (): boolean => {
    const newErrors: { quiz_name?: string; questions?: string } = {};
    
    if (!quiz.quiz_name.trim()) {
      newErrors.quiz_name = 'Quiz name is required';
    }
    
    if (quiz.questions.length === 0) {
      newErrors.questions = 'Add at least one question';
    } else {
      // Check if all questions have text and if multiple choice questions have at least 2 answers
      const invalidQuestions = quiz.questions.filter(q => {
        if (!q.text.trim()) return true;
        if (q.type === 'multiple_choice' && q.question_answers.length < 2) return true;
        return false;
      });
      
      if (invalidQuestions.length > 0) {
        newErrors.questions = 'Some questions are incomplete or have fewer than 2 answer options';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = async () => {
    if (!validateQuiz()) {
      toast.error('Please fix the errors before saving');
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await quizApi.saveQuiz(quiz);
      
      if (response.success) {
        toast.success('Quiz saved successfully!');
        
        // Update the URL if this is a new quiz
        if (!quizId) {
          navigate(`/builder/${response.quiz_id}`, { replace: true });
        }
      }
    } catch (error) {
      toast.error('Failed to save quiz. Please try again.');
      console.error('Error saving quiz:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleBackToDashboard = () => {
    navigate('/');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft size={18} />}
            onClick={handleBackToDashboard}
            className="mr-2"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            {quizId ? 'Edit Quiz' : 'Create New Quiz'}
          </h1>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          isLoading={isSaving}
          icon={<Save size={18} />}
        >
          Save Quiz
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="space-y-4">
          <Input
            label="Quiz Name"
            value={quiz.quiz_name}
            onChange={handleNameChange}
            placeholder="Enter quiz name"
            error={errors.quiz_name}
            fullWidth
            required
          />
          
          <TextArea
            label="Description (optional)"
            value={quiz.description || ''}
            onChange={handleDescriptionChange}
            placeholder="Describe what this quiz is about..."
            fullWidth
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddQuestion}
                icon={<PlusCircle size={16} />}
              >
                Add Question
              </Button>
            </div>
            
            {errors.questions && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {errors.questions}
              </div>
            )}
            
            {quiz.questions.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-full mb-4">
                  <PlusCircle size={24} className="text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No questions yet</h3>
                <p className="text-gray-500 mb-4">Add your first question to get started.</p>
                <Button
                  variant="primary"
                  onClick={handleAddQuestion}
                  icon={<PlusCircle size={18} />}
                >
                  Add Question
                </Button>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="questions">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {quiz.questions.map((question, index) => (
                        <Draggable
                          key={question.question_id || `question-${index}`}
                          draggableId={question.question_id || `question-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <QuestionCard
                              question={question}
                              index={index}
                              onUpdate={handleQuestionUpdate}
                              onRemove={handleQuestionRemove}
                              provided={provided}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
          
          <QuizStyling styling={quiz.styling} onUpdate={handleStylingUpdate} />
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Eye size={20} className="mr-2 text-indigo-600" />
              Preview
            </h2>
            <QuizPreview quiz={quiz} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizBuilder;