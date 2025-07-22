import LoginForm from '../components/LoginForm';
import { Target } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-2 sm:px-4 md:px-6 py-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        {/* Branding */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            TicketFlow Pro
          </h1>
          <p className="text-sm text-gray-500 mt-1 sm:mt-2">
            Sign in to manage your tickets
          </p>
        </div>

        {/* Login Form */}
        <LoginForm onLogin={onLogin} />

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6">
          <div className="flex items-center justify-center space-x-3 text-xs sm:text-sm text-gray-500">
            <span>©2025 TicketFlow Pro</span>
            <span>•</span>
            <span>v2.0.1</span>
          </div>
          <div className="flex items-center justify-center space-x-4 mt-2 text-xs sm:text-sm text-gray-400">
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;