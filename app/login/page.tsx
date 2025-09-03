'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  // State to manage the form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Handle changes in the input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login form submitted:', formData);
    // You would typically handle authentication logic here, e.g.,
    // sending a request to your API to verify the user's credentials.
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-rose-100 p-4 sm:p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Login
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Sign in to your account to start tracking your meals.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              อีเมล
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              รหัสผ่าน
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-indigo-500 text-white rounded-full font-semibold text-lg hover:bg-indigo-600 transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500">
          Don't have an account?{' '}
          <Link href="/register" className="text-indigo-600 hover:text-indigo-800 font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
