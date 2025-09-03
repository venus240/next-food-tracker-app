// app/page.tsx
"use client";
import Image from 'next/image';
import Link from 'next/link';
import foodtracker from './images/foodtracker.png'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-fuchsia-100">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-lg mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
          Welcome to Food Tracker
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 mb-8">
          Tracker your meal!!! 🥗
        </p>

        <div className="mb-8">
          <Image
            src={foodtracker}
            alt="Food Tracker"
            width={300}
            height={300}
            className="rounded-lg shadow-md mx-auto"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/register">
            <button className="w-full sm:w-auto px-6 py-3 font-semibold text-lg text-white bg-indigo-500 rounded-full hover:bg-indigo-600 transition duration-300 transform hover:scale-105 shadow-md">
              Register
            </button>
          </Link>
          <Link href="/login">
            <button className="w-full sm:w-auto px-6 py-3 font-semibold text-lg text-indigo-500 bg-white border-2 border-indigo-500 rounded-full hover:bg-indigo-50 transition duration-300 transform hover:scale-105 shadow-md">
              Login
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}