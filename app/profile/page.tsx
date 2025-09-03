'use client';
import React, { useState } from 'react';

// This is a self-contained React component for the Add Food page.
// All styles are handled with Tailwind CSS classes.

interface FoodItem {
  id: string;
  date: string;
  foodName: string;
  mealType: string;
  imageUrl: string;
}

export default function App() {
  const [foodName, setFoodName] = useState<string>('');
  const [mealType, setMealType] = useState<string>('breakfast');
  const [date, setDate] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreviewUrl(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !date) {
      setModalMessage('Please fill in all required fields.');
      setShowModal(true);
      return;
    }

    const newFoodItem: FoodItem = {
      id: crypto.randomUUID(),
      date,
      foodName,
      mealType,
      imageUrl: imagePreviewUrl || 'https://placehold.co/100x100/FFF0F5/E84A5F?text=No+Image',
    };
    
    console.log('Saving new food item:', newFoodItem);
    setModalMessage('Food item saved successfully!');
    setShowModal(true);
    
    // Clear the form after saving
    setFoodName('');
    setMealType('breakfast');
    setDate('');
    setImageFile(null);
    setImagePreviewUrl(null);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleGoBack = () => {
    // In a real application, this would use a router (e.g., Next.js router)
    console.log('Navigating back to the dashboard...');
    setModalMessage('Navigating to dashboard...');
    setShowModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-rose-100 font-sans p-4">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg w-full max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Add a New Food Item
        </h1>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="flex flex-col items-start">
            <label htmlFor="foodName" className="text-sm font-semibold text-gray-700 mb-1">Food Name</label>
            <input
              id="foodName"
              type="text"
              placeholder="e.g., Spaghetti with Meatballs"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
            />
          </div>
          
          <div className="flex flex-col items-start">
            <label htmlFor="mealType" className="text-sm font-semibold text-gray-700 mb-1">Meal Type</label>
            <select
              id="mealType"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div className="flex flex-col items-start">
            <label htmlFor="date" className="text-sm font-semibold text-gray-700 mb-1">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
            />
          </div>

          <div className="flex flex-col items-start">
            <label htmlFor="imageUpload" className="text-sm font-semibold text-gray-700 mb-1">
              Food Image
            </label>
            <label htmlFor="imageUpload" className="w-full px-6 py-3 font-semibold text-lg text-rose-600 bg-white border-2 border-rose-600 rounded-full cursor-pointer hover:bg-rose-50 transition duration-300 text-center">
              Choose an image
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {imagePreviewUrl && (
            <div className="mt-4 flex flex-col items-center">
              <span className="text-sm font-semibold text-gray-700 mb-2">Image Preview:</span>
              <div className="rounded-lg overflow-hidden border-2 border-rose-300 shadow-md">
                <img src={imagePreviewUrl} alt="Image Preview" className="w-32 h-32 object-cover" />
              </div>
            </div>
          )}
          
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="submit"
              className="flex-1 px-6 py-3 font-semibold text-lg text-white bg-rose-600 rounded-full hover:bg-rose-700 transition duration-300 transform hover:scale-105 shadow-md"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleGoBack}
              className="flex-1 px-6 py-3 font-semibold text-lg text-rose-600 bg-white border-2 border-rose-600 rounded-full hover:bg-rose-50 transition duration-300 transform hover:scale-105 shadow-md"
            >
              Back
            </button>
          </div>
        </form>
      </div>

      {/* Custom Modal for alerts */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <p className="mb-4 text-lg">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-rose-600 text-white rounded-full hover:bg-rose-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
