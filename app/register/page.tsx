"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Register() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
      setImageFile(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageUrl = "";

    try {
      if (imageFile) {
        const newFileName = `${Date.now()}-${imageFile.name}`;

        const { error: uploadError } = await supabase.storage
          .from("user_bk")
          .upload(newFileName, imageFile);

        if (uploadError) {
          alert("Failed to upload profile image.");
          console.error(uploadError.message);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("user_bk")
          .getPublicUrl(newFileName);

        imageUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("user_tb").insert({
        fullname: fullName,
        email,
        password,
        gender,
        user_image_url: imageUrl,
      });

      if (insertError) {
        alert("Registration failed. Please try again.");
        console.error(insertError.message);
        return;
      }

      alert("Account created successfully!");
      setFullName("");
      setEmail("");
      setPassword("");
      setGender("");
      setPreviewImage(null);
      setImageFile(null);

      router.push("/login");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-rose-100 p-4 sm:p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Create Account
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Sign up to start tracking your meals easily.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
            />
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </span>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  onChange={(e) => setGender(e.target.value)}
                  className="focus:ring-rose-500 h-4 w-4 text-rose-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Male</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  onChange={(e) => setGender(e.target.value)}
                  className="focus:ring-rose-500 h-4 w-4 text-rose-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Female</span>
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="imageUpload"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Profile Image
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="imageUpload"
              className="flex items-center justify-center w-full px-4 py-2 bg-rose-500 text-white font-semibold rounded-full shadow-md hover:bg-rose-600 transition duration-300 cursor-pointer transform hover:scale-105"
            >
              <span className="mr-2">📸</span> Upload Image
            </label>
          </div>

          {previewImage && (
            <div className="mt-4 flex justify-center">
              <Image
                src={previewImage}
                alt="Profile Preview"
                width={150}
                height={150}
                className="rounded-full object-cover shadow-md border-4 border-white"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-3 bg-rose-600 text-white rounded-full font-semibold text-lg hover:bg-rose-700 transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-rose-600 hover:text-rose-800 font-semibold"
          >
            Log in here
          </Link>
        </p>
      </div>
    </main>
  );
}
