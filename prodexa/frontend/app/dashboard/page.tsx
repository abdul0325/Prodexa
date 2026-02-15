"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="border p-8 rounded-lg shadow-sm text-center">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p className="text-gray-600">
          {token ? "Login Successful ✅" : "No token found"}
        </p>
      </div>
    </div>
  );
}
