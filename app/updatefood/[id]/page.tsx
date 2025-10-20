"use client";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const { id } = useParams();
  const [foodname, setFoodname] = useState("");
  const [meal, setMeal] = useState("");
  const [fooddate_at, setFooddate_at] = useState("");
  const [old_image_file, setOldImageFile] = useState<string>("");
  const [userId, setUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("food_tb")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("พบปัญหาในการดึงข้อมูลงานเก่า");
        console.log(error.message);
        return;
      }

      if (data) {
        setFoodname(data.foodname);
        setMeal(data.meal);
        let formattedDate = "";
        const rawDate = data.fooddate_at;

        if (rawDate) {
          if (rawDate.includes("/")) {
            const [mm, dd, yyyy] = rawDate.split("/");
            formattedDate = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(
              2,
              "0"
            )}`;
          } else if (rawDate.includes("T")) {
            formattedDate = new Date(rawDate).toISOString().split("T")[0];
          } else {
            formattedDate = rawDate;
          }
        }

        setFooddate_at(formattedDate);
        setUserId(data.user_id);
        setImagePreviewUrl(data.food_image_url);
        setOldImageFile(data.food_image_url);
      }
    };
    fetchData();
  }, [id]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
      setImageFile(file);
    } else {
      setImagePreviewUrl(null);
    }
  };

  const handleUploadAndUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let image_url = old_image_file;

    if (imageFile) {
      if (old_image_file) {
        const oldImageName = old_image_file.split("/").pop();
        if (oldImageName) {
          const { error: removeError } = await supabase.storage
            .from("food_bk")
            .remove([oldImageName]);
          if (removeError) {
            console.log("ลบรูปเก่าไม่สำเร็จ:", removeError.message);
          }
        }
      }

      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("food_bk")
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("อัปโหลดรูปภาพไม่สำเร็จ");
        console.log(uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("food_bk")
        .getPublicUrl(fileName);

      image_url = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("food_tb")
      .update({
        foodname,
        meal,
        food_image_url: image_url,
        fooddate_at: fooddate_at,
        update_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      alert("เกิดข้อผิดพลาดในการบันทึกการแก้ไขข้อมูล");
      console.error(updateError.message);
      return;
    } else {
      alert("บันทึกแก้ไขข้อมูลเรียบร้อย");
      setOldImageFile(image_url);
      setImageFile(null);
      router.push(`/dashboard/${userId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-rose-100 font-sans p-4">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg w-full max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Add a New Food Item
        </h1>
        <form onSubmit={handleUploadAndUpdate} className="flex flex-col gap-4">
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
