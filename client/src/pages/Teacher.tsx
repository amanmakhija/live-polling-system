import React, { useEffect, useState } from "react";
import socket from "../utils/socket";
import axios from "axios";
import ChatBox from "../components/Chatbox";
import Question from "../components/Question";
import { useNavigate } from "react-router-dom";
import { QuestionType } from "../types/question";

export default function Teacher() {
  const navigate = useNavigate();
  const [results, setResults] = useState({} as Record<string, string>);
  const [question, setQuestion] = useState<QuestionType | null>(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/current-question`)
      .then((res) => {
        if (res.data) {
          setQuestion({
            question: res.data.question,
            options: res.data.options,
            correctAnswers: res.data.correctAnswers,
            duration: res.data.duration,
          });
        }
      })
      .catch(() => {
        navigate("/create-question");
      });

    socket.on("poll-progress", (res) => {
      setResults(res);
    });
  }, []);

  return (
    <div>
      {question && (
        <div className="flex items-center min-h-screen min-w-screen bg-gray-100 relative">
          <Question
            questionData={question}
            submitted={true}
            responses={results}
            isTeacher={true}
          />
        </div>
      )}

      <ChatBox name="Teacher" isTeacher={false} />
    </div>
  );
}
