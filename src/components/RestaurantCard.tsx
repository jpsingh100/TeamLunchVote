import React from 'react';
import { MapPin, DollarSign, User, Heart, Check } from 'lucide-react';
import { Restaurant, User as UserType } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onVote: (restaurantId: string) => void;
  hasUserVoted: boolean;
  isUserVote: boolean;
  submitterName: string;
  totalVotes: number;
  canVote: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onVote,
  hasUserVoted,
  isUserVote,
  submitterName,
  totalVotes,
  canVote,
}) => {
  const priceRangeSymbols = '$'.repeat(restaurant.priceRange);
  const votePercentage = totalVotes > 0 ? (restaurant.votes / totalVotes) * 100 : 0;

  const getCuisineColor = (cuisine: string) => {
    const colors = {
      Italian: 'bg-red-100 text-red-800',
      Chinese: 'bg-yellow-100 text-yellow-800',
      Japanese: 'bg-pink-100 text-pink-800',
      Mexican: 'bg-orange-100 text-orange-800',
      Indian: 'bg-purple-100 text-purple-800',
      Thai: 'bg-green-100 text-green-800',
      Mediterranean: 'bg-blue-100 text-blue-800',
      American: 'bg-gray-100 text-gray-800',
      French: 'bg-indigo-100 text-indigo-800',
      Korean: 'bg-rose-100 text-rose-800',
      Vietnamese: 'bg-emerald-100 text-emerald-800',
      Greek: 'bg-cyan-100 text-cyan-800',
    };
    return colors[cuisine as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCuisineColor(restaurant.cuisine)}`}>
              {restaurant.cuisine}
            </span>
            <div className="flex items-center">
              <DollarSign size={14} className="mr-1" />
              <span>{priceRangeSymbols}</span>
            </div>
          </div>
        </div>
        
        {canVote && (
          <button
            onClick={() => onVote(restaurant.id)}
            className={`group relative flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              isUserVote
                ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isUserVote ? (
              <>
                <Check size={16} />
                <span className="group-hover:hidden">Voted</span>
                <span className="hidden group-hover:inline">Change Vote</span>
              </>
            ) : (
              <>
                <Heart size={16} />
                <span>Vote</span>
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{restaurant.description}</p>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <User size={14} className="mr-1" />
            <span>Suggested by {submitterName}</span>
          </div>
          <span className="font-medium text-gray-900">
            {restaurant.votes} vote{restaurant.votes !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${votePercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;