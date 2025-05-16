import React from 'react';
import { PlusCircle, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Answer } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { v4 as uuidv4 } from 'uuid';

interface MultipleChoiceAnswersProps {
  answers: Answer[];
  onUpdate: (updatedAnswers: Answer[]) => void;
}

const MultipleChoiceAnswers: React.FC<MultipleChoiceAnswersProps> = ({ answers, onUpdate }) => {
  const handleAddAnswer = () => {
    const newAnswer: Answer = {
      answer_id: uuidv4(),
      answer: '',
      image: '',
      order: answers.length,
    };
    onUpdate([...answers, newAnswer]);
  };

  const handleRemoveAnswer = (index: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers.splice(index, 1);
    // Update the order of remaining answers
    const reorderedAnswers = updatedAnswers.map((answer, idx) => ({
      ...answer,
      order: idx,
    }));
    onUpdate(reorderedAnswers);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = { ...updatedAnswers[index], answer: value };
    onUpdate(updatedAnswers);
  };

  const handleImageChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = { ...updatedAnswers[index], image: value };
    onUpdate(updatedAnswers);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(answers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update the order property
    const reorderedAnswers = items.map((answer, index) => ({
      ...answer,
      order: index,
    }));
    
    onUpdate(reorderedAnswers);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Answer Choices</label>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddAnswer}
          icon={<PlusCircle size={16} />}
        >
          Add Answer
        </Button>
      </div>

      {answers.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-center">
          <p className="text-gray-500 text-sm">No answers yet. Add your first answer option.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddAnswer}
            icon={<PlusCircle size={16} />}
            className="mt-2"
          >
            Add Answer
          </Button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="answers">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {answers.map((answer, index) => (
                  <Draggable
                    key={answer.answer_id || index}
                    draggableId={answer.answer_id || `answer-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white rounded-lg border border-gray-200 p-3 ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <div {...provided.dragHandleProps} className="cursor-grab mt-2">
                            <GripVertical size={18} className="text-gray-400" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Input
                              value={answer.answer}
                              onChange={(e) => handleAnswerChange(index, e.target.value)}
                              placeholder={`Answer option ${index + 1}`}
                              fullWidth
                            />
                            <div className="flex items-center space-x-2">
                              <ImageIcon size={16} className="text-gray-400" />
                              <Input
                                value={answer.image || ''}
                                onChange={(e) => handleImageChange(index, e.target.value)}
                                placeholder="Image URL (optional)"
                                fullWidth
                              />
                            </div>
                            {answer.image && (
                              <div className="mt-2">
                                <img
                                  src={answer.image}
                                  alt={answer.answer}
                                  className="max-h-24 rounded-md"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://placehold.co/400x300?text=Invalid+Image';
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Trash2 size={16} className="text-red-500" />}
                            onClick={() => handleRemoveAnswer(index)}
                            aria-label="Remove answer"
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      
      {answers.length > 0 && answers.length < 2 && (
        <p className="text-sm text-amber-600">Add at least one more answer option.</p>
      )}
    </div>
  );
};

export default MultipleChoiceAnswers;