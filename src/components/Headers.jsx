import {
    Bell,
    ChevronDown,
    Filter,
    LogOut,
    Menu,
    Plus,
    Search,
    Settings,
    User,
    X
} from 'lucide-react';
import { useState } from 'react';

const Header = ({ 
  currentUser, 
  onLogout, 
  onCreateTicket, 
  searchTerm, 
  onSearchChange,
  ticketCount = 0 
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Sample notifications
  const notifications = [
    { id: 1, text: 'New ticket assigned to you', time: '2 min ago', type: 'info' },
    { id: 2, text: 'Ticket #1234 was resolved', time: '5 min ago', type: 'success' },
    { id: 3, text: 'System maintenance in 1 hour', time: '10 min ago', type: 'warning' },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <header className="white-glass-strong sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  TicketFlow Pro
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Professional Dashboard
                </p>
              </div>
            </div>

            {/* Stats Badge */}
            <div className="hidden md:flex items-center space-x-4 ml-8">
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-700">
                  {ticketCount} Active Tickets
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all"
                placeholder="Search tickets, customers, or content..."
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <kbd className="hidden sm:inline-flex items-center px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 bg-gray-50">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Create Ticket Button */}
            <button
              onClick={onCreateTicket}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Ticket</span>
            </button>

            {/* Filter Button */}
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all">
              <Filter className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all relative"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowNotifications(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-80 white-glass-strong rounded-2xl shadow-2xl border border-white/20 z-20">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <p className="text-sm text-gray-500">{notifications.length} unread notifications</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                          <div className="flex items-start space-x-3">
                            <span className="text-lg flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 font-medium">
                                {notification.text}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-200">
                      <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Settings */}
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all">
              <Settings className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all"
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.username || 'User'}&background=3b82f6&color=white`}
                    alt={currentUser?.username}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser?.username || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentUser?.role || 'Member'}
                    </p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 white-glass-strong rounded-2xl shadow-2xl border border-white/20 z-20">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <img
                          src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.username || 'User'}&background=3b82f6&color=white`}
                          alt={currentUser?.username}
                          className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {currentUser?.username || 'User'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {currentUser?.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors">
                        <User className="h-4 w-4" />
                        <span>Profile Settings</span>
                      </button>
                      <button className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors">
                        <Settings className="h-4 w-4" />
                        <span>Preferences</span>
                      </button>
                      <button className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors">
                        <Bell className="h-4 w-4" />
                        <span>Notifications</span>
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-200 py-2">
                      <button
                        onClick={onLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50/50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all"
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
                  placeholder="Search tickets..."
                />
              </div>

              {/* Mobile Stats */}
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-700">
                    {ticketCount} Active Tickets
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;