import React, { useState, useEffect } from 'react';
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import { Restaurant, Vote, User } from '../types';
import { getRestaurants, getVotes, getUsers, saveVote } from '../utils/storage';
import { getCurrentWeek } from '../utils/auth';
import RestaurantCard from './RestaurantCard';

interface DashboardProps {
  currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const currentWeek = getCurrentWeek();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRestaurants(getRestaurants());
    setVotes(getVotes());
    setUsers(getUsers());
  };

  const handleVote = (restaurantId: string) => {
    // If user is clicking on their current vote, deselect it
    if (userVote?.restaurantId === restaurantId) {
      // Remove the vote by filtering it out
      const updatedVotes = votes.filter(vote => 
        !(vote.userId === currentUser.id && vote.week === currentWeek)
      );
      // Update localStorage directly
      localStorage.setItem('restaurant-voting-votes', JSON.stringify(updatedVotes));
      loadData();
      return;
    }

    // Otherwise, create a new vote (this will replace existing vote if any)
    const newVote: Vote = {
      userId: currentUser.id,
      restaurantId,
      week: currentWeek,
      votedAt: new Date().toISOString(),
    };

    saveVote(newVote);
    loadData();
  };

  // Calculate vote counts for current week
  const currentWeekVotes = votes.filter(vote => vote.week === currentWeek);
  const restaurantsWithVotes = restaurants.map(restaurant => ({
    ...restaurant,
    votes: currentWeekVotes.filter(vote => vote.restaurantId === restaurant.id).length,
  }));

  // Sort restaurants by vote count (descending)
  const sortedRestaurants = restaurantsWithVotes.sort((a, b) => b.votes - a.votes);

  const userVote = currentWeekVotes.find(vote => vote.userId === currentUser.id);
  const totalVotes = currentWeekVotes.length;
  const totalUsers = users.length;
  const participationRate = totalUsers > 0 ? (totalVotes / totalUsers) * 100 : 0;

  const getWeekDisplay = () => {
    const [year, week] = currentWeek.split('-W');
    return `Week ${week}, ${year}`;
  };

  const getSubmitterName = (submittedBy: string) => {
    const user = users.find(u => u.id === submittedBy);
    return user?.name || 'Unknown';
  };

  const getDeadlineDate = () => {
    // Assuming voting deadline is Friday at 3 PM
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 5 = Friday
    const friday = new Date(now);
    friday.setDate(now.getDate() + (5 - currentDay));
    friday.setHours(15, 0, 0, 0); // 3 PM
    
    if (currentDay > 5 || (currentDay === 5 && now.getHours() >= 15)) {
      // If it's past Friday 3 PM, set to next Friday
      friday.setDate(friday.getDate() + 7);
    }
    
    return friday;
  };

  const deadline = getDeadlineDate();
  const now = new Date();
  const canVote = now < deadline;
  const timeUntilDeadline = deadline.getTime() - now.getTime();
  const hoursUntilDeadline = Math.floor(timeUntilDeadline / (1000 * 60 * 60));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Current Week</dt>
                <dd className="text-lg font-medium text-gray-900">{getWeekDisplay()}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Participation</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {totalVotes}/{totalUsers} ({Math.round(participationRate)}%)
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className={`h-8 w-8 ${canVote ? 'text-orange-600' : 'text-red-600'}`} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {canVote ? 'Time Left' : 'Voting Closed'}
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {canVote ? `${hoursUntilDeadline}h remaining` : 'Until next week'}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Voting Status */}
      {userVote && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
            <p className="text-blue-800">
              You've voted for{' '}
              <span className="font-semibold">
                {restaurants.find(r => r.id === userVote.restaurantId)?.name}
              </span>
              . {canVote ? 'Click on your voted restaurant to remove your vote, or click another to change it.' : 'Voting has ended for this week.'}
            </p>
          </div>
        </div>
      )}

      {!canVote && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800">
              Voting for this week has ended. Results are final!
            </p>
          </div>
        </div>
      )}

      {/* Restaurants */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">This Week's Restaurants</h2>
          <p className="text-sm text-gray-600">
            {sortedRestaurants.length} restaurant{sortedRestaurants.length !== 1 ? 's' : ''} to choose from
          </p>
        </div>

        {sortedRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants yet</h3>
            <p className="text-gray-600 mb-4">Be the first to suggest a restaurant for this week!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedRestaurants.map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onVote={handleVote}
                hasUserVoted={!!userVote}
                isUserVote={userVote?.restaurantId === restaurant.id}
                submitterName={getSubmitterName(restaurant.submittedBy)}
                totalVotes={totalVotes}
                canVote={canVote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;