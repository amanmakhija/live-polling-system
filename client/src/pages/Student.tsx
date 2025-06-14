import React, { useEffect, useState } from "react";
import socket from "../utils/socket";
import StudentLogin from "../components/StudentLogin";
import WaitingScreen from "../components/WaitingScreen";
import Question from "../components/Question";
import ChatBox from "../components/Chatbox";
import KickedOut from "../components/KickedOut";

export default function Student() {
  const [name, setName] = useState("");
  const [question, setQuestion] = useState<{
    question: string;
    options: string[];
    correctAnswers: number[];
    duration: number;
    questionNumber: number;
  } | null>(null);
  const [kicked, setKicked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState({} as Record<string, string>);

  useEffect(() => {
    socket.on("new-question", (q) => {
      setQuestion({ ...q.questionData, questionNumber: q.questionNumber });
      setSubmitted(false);
    });
    socket.on("kicked", () => {
      setKicked(true);
    });
    socket.on("poll-progress", (res) => {
      setResults(res);
    });
  }, []);

  if (!name) return <StudentLogin setName={setName} />;
  if (kicked) return <KickedOut />;

  return (
    <div>
      {!question && !submitted ? (
        <WaitingScreen />
      ) : (
        question && (
          <div className="flex items-center min-h-screen min-w-screen bg-gray-100 relative">
            <Question
              questionData={question}
              onSubmit={(answer) => {
                socket.emit("student-submit-answer", { answer });
                setSubmitted(true);
              }}
              onTimeout={() => {
                setSubmitted(true);
              }}
              submitted={submitted}
              responses={results}
            />
          </div>
        )
      )}

      <ChatBox name={name} isTeacher={false} />
    </div>
  );
}
