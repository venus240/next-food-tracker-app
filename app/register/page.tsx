"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Register() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [image_file, setImageFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");

  const router = useRouter();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    } else {
      setPreviewImage(null);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let image_url = "";
    if (image_file) {
      const new_image_file_name = `${Date.now()}-${image_file.name}`;

      const { data, error } = await supabase.storage
        .from("user_bk")
        .upload(new_image_file_name, image_file);
      if (error) {
        alert("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
        console.log(error.message);
        return;
      } else {
        const { data } = supabase.storage
          .from("user_bk")
          .getPublicUrl(new_image_file_name);
        image_url = data.publicUrl;
      }
    }
    const { data, error } = await supabase.from("user_tb").insert({
      fullname: fullName,
      email: email,
      password: password,
      gender: gender,
      user_image_url: image_url,
    });

    if (error) {
      console.log(error.message);
      return;
    } else {
      alert("บันทึกข้อมูลเรียบร้อย");
      setFullName("");
      setEmail("");
      setPassword("");
      setGender("");
      setPreviewImage(null);
      image_url = "";
      router.push("/login");
    }
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
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              ชื่อ - นามสกุล
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              อีเมล
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              รหัสผ่าน
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                  value="male"
                  onChange={(e) => setGender(e.target.value)}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">ชาย</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  onChange={(e) => setGender(e.target.value)}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">หญิง</span>
              </label>
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="imageUpload"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              รูป
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
              className="flex items-center justify-center w-full px-4 py-2 bg-pink-500 text-white font-semibold rounded-full shadow-md hover:bg-pink-600 transition duration-300 cursor-pointer transform hover:scale-105"
            >
              <span className="mr-2">🍓</span> อัปโหลดรูปภาพ
            </label>
          </div>

          {previewImage && (
            <div className="mt-4 flex justify-center">
              <Image
                src={previewImage}
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
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}
