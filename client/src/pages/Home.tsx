import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

export default function Home() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"student" | "teacher" | null>("student");

  const handleContinue = () => {
    if (role === "student") navigate("/student");
    else if (role === "teacher") navigate("/create-question");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-sm text-purple-700 bg-purple-100 px-4 py-1 rounded-full mb-4 font-semibold">
        ✨ Intervue Poll
      </div>

      <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-2">
        Welcome to the{" "}
        <span className="text-purple-700">Live Polling System</span>
      </h1>
      <p className="text-gray-500 text-center mb-8">
        Please select the role that best describes you to begin using the live
        polling system
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl mb-6">
        <button
          onClick={() => setRole("student")}
          className={clsx(
            "flex-1 border rounded-lg p-6 text-left shadow-sm hover:shadow-md transition",
            role === "student"
              ? "border-purple-500 bg-purple-50"
              : "border-gray-200"
          )}
        >
          <h2 className="font-semibold text-lg mb-1">I’m a Student</h2>
          <p className="text-sm text-gray-600">
            Submit answers to questions and view live results.
          </p>
        </button>

        <button
          onClick={() => setRole("teacher")}
          className={clsx(
            "flex-1 border rounded-lg p-6 text-left shadow-sm hover:shadow-md transition",
            role === "teacher"
              ? "border-purple-500 bg-purple-50"
              : "border-gray-200"
          )}
        >
          <h2 className="font-semibold text-lg mb-1">I’m a Teacher</h2>
          <p className="text-sm text-gray-600">
            Ask questions and view live poll results in real-time.
          </p>
        </button>
      </div>

      <button
        onClick={handleContinue}
        disabled={!role}
        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium py-2 px-8 rounded-full hover:opacity-90 disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
}
