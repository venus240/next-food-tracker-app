'use client';

import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    gender: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    console.log('Image preview:', imagePreview);
    // You would typically handle form submission logic here,
    // such as sending data to an API.
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-red-100 p-4 sm:p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Register
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Create your new account to start tracking your meals.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              ชื่อ - นามสกุล
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

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

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">
              เพศ
            </span>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="ชาย"
                  onChange={handleChange}
                  checked={formData.gender === 'ชาย'}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">ชาย</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="หญิง"
                  onChange={handleChange}
                  checked={formData.gender === 'หญิง'}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">หญิง</span>
              </label>
            </div>
          </div>
          
          <div className="relative">
            <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-2">
              รูป
            </label>
            <input
              type="file"
              id="imageUpload"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="imageUpload"
              className="flex items-center justify-center w-full px-4 py-2 bg-pink-500 text-white font-semibold rounded-full shadow-md hover:bg-pink-600 transition duration-300 cursor-pointer transform hover:scale-105"
            >
              <span className="mr-2">🍓</span> อัปโหลดรูปภาพ
            </label>
          </div>

          {imagePreview && (
            <div className="mt-4 flex justify-center">
              <Image
                src={imagePreview}
                alt="Image Preview"
                width={150}
                height={150}
                className="rounded-full object-cover shadow-md border-4 border-white"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-3 bg-indigo-500 text-white rounded-full font-semibold text-lg hover:bg-indigo-600 transition duration-300 transform hover:scale-105 shadow-lg"
          >
            ลงทะเบียน
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}
