import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Eye, Trash2, FileQuestion } from 'lucide-react';
import toast from 'react-hot-toast';
import { quizApi } from '../services/api';
import { QuizListItem } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import Modal from '../components/ui/Modal';

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

const Dashboard: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<QuizListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<QuizListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    limit: 20,
    offset: 0,
    totalPages: 0
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredQuizzes(quizzes);
    } else {
      const filtered = quizzes.filter((quiz) =>
        quiz.quiz_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQuizzes(filtered);
    }
  }, [searchTerm, quizzes]);

  const loadQuizzes = async () => {
    setIsLoading(true);
    try {
      const response = await quizApi.listQuizzes();
      
      // Validate response structure
      if (!response || typeof response !== 'object' || !('data' in response)) {
        console.error('Invalid response format:', response);
        toast.error('Invalid data received from server');
        setQuizzes([]);
        setFilteredQuizzes([]);
        return;
      }

      // Type assertion with unknown as intermediate step
      const apiResponse = response as unknown as ApiResponse<QuizListItem>;
      
      // Validate that data is an array
      if (!Array.isArray(apiResponse.data)) {
        console.error('Invalid data format:', apiResponse.data);
        toast.error('Invalid data received from server');
        setQuizzes([]);
        setFilteredQuizzes([]);
        return;
      }
      
      // Validate each quiz item has required properties
      const validQuizzes = apiResponse.data.filter((quiz): quiz is QuizListItem => {
        const isValid = 
          typeof quiz === 'object' &&
          quiz !== null &&
          typeof quiz.quiz_id === 'string' &&
          typeof quiz.quiz_name === 'string' &&
          typeof quiz.updated_at === 'string';
        
        if (!isValid) {
          console.warn('Invalid quiz item:', quiz);
        }
        return isValid;
      });

      // Update pagination state
      setPagination({
        totalRecords: apiResponse.metadata.totalRecords,
        limit: apiResponse.metadata.limit,
        offset: apiResponse.metadata.offset,
        totalPages: apiResponse.metadata.totalPages
      });

      setQuizzes(validQuizzes);
      setFilteredQuizzes(validQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
      toast.error('Failed to load quizzes. Please try again.');
      setQuizzes([]);
      setFilteredQuizzes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCreateQuiz = () => {
    navigate('/builder');
  };

  const handleEditQuiz = (quizId: string) => {
    navigate(`/builder/${quizId}`);
  };

  const handlePreviewQuiz = (quizId: string) => {
    navigate(`/preview/${quizId}`);
  };

  const confirmDeleteQuiz = (quiz: QuizListItem) => {
    setQuizToDelete(quiz);
    setDeleteModalOpen(true);
  };

  const handleDeleteQuiz = async () => {
    if (!quizToDelete) return;
    
    setIsDeleting(true);
    try {
      await quizApi.deleteQuiz(quizToDelete.quiz_id);
      setQuizzes(quizzes.filter(quiz => quiz.quiz_id !== quizToDelete.quiz_id));
      toast.success(`Quiz "${quizToDelete.quiz_name}" deleted successfully.`);
      setDeleteModalOpen(false);
      setQuizToDelete(null);
    } catch (error) {
      toast.error('Failed to delete quiz. Please try again.');
      console.error('Error deleting quiz:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Quiz Dashboard</h1>
        <Button 
          variant="primary" 
          size="md"
          icon={<Plus size={18} />}
          onClick={handleCreateQuiz}
        >
          New Quiz
        </Button>
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <Input
          className="pl-10"
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="bg-indigo-100 p-3 rounded-full mb-4">
              <FileQuestion size={32} className="text-indigo-600" />
            </div>
            {searchTerm ? (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No quizzes found</h3>
                <p className="text-gray-500 mb-4">Try a different search term or create a new quiz.</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No quizzes yet</h3>
                <p className="text-gray-500 mb-4">Create your first quiz to get started.</p>
              </>
            )}
            <Button variant="primary" size="md" onClick={handleCreateQuiz} icon={<Plus size={18} />}>
              Create Quiz
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quiz Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuizzes.map((quiz) => (
                <tr key={quiz.quiz_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{quiz.quiz_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(quiz.updated_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Eye size={16} />}
                        onClick={() => handlePreviewQuiz(quiz.quiz_id)}
                        aria-label="Preview"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Edit size={16} />}
                        onClick={() => handleEditQuiz(quiz.quiz_id)}
                        aria-label="Edit"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 size={16} className="text-red-500" />}
                        onClick={() => confirmDeleteQuiz(quiz)}
                        aria-label="Delete"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Quiz"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteQuiz}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-gray-700 mb-2">
          Are you sure you want to delete the quiz <span className="font-semibold">{quizToDelete?.quiz_name}</span>?
        </p>
        <p className="text-sm text-gray-500">
          This action cannot be undone. All quiz data will be permanently removed.
        </p>
      </Modal>
    </div>
  );
};

export default Dashboard;