import React from "react";

export default function WaitingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <div className="bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1 rounded-full mb-6">
        ✨ Intervue Poll
      </div>

      <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent mb-4" />

      <p className="text-xl font-semibold text-gray-900">
        Wait for the teacher to ask questions..
      </p>
    </div>
  );
}
