import axios from "axios";
import React, { useEffect, useState } from "react";
import { QuestionType } from "../types/question";
import Question from "../components/Question";
import ChatBox from "../components/Chatbox";
import { useNavigate } from "react-router-dom";

export default function QuestionHistory() {
  const navigate = useNavigate();
  const [pollHistory, setPollHistory] = useState<QuestionType[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/past-polls`)
      .then((res) => {
        const { pastPolls, responses } = res.data;
        setPollHistory(pastPolls || []);
        setResponses(responses || {});
      })
      .catch((err) => {
        navigate("/teacher");
      });
  }, []);

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-semibold mb-6">
        View <span className="font-bold">Poll History</span>
      </h1>

      {pollHistory.map((poll) => (
        <Question
          key={poll.question}
          questionData={{
            ...poll,
            questionNumber: pollHistory.indexOf(poll) + 1,
          }}
          submitted={true}
          responses={responses}
          isTeacher={true}
          isPollHistory={true}
        />
      ))}

      <ChatBox name="Teacher" isTeacher={false} />
    </div>
  );
}
