import React from "react";

export default function KickedOut() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1 rounded-full mb-6">
        ✨ Intervue Poll
      </div>

      <h1 className="text-2xl sm:text-3xl font-semibold text-black mb-2">
        You’ve been Kicked out !
      </h1>

      <p className="text-gray-500 max-w-md">
        Looks like the teacher had removed you from the poll system. Please try
        again sometime.
      </p>
    </div>
  );
}
