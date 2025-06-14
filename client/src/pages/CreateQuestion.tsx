import React, { useState } from "react";
import socket from "../utils/socket";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateQuestion() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correct, setCorrect] = useState<number[]>([]);
  const [duration, setDuration] = useState(60);

  const handleAddOption = () => setOptions([...options, ""]);

  const removeOption = (idx: number) => {
    const newOptions = options.filter((_, i) => i !== idx);
    const newCorrect = correct
      .filter((i) => i !== idx)
      .map((i) => (i > idx ? i - 1 : i));
    setOptions(newOptions);
    setCorrect(newCorrect);
  };

  const handleOptionChange = (value: string, idx: number) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  const toggleCorrect = (idx: number, isCorrect: boolean) => {
    const updated = new Set(correct);
    if (isCorrect) updated.add(idx);
    else updated.delete(idx);
    setCorrect([...updated]);
  };

  const handleSubmit = async () => {
    const payload = {
      question,
      options,
      correctAnswers: correct,
      duration,
    };

    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/polls`, payload);

    socket.emit("teacher-ask-question", payload);

    navigate("/teacher");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto pb-32">
      <div className="bg-purple-100 inline-block text-purple-700 text-sm font-semibold px-4 py-1 rounded-full mb-6">
        ✨ Intervue Poll
      </div>

      <h1 className="text-3xl font-bold mb-1">
        Let’s <span className="text-purple-700">Get Started</span>
      </h1>
      <p className="text-gray-600 mb-6">
        You’ll have the ability to create and manage polls, ask questions, and
        monitor your students' responses in real-time.
      </p>

      <div className="flex items-center mb-4 justify-between">
        <label className="font-semibold block mb-1">Enter your question</label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="ml-4 rounded px-2 py-1 bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          {[30, 60, 90].map((t) => (
            <option key={t} value={t}>
              {t} seconds
            </option>
          ))}
        </select>
      </div>
      <div className="relative w-full">
        <textarea
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 rounded resize-none bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Type your question here..."
          maxLength={100}
        />
        <span className="absolute bottom-2 right-3 text-sm text-gray-400">
          {question.length}/100
        </span>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Edit Options</h3>
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center mb-2">
            <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm mr-2">
              {idx + 1}
            </div>

            <input
              value={opt}
              onChange={(e) => handleOptionChange(e.target.value, idx)}
              className="flex-1 p-2 rounded bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder={`Option ${idx + 1}`}
            />

            <div className="ml-4 flex gap-4 items-center text-sm">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`correct-${idx}`}
                  checked={correct.includes(idx)}
                  onChange={() => toggleCorrect(idx, true)}
                />{" "}
                Yes
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`correct-${idx}`}
                  checked={!correct.includes(idx)}
                  onChange={() => toggleCorrect(idx, false)}
                />{" "}
                No
              </label>

              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  className="text-red-500 ml-3 text-lg hover:text-red-700"
                  title="Remove option"
                >
                  ✖
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={handleAddOption}
          className="mt-3 px-4 py-1 border border-purple-600 text-purple-600 rounded"
        >
          + Add More option
        </button>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-12 py-4 flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full shadow-md"
        >
          Ask Question
        </button>
      </div>
    </div>
  );
}
