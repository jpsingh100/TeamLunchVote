import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { Restaurant, User } from '../types';
import { getRestaurants, getUsers } from '../utils/storage';

interface RestaurantListProps {
  currentUser: User;
}

const RestaurantList: React.FC<RestaurantListProps> = ({ currentUser }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | ''>('');

  useEffect(() => {
    setRestaurants(getRestaurants());
    setUsers(getUsers());
  }, []);

  const cuisines = [...new Set(restaurants.map(r => r.cuisine))].sort();
  const priceRanges = [1, 2, 3, 4];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCuisine = !selectedCuisine || restaurant.cuisine === selectedCuisine;
    const matchesPriceRange = selectedPriceRange === '' || restaurant.priceRange === selectedPriceRange;

    return matchesSearch && matchesCuisine && matchesPriceRange;
  });

  const getSubmitterName = (submittedBy: string) => {
    const user = users.find(u => u.id === submittedBy);
    return user?.name || 'Unknown';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriceRangeSymbol = (range: number) => '$'.repeat(range);

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
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">All Restaurants</h2>
        <p className="text-gray-600">Browse all restaurant suggestions from the team</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search restaurants..."
                className="pl-10 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine
            </label>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All cuisines</option>
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value ? parseInt(e.target.value) : '')}
              className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All prices</option>
              {priceRanges.map(range => (
                <option key={range} value={range}>{getPriceRangeSymbol(range)}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCuisine('');
                setSelectedPriceRange('');
              }}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Filter className="mr-2" size={16} />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredRestaurants.length} of {restaurants.length} restaurants
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRestaurants.map(restaurant => (
            <div key={restaurant.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCuisineColor(restaurant.cuisine)}`}>
                    {restaurant.cuisine}
                  </span>
                  <span className="text-sm text-gray-600">
                    {getPriceRangeSymbol(restaurant.priceRange)}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-4 text-sm leading-relaxed">{restaurant.description}</p>

              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center">
                  <Calendar size={12} className="mr-1" />
                  <span>Added {formatDate(restaurant.submittedAt)}</span>
                </div>
                <div>
                  Suggested by {getSubmitterName(restaurant.submittedBy)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;