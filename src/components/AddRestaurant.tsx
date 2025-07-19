import React, { useState } from 'react';
import { Plus, DollarSign } from 'lucide-react';
import { Restaurant, RestaurantFormData, User } from '../types';
import { saveRestaurant } from '../utils/storage';

interface AddRestaurantProps {
  currentUser: User;
  onRestaurantAdded: () => void;
}

const AddRestaurant: React.FC<AddRestaurantProps> = ({ currentUser, onRestaurantAdded }) => {
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    cuisine: '',
    priceRange: 2,
    description: '',
  });
  const [errors, setErrors] = useState<Partial<RestaurantFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const cuisineOptions = [
    'Italian', 'Chinese', 'Japanese', 'Mexican', 'Indian', 'Thai', 'Mediterranean',
    'American', 'French', 'Korean', 'Vietnamese', 'Greek', 'Other'
  ];

  const priceRangeLabels = {
    1: '$',
    2: '$$',
    3: '$$$',
    4: '$$$$'
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RestaurantFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    }
    if (!formData.cuisine.trim()) {
      newErrors.cuisine = 'Cuisine type is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const restaurant: Restaurant = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      cuisine: formData.cuisine,
      priceRange: formData.priceRange,
      description: formData.description.trim(),
      votes: 0,
      submittedBy: currentUser.id,
      submittedAt: new Date().toISOString(),
    };

    saveRestaurant(restaurant);
    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset form and show success state
    setFormData({
      name: '',
      cuisine: '',
      priceRange: 2,
      description: '',
    });

    setTimeout(() => {
      setIsSuccess(false);
      onRestaurantAdded();
    }, 2000);
  };

  const handleInputChange = (field: keyof RestaurantFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">Restaurant Added!</h3>
          <p className="text-green-700">Your restaurant suggestion has been added to the voting list.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Restaurant</h2>
          <p className="text-gray-600">Suggest a new restaurant for the team to vote on.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="e.g., Tony's Italian Kitchen"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine Type *
            </label>
            <select
              id="cuisine"
              value={formData.cuisine}
              onChange={(e) => handleInputChange('cuisine', e.target.value)}
              className={`block w-full px-3 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.cuisine ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            >
              <option value="">Select cuisine type</option>
              {cuisineOptions.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
            {errors.cuisine && <p className="mt-1 text-sm text-red-600">{errors.cuisine}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Price Range *
            </label>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(priceRangeLabels).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleInputChange('priceRange', parseInt(value))}
                  className={`flex items-center justify-center py-3 px-4 border rounded-md transition-colors ${
                    formData.priceRange === parseInt(value)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <DollarSign size={16} className="mr-1" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                errors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Tell us about this restaurant - what's special about it, location, any recommendations..."
            />
            <div className="mt-1 flex justify-between text-sm">
              {errors.description ? (
                <p className="text-red-600">{errors.description}</p>
              ) : (
                <p className="text-gray-500">Minimum 10 characters</p>
              )}
              <p className="text-gray-400">{formData.description.length}/500</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Adding Restaurant...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Restaurant
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;