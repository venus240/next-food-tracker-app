"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("user_tb")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error) {
      alert("Invalid email or password");
      console.log(error);
      return;
    }

    router.push("/dashboard/" + data.id);
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
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
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
              Password
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

          <button
            type="submit"
            className="w-full px-4 py-3 bg-indigo-500 text-white rounded-full font-semibold text-lg hover:bg-indigo-600 transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
