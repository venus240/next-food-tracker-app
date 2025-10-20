"use client";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

type FoodTaskers = {
  id: string;
  foodname: string;
  meal: string;
  fooddate_at: string;
  food_image_url: string;
  user_id: string;
  created_at: string;
  update_at: string;
};
export default function App() {
  const [foodname, setFoodname] = useState("");
  const [meal, setMeal] = useState("");
  const [fooddate_at, setFooddate_at] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let image_url = "";
    if (imageFile) {
      const new_image_file_name = `${Date.now()}-${imageFile.name}`;

      const { data, error } = await supabase.storage
        .from("food_bk")
        .upload(new_image_file_name, imageFile);
      if (error) {
        alert("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
        console.log(error.message);
        return;
      } else {
        const { data } = supabase.storage
          .from("food_bk")
          .getPublicUrl(new_image_file_name);
        image_url = data.publicUrl;
      }
    }

    const { data, error } = await supabase.from("food_tb").insert({
      foodname: foodname,
      meal: meal,
      fooddate_at: fooddate_at,
      food_image_url: image_url,
      user_id: id,
    });

    if (error) {
      alert("เกิดข้อผิดพลาดในการเพิ่มรายการอาหาร");
      console.log(error);
      return;
    } else {
      alert("รายการอาหารถูกเพิ่มเรียบร้อยแล้ว");
      console.log(data);
      setFoodname("");
      setMeal("");
      setFooddate_at("");
      setImagePreviewUrl(null);
      image_url = "";
      router.push("/dashboard/" + id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-rose-100 font-sans p-4">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg w-full max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Add a New Food Item
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col items-start">
            <label
              htmlFor="foodName"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Food Name
            </label>
            <input
              id="foodName"
              type="text"
              placeholder="e.g., Spaghetti with Meatballs"
              value={foodname}
              onChange={(e) => setFoodname(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
            />
          </div>

          <div className="flex flex-col items-start">
            <label
              htmlFor="mealType"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Meal Type
            </label>
            <select
              id="mealType"
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div className="flex flex-col items-start">
            <label
              htmlFor="date"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              value={fooddate_at}
              onChange={(e) => setFooddate_at(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
            />
          </div>

          <div className="flex flex-col items-start">
            <label
              htmlFor="imageUpload"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Food Image
            </label>
            <label
              htmlFor="imageUpload"
              className="w-full px-6 py-3 font-semibold text-lg text-rose-600 bg-white border-2 border-rose-600 rounded-full cursor-pointer hover:bg-rose-50 transition duration-300 text-center"
            >
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
            <div className="text-center">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Image Preview
              </p>
              <div className="relative mx-auto h-40 w-full overflow-hidden rounded-md border-2 border-blue-500 shadow-md">
                <Image
                  src={imagePreviewUrl}
                  alt="Food Preview"
                  layout="fill"
                  objectFit="cover"
                />
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
            <Link href={"/dashboard/" + id}>
              <button
                type="button"
                className="flex-1 px-6 py-3 font-semibold text-lg text-rose-600 bg-white border-2 border-rose-600 rounded-full hover:bg-rose-50 transition duration-300 transform hover:scale-105 shadow-md"
              >
                Back
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
