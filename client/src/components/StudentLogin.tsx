import React, { useState } from "react";
import socket from "../utils/socket";

interface StudentLoginProps {
  setName: (name: string) => void;
}

export default function StudentLogin({
  setName: setStudentName,
}: StudentLoginProps) {
  const [name, setName] = useState("");

  const handleContinue = () => {
    if (!name.trim()) return;
    sessionStorage.setItem("studentName", name.trim());
    socket.emit("student-join", { name: name.trim() });
    setStudentName(name.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-purple-100 inline-block text-purple-700 text-sm font-semibold px-4 py-1 rounded-full mb-6">
          ✨ Intervue Poll
        </div>

        <h1 className="text-3xl font-bold mb-2">
          Let’s <span className="text-purple-700">Get Started</span>
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          If you’re a student, you’ll be able to{" "}
          <strong>submit your answers</strong>, participate in live polls, and
          see how your responses compare with your classmates.
        </p>

        <label className="block text-left font-medium mb-1">
          Enter your Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-200 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Your name"
        />

        <button
          onClick={handleContinue}
          disabled={!name.trim()}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium py-2 px-8 rounded-full hover:opacity-90 disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
