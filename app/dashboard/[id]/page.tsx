"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

type FoodTaskers = {
  id: string;
  foodname: string;
  meal: string;
  fooddate_at: string;
  food_image_url: string;
  user_id: string;
  create_at: string;
  update_at: string;
};

type UserTackers = {
  id: string;
  fullname: string;
  email: string;
  password: string;
  gender: string;
  user_image_url: string;
  create_at: string;
  update_at: string;
};

export default function App() {
  const [foodTaskers, setFoodTaskers] = useState<FoodTaskers[]>([]);
  const [users, setUsers] = useState<UserTackers[]>([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("food_tb")
        .select("*")
        .eq("user_id", id);

      if (error) {
        alert("An error occurred while fetching food data.");
        console.log(error);
        return;
      }
      if (data) {
        setFoodTaskers(data as FoodTaskers[]);
      }
    };

    const getUsers = async () => {
      const { data, error } = await supabase
        .from("user_tb")
        .select("*")
        .eq("id", id);

      if (error) {
        alert("An error occurred while fetching user data.");
        console.log(error);
        return;
      }
      if (data) {
        setUsers(data as UserTackers[]);
      }
    };

    getUsers();
    fetchData();
  }, [id]);

  const handleDelete = async (foodId: string, image_url: string) => {
    if (confirm("Are you sure you want to delete this food item?")) {
      if (image_url) {
        const image_name = image_url.split("/").pop();
        const { error } = await supabase.storage
          .from("task_bk")
          .remove([image_name as string]);

        if (error) {
          alert("An error occurred while deleting the image from storage.");
          console.log(error.message);
          return;
        }
      }

      const { error } = await supabase
        .from("food_tb")
        .delete()
        .eq("id", foodId);

      if (error) {
        alert("An error occurred while deleting the record.");
        console.log(error.message);
        return;
      }

      setFoodTaskers(foodTaskers.filter((food) => food.id !== foodId));
    }
  };

  return (
    <div className="min-h-screen p-8 bg-rose-100 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Food Tracker Dashboard</h1>
          <div className="flex justify-center items-center gap-4">
            <Link href={"/addfood/" + id}>
              <button className="px-6 py-3 bg-rose-600 text-white font-semibold rounded-full shadow-md hover:bg-rose-700 transition duration-300">
                + Add Food
              </button>
            </Link>

            {users.map((user) => (
              <Link href={"/profile/" + user.id} key={user.id}>
                <Image
                  src={user.user_image_url}
                  alt="User Profile"
                  width={100}
                  height={100}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-rose-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Food Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meal
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {foodTaskers.length > 0 ? (
                foodTaskers.map((food) => (
                  <tr
                    key={food.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {food.fooddate_at}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Image
                        src={food.food_image_url}
                        alt={food.foodname}
                        width={50}
                        height={50}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {food.foodname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {food.meal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <Link href={`/updatefood/${food.id}`}>
                        <button className="text-rose-600 hover:text-rose-900 mx-2 transition-colors duration-200">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() =>
                          handleDelete(food.id, food.food_image_url)
                        }
                        className="text-gray-600 hover:text-gray-900 mx-2 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No food items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
