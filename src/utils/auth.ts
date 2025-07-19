import { User } from '../types';
import { getUsers } from './storage';

export const authenticateUser = (email: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  return user || null;
};

export const getCurrentWeek = (): string => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const week = Math.ceil(days / 7);
  return `${now.getFullYear()}-W${week}`;
};

export const getWeekDateRange = (week: string): { start: Date; end: Date } => {
  const [year, weekNum] = week.split('-W');
  const startOfYear = new Date(parseInt(year), 0, 1);
  const start = new Date(startOfYear.getTime() + (parseInt(weekNum) - 1) * 7 * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  return { start, end };
};