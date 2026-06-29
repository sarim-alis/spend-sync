"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Transactions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const type = searchParams.get("type");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-1 items-center justify-center min-h-screen bg-[#f5f9fc]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {type === "income" && "Income Transactions"}
          {type === "expense" && "Expense Transactions"}
          {type === "saving" && "Savings Transactions"}
        </h1>
        <p className="text-gray-600">This page is under construction</p>
        <button
          onClick={() => router.push("/home")}
          className="mt-6 bg-pink-400 text-white px-6 py-2 rounded-full hover:bg-pink-500"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
