"use client";

import React, { useState, useMemo, useEffect } from 'react';

// Define the data structure for a food item using a TypeScript interface.
interface FoodItem {
  id: number;
  date: string;
  image: string;
  name: string;
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

// Mock data for demonstration purposes.
const MOCK_FOOD_DATA: FoodItem[] = [
  { id: 1, date: '2024-05-01', image: 'https://placehold.co/50x50/FCAEAE/FF0000?text=Food', name: 'Strawberry Smoothie', meal: 'Breakfast' },
  { id: 2, date: '2024-05-01', image: 'https://placehold.co/50x50/FCAEAE/FF0000?text=Food', name: 'Caesar Salad', meal: 'Lunch' },
  { id: 3, date: '2024-05-01', image: 'https://placehold.co/50x50/FCAEAE/FF0000?text=Food', name: 'Grilled Chicken', meal: 'Dinner' },
  { id: 4, date: '2024-05-02', image: 'https://placehold.co/50x50/FCAEAE/FF0000?text=Food', name: 'Yogurt with Berries', meal: 'Snack' },
  { id: 5, date: '2024-05-02', image: 'https://placehold.co/50x50/FCAEAE/FF0000?text=Food', name: 'Spaghetti Bolognese', meal: 'Dinner' },
  { id: 6, date: '2024-05-03', image: 'https://placehold.co/50x50/FCAEAE/FF0000?text=Food', name: 'Scrambled Eggs', meal: 'Breakfast' },
  { id: 7, date: '2024-05-03', image: 'https://placehold.co/50x50/FCAEAE/FF0000?text=Food', name: 'Beef Tacos', meal: 'Lunch' },
  { id: 8, date: '2024-05-03', image: 'https://placehold.co/50x50/FCAEAE/FF0000?text=Food', name: 'Salmon and Asparagus', meal: 'Dinner' },
  { id: 9, date: '2024-05-04', image: 'https://placehold.co/50x50/FCAEAE/FF0000?text=Food', name: 'Protein Bar', meal: 'Snack' },
  { id: 10, date: '2024-05-04', image: 'https://placehold.co/50x50/FCAEAE/FF0000?text=Food', name: 'Steak and Potatoes', meal: 'Dinner' },
];

const ITEMS_PER_PAGE = 5;

// The main application component.
export default function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter food items based on the search term.
  const filteredFoods = useMemo(() => {
    if (!searchTerm) return MOCK_FOOD_DATA;
    return MOCK_FOOD_DATA.filter(food =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Calculate the total number of pages for pagination.
  const totalPages = Math.ceil(filteredFoods.length / ITEMS_PER_PAGE);

  // Get the food items for the current page.
  const currentFoods = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredFoods.slice(startIndex, endIndex);
  }, [filteredFoods, currentPage]);

  const handleEdit = (id: number) => {
    console.log(`Editing food item with ID: ${id}`);
    // You can implement your edit logic here, e.g., redirect to an edit page.
  };

  const handleDelete = (id: number) => {
    console.log(`Deleting food item with ID: ${id}`);
    // You can implement your delete logic here, e.g., show a confirmation modal and then delete the item.
  };

  const handleSearch = () => {
    // The search is handled automatically by the useMemo hook,
    // so this button can trigger a state change or just be a visual element.
    // We'll reset to the first page after a search.
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    // Main container with a strawberry red background.
    <div className="min-h-screen p-8 bg-rose-100 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        
        {/* Header section with title and Add Food button */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Food Tracker Dashboard</h1>
          {/* Using a regular button here as Link from Next.js is not supported in this environment */}
          <button
            onClick={() => alert('Navigate to /addfood')}
            className="px-6 py-3 bg-rose-600 text-white font-semibold rounded-full shadow-md hover:bg-rose-700 transition duration-300"
          >
            + Add Food
          </button>
        </div>

        {/* Search Bar section */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search food by name..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-full shadow-sm hover:bg-gray-300 transition duration-300"
          >
            Search
          </button>
        </div>

        {/* Food data table */}
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-rose-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentFoods.length > 0 ? (
                currentFoods.map((food) => (
                  <tr key={food.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{food.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <img src={food.image} alt={food.name} className="w-10 h-10 rounded-full object-cover" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{food.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{food.meal}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleEdit(food.id)}
                        className="text-rose-600 hover:text-rose-900 mx-2 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(food.id)}
                        className="text-gray-600 hover:text-gray-900 mx-2 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">No food items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
