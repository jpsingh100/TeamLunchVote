import React, { useState, useEffect } from 'react';
import { User, AppState } from './types';
import { initializeStorage, getCurrentUser, setCurrentUser } from './utils/storage';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import AddRestaurant from './components/AddRestaurant';
import RestaurantList from './components/RestaurantList';

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentUser: null,
    restaurants: [],
    votes: [],
    currentView: 'login',
  });

  useEffect(() => {
    // Initialize storage with default data
    initializeStorage();
    
    // Check if user is already logged in
    const savedUser = getCurrentUser();
    if (savedUser) {
      setAppState(prev => ({
        ...prev,
        currentUser: savedUser,
        currentView: 'dashboard',
      }));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setAppState(prev => ({
      ...prev,
      currentUser: user,
      currentView: 'dashboard',
    }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAppState(prev => ({
      ...prev,
      currentUser: null,
      currentView: 'login',
    }));
  };

  const handleViewChange = (view: 'dashboard' | 'add-restaurant' | 'restaurant-list') => {
    setAppState(prev => ({
      ...prev,
      currentView: view,
    }));
  };

  const handleRestaurantAdded = () => {
    // Optionally redirect to dashboard after adding restaurant
    setAppState(prev => ({
      ...prev,
      currentView: 'dashboard',
    }));
  };

  if (!appState.currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentView={appState.currentView}
        onViewChange={handleViewChange}
        onLogout={handleLogout}
        currentUser={appState.currentUser}
      />
      
      <main className="py-8">
        {appState.currentView === 'dashboard' && (
          <Dashboard currentUser={appState.currentUser} />
        )}
        {appState.currentView === 'add-restaurant' && (
          <AddRestaurant
            currentUser={appState.currentUser}
            onRestaurantAdded={handleRestaurantAdded}
          />
        )}
        {appState.currentView === 'restaurant-list' && (
          <RestaurantList currentUser={appState.currentUser} />
        )}
      </main>
    </div>
  );
}

export default App;