import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Quiz, Question } from '../../types';
import Button from '../ui/Button';

interface QuizPreviewProps {
  quiz: Quiz;
}

const QuizPreview: React.FC<QuizPreviewProps> = ({ quiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const hasQuestions = quiz.questions.length > 0;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  
  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleTextInputChange = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };
  
  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionId]: optionIndex,
    });
  };
  
  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSelectedOptions({});
  };
  
  // Apply the quiz styling
  const baseStyles = {
    fontFamily: quiz.styling.fontFamily || 'Inter, sans-serif',
    fontSize: quiz.styling.fontSize || '16px',
  };
  
  const themeStyles = {
    backgroundColor: quiz.styling.theme === 'dark' ? '#1f2937' : quiz.styling.theme === 'light' ? '#ffffff' : '#f9fafb',
    color: quiz.styling.theme === 'dark' ? '#f9fafb' : '#1f2937',
    borderColor: quiz.styling.theme === 'dark' ? '#374151' : '#e5e7eb',
  };
  
  const renderQuestionContent = (question: Question) => {
    const questionId = question.question_id || `question-${currentQuestionIndex}`;
    
    if (question.type === 'multiple_choice') {
      return (
        <div className="space-y-3">
          {question.question_answers.map((answer, index) => (
            <div
              key={answer.answer_id || `answer-${index}`}
              className="flex items-start space-x-3 p-3 rounded transition-colors cursor-pointer"
              onClick={() => handleOptionSelect(questionId, index)}
              style={{
                backgroundColor: selectedOptions[questionId] === index 
                  ? quiz.styling.theme === 'dark' 
                    ? '#374151' 
                    : '#f3f4f6'
                  : 'transparent',
                border: '1px solid',
                borderColor: selectedOptions[questionId] === index 
                  ? quiz.styling.colors.primary 
                  : themeStyles.borderColor,
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
                style={{
                  border: '2px solid',
                  borderColor: selectedOptions[questionId] === index 
                    ? quiz.styling.colors.primary 
                    : quiz.styling.colors.secondary,
                  backgroundColor: selectedOptions[questionId] === index 
                    ? quiz.styling.colors.primary 
                    : 'transparent',
                }}
              >
                {selectedOptions[questionId] === index && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#ffffff' }}
                  ></div>
                )}
              </div>
              <div className="flex-1">
                <p>{answer.answer}</p>
                {answer.image && (
                  <img
                    src={answer.image}
                    alt={answer.answer}
                    className="mt-2 rounded max-w-full h-auto"
                    style={{ maxHeight: '120px' }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (question.type === 'user_input') {
      return (
        <div className="mt-4">
          <textarea
            value={answers[questionId] || ''}
            onChange={(e) => handleTextInputChange(questionId, e.target.value)}
            className="w-full p-3 border rounded"
            rows={4}
            placeholder="Type your answer here..."
            style={{
              borderColor: themeStyles.borderColor,
              backgroundColor: themeStyles.backgroundColor,
              color: themeStyles.color,
            }}
          ></textarea>
        </div>
      );
    }
    
    return null;
  };
  
  if (!hasQuestions) {
    return (
      <div 
        className="bg-white p-6 rounded-lg border shadow-sm h-full flex flex-col items-center justify-center"
      >
        <p className="text-gray-500 mb-2">No questions added yet.</p>
        <p className="text-sm text-gray-400">Add questions to see a preview here.</p>
      </div>
    );
  }
  
  return (
    <div 
      className="bg-white p-6 rounded-lg border shadow-sm h-full flex flex-col"
      style={{
        ...baseStyles,
        ...themeStyles,
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 
          className="text-lg font-semibold"
          style={{ color: quiz.styling.colors.primary }}
        >
          {quiz.quiz_name}
        </h3>
        <div className="text-sm">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
      </div>
      
      {currentQuestion && (
        <div className="flex-1">
          <div className="mb-6">
            <h4 className="text-xl font-medium mb-2">{currentQuestion.text}</h4>
            {renderQuestionContent(currentQuestion)}
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-4 pt-4 border-t" style={{ borderColor: themeStyles.borderColor }}>
        <Button
          onClick={handlePreviousQuestion}
          disabled={isFirstQuestion}
          variant="outline"
          icon={<ChevronLeft size={16} />}
          style={{
            opacity: isFirstQuestion ? 0.5 : 1,
            borderRadius: quiz.styling.buttonStyle.shape === 'rounded' ? '0.375rem' : '0',
          }}
        >
          Previous
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          icon={<RefreshCw size={16} />}
        >
          Reset
        </Button>
        
        <Button
          onClick={handleNextQuestion}
          disabled={isLastQuestion}
          variant="primary"
          iconPosition="right"
          icon={<ChevronRight size={16} />}
          style={{
            backgroundColor: quiz.styling.colors.primary,
            opacity: isLastQuestion ? 0.5 : 1,
            borderRadius: quiz.styling.buttonStyle.shape === 'rounded' ? '0.375rem' : '0',
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default QuizPreview;