import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "lucide-react";

interface Props {
  questionData: {
    question: string;
    options: string[];
    duration: number;
    questionNumber?: number;
    correctAnswers: number[];
  };
  onSubmit?: (answer: string) => void;
  onTimeout?: () => void;
  submitted: boolean;
  responses: Record<string, string>;
  isTeacher?: boolean;
  isPollHistory?: boolean;
}

export default function Question({
  questionData: { question, options, duration, questionNumber, correctAnswers },
  onSubmit,
  onTimeout,
  submitted,
  responses,
  isTeacher,
  isPollHistory,
}: Props) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(duration);

  const submitHandler = () => {
    if (selected !== null && onSubmit) {
      onSubmit(options[selected]);
      setSelected(null);
      setTimeLeft(0);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout && onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {isTeacher && !isPollHistory && (
        <button
          onClick={() => navigate("/poll-history")}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full shadow-md flex items-center gap-2 absolute top-4 right-10 z-10 hover:opacity-90 transition"
        >
          <EyeIcon />
          View Poll history
        </button>
      )}
      <div className="max-w-xl p-6 rounded-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">
            Question {!isTeacher || (isPollHistory && questionNumber)}
          </h2>
          {!isTeacher && (
            <div className="flex items-center gap-1 text-red-600 font-semibold">
              <span>⏱</span> <span>{timeLeft.toString().padStart(2, "0")}</span>
            </div>
          )}
        </div>

        <div className="border rounded-lg overflow-hidden shadow">
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-4 py-2 font-medium">
            {question}
          </div>

          <div className="p-4 space-y-2 border border-t-0 border-purple-300 rounded-lg rounded-t-none">
            {options.map((opt, idx) => {
              if (submitted) {
                const totalResponses = Object.keys(responses).length;
                const counts: Record<string, number> = {};

                options.forEach((opt) => (counts[opt] = 0));
                Object.values(responses).forEach((res) => {
                  if (counts[res] !== undefined) counts[res]++;
                });

                const count = counts[opt];
                const percent =
                  totalResponses === 0
                    ? 0
                    : Math.round((count / totalResponses) * 100);

                return (
                  <div
                    key={idx}
                    className={`bg-gray-100 rounded-lg px-3 py-2 border relative overflow-hidden ${
                      correctAnswers.includes(idx) && "border-purple-500"
                    }`}
                  >
                    <div
                      className="absolute inset-0 bg-purple-400"
                      style={{ width: `${percent}%`, opacity: 0.2 }}
                    />
                    <div className="relative flex justify-between items-center z-10">
                      <div className="flex items-center gap-2 font-medium">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-500 text-white text-xs">
                          {idx + 1}
                        </div>
                        <span>{opt}</span>
                      </div>
                      <span className="text-sm font-semibold">{percent}%</span>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={idx}
                  onClick={() => setSelected(idx)}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-left border rounded transition 
                ${
                  selected === idx
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 bg-gray-100 hover:bg-gray-200"
                }`}
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-white text-sm ${
                      selected === idx ? "bg-purple-500" : "bg-gray-400"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {!isPollHistory &&
          (isTeacher ? (
            <div className="py-4 flex justify-end">
              <button
                onClick={() => navigate("/create-question")}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full shadow-md hover:opacity-90 transition"
              >
                + Ask a new question
              </button>
            </div>
          ) : submitted ? (
            <div className="text-center mt-6 text-gray-500 font-medium">
              Wait for the teacher to ask a new question..
            </div>
          ) : (
            <div className="flex justify-end mt-6">
              <button
                disabled={selected === null}
                onClick={submitHandler}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium px-6 py-2 rounded-full disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          ))}
      </div>
    </>
  );
}
