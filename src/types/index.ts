export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceRange: 1 | 2 | 3 | 4;
  description: string;
  votes: number;
  submittedBy: string;
  submittedAt: string;
}

export interface Vote {
  userId: string;
  restaurantId: string;
  week: string;
  votedAt: string;
}

export interface AppState {
  currentUser: User | null;
  restaurants: Restaurant[];
  votes: Vote[];
  currentView: 'login' | 'dashboard' | 'add-restaurant' | 'restaurant-list';
}

export type PriceRange = 1 | 2 | 3 | 4;

export interface RestaurantFormData {
  name: string;
  cuisine: string;
  priceRange: PriceRange;
  description: string;
}