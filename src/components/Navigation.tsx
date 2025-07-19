import React from 'react';
import { Home, Plus, List, LogOut } from 'lucide-react';
import { User } from '../types';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: 'dashboard' | 'add-restaurant' | 'restaurant-list') => void;
  onLogout: () => void;
  currentUser: User;
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  onLogout,
  currentUser,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'add-restaurant', label: 'Add Restaurant', icon: Plus },
    { id: 'restaurant-list', label: 'All Restaurants', icon: List },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900">Team Lunch Vote</h1>
            
            <div className="hidden md:flex space-x-4">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id as any)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              Welcome, {currentUser.name}
            </span>
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex space-x-1 py-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id as any)}
                  className={`flex-1 flex flex-col items-center py-2 px-1 text-xs font-medium transition-colors ${
                    currentView === item.id
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={16} />
                  <span className="mt-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;