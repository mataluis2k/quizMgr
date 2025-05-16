import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import QuizBuilder from './pages/QuizBuilder';
import QuizPreviewPage from './pages/QuizPreviewPage';
import Login from './pages/Login';
import Header from './components/layout/Header';
import AuthGuard from './components/AuthGuard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AuthGuard><Header /></AuthGuard>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/builder" element={<QuizBuilder />} />
            <Route path="/builder/:quizId" element={<QuizBuilder />} />
            <Route path="/preview/:quizId" element={<QuizPreviewPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#22C55E',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;