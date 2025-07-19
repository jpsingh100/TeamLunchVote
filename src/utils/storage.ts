import { User, Restaurant, Vote } from '../types';

const STORAGE_KEYS = {
  USERS: 'restaurant-voting-users',
  RESTAURANTS: 'restaurant-voting-restaurants',
  VOTES: 'restaurant-voting-votes',
  CURRENT_USER: 'restaurant-voting-current-user',
};

// Predefined team members
const DEFAULT_USERS: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@company.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@company.com' },
  { id: '3', name: 'Carol Davis', email: 'carol@company.com' },
  { id: '4', name: 'David Wilson', email: 'david@company.com' },
  { id: '5', name: 'Emma Brown', email: 'emma@company.com' },
  { id: '6', name: 'Frank Miller', email: 'frank@company.com' },
];

export const initializeStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESTAURANTS)) {
    localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VOTES)) {
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify([]));
  }
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : DEFAULT_USERS;
};

export const getRestaurants = (): Restaurant[] => {
  const restaurants = localStorage.getItem(STORAGE_KEYS.RESTAURANTS);
  return restaurants ? JSON.parse(restaurants) : [];
};

export const saveRestaurant = (restaurant: Restaurant): void => {
  const restaurants = getRestaurants();
  restaurants.push(restaurant);
  localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
};

export const getVotes = (): Vote[] => {
  const votes = localStorage.getItem(STORAGE_KEYS.VOTES);
  return votes ? JSON.parse(votes) : [];
};

export const saveVote = (vote: Vote): void => {
  const votes = getVotes();
  // Remove existing vote for this user and week
  const filteredVotes = votes.filter(
    v => !(v.userId === vote.userId && v.week === vote.week)
  );
  filteredVotes.push(vote);
  localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(filteredVotes));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};