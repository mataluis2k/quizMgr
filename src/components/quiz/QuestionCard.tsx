import React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { X, GripVertical, Type, ListChecks } from 'lucide-react';
import { Question, QuestionType } from '../../types';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import MultipleChoiceAnswers from './MultipleChoiceAnswers';

interface QuestionCardProps {
  question: Question;
  index: number;
  onUpdate: (index: number, updatedQuestion: Question) => void;
  onRemove: (index: number) => void;
  provided: DraggableProvided;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  onUpdate,
  onRemove,
  provided,
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(index, { ...question, text: e.target.value });
  };

  const handleTypeChange = (value: string) => {
    const newType = value as QuestionType;
    // If changing from multiple_choice to user_input, clear answers
    const updatedQuestion = {
      ...question,
      type: newType,
      question_answers: newType === 'user_input' ? [] : question.question_answers,
    };
    onUpdate(index, updatedQuestion);
  };

  const handleAnswersUpdate = (updatedAnswers: Question['question_answers']) => {
    onUpdate(index, { ...question, question_answers: updatedAnswers });
  };

  const questionTypeOptions = [
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'user_input', label: 'Text Input' },
  ];

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="mb-4"
    >
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div {...provided.dragHandleProps} className="cursor-grab">
              <GripVertical className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Question {index + 1}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={<X size={18} />}
            onClick={() => onRemove(index)}
            aria-label="Remove question"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Question Text"
            value={question.text}
            onChange={handleTextChange}
            placeholder="Enter your question here..."
            fullWidth
            required
          />

          <Select
            label="Question Type"
            value={question.type}
            options={questionTypeOptions}
            onChange={handleTypeChange}
            fullWidth
          />

          {question.type === 'multiple_choice' && (
            <MultipleChoiceAnswers
              answers={question.question_answers}
              onUpdate={handleAnswersUpdate}
            />
          )}

          {question.type === 'user_input' && (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div className="flex items-center space-x-2 text-gray-500 mb-2">
                <Type size={18} />
                <span className="text-sm font-medium">Text Input Question</span>
              </div>
              <p className="text-sm text-gray-600">
                Users will be able to type their answer in a text field. No predefined answers needed.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            {question.type === 'multiple_choice' ? (
              <div className="flex items-center space-x-1">
                <ListChecks size={16} />
                <span>
                  {question.question_answers.length} answer{question.question_answers.length !== 1 ? 's' : ''}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Type size={16} />
                <span>Text input response</span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuestionCard;