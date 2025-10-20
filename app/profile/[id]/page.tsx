"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
export default function App() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [image_file, setImageFile] = useState<File | null>(null);
  const [old_image_file, setOldImageFile] = useState<string>("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const { id } = useParams();
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("user_tb")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("พบปัญหาในการดึงข้อมูลผู้ใช้");
        console.log(error.message);
        return;
      }

      if (data) {
        setFullName(data.fullname);
        setEmail(data.email);
        setPassword(data.password);
        setGender(data.gender);
        setPreviewImage(data.user_image_url);
        setOldImageFile(data.user_image_url);
      }
    };
    fetchData();
  }, [id]);

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

    let image_url = old_image_file;

    if (image_file) {
      if (old_image_file) {
        const oldImageName = old_image_file.split("/").pop();
        if (oldImageName) {
          const { error: removeError } = await supabase.storage
            .from("user_bk")
            .remove([oldImageName]);
          if (removeError) {
            console.log("ลบรูปเก่าไม่สำเร็จ:", removeError.message);
          }
        }
      }

      const fileExt = image_file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("user_bk")
        .upload(fileName, image_file);

      if (uploadError) {
        alert("อัปโหลดรูปภาพไม่สำเร็จ");
        console.log(uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("user_bk")
        .getPublicUrl(fileName);

      image_url = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("user_tb")
      .update({
        fullname: fullName,
        email,
        password,
        gender,
        user_image_url: image_url,
      })
      .eq("id", id);

    if (updateError) {
      alert("อัปเดตข้อมูลไม่สำเร็จ");
      console.log(updateError.message);
    } else {
      alert("บันทึกข้อมูลเรียบร้อยแล้ว");
      setOldImageFile(image_url);
      setImageFile(null);
      router.push("/dashboard/" + id);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-rose-100 font-sans p-4">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg w-full max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Change a new profile
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="text-center">
            <p className="mb-2 text-sm font-medium text-gray-700">
              Profile image
            </p>
            <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-2 border-rose-500 shadow-md">
              {previewImage && (
                <Image
                  src={previewImage}
                  alt="Profile Preview"
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <label
              htmlFor="profileImage"
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-rose-500 bg-rose-50 px-4 py-2 font-semibold text-rose-700 transition-colors hover:bg-rose-100"
            >
              New Image
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
          </div>
          <div className="flex flex-col items-start">
            <label
              htmlFor="fullname"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Fullname
            </label>
            <input
              id="fullname"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
            />
          </div>

          <div className="flex flex-col items-start">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
            />
          </div>

          <div className="flex flex-col items-start">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="date"
              type="date"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
            />
          </div>

          <div className="flex flex-col items-start">
            <span className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </span>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Male</span>
              </label>
              <label className="flex items-center">
                <input
                  name="gender"
                  type="radio"
                  value="female"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Female</span>
              </label>
            </div>
          </div>

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
