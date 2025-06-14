import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Teacher from "./pages/Teacher";
import Student from "./pages/Student";
import CreateQuestion from "./pages/CreateQuestion";
import QuestionHistory from "./pages/QuestionHistory";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/student" element={<Student />} />
        <Route path="/create-question" element={<CreateQuestion />} />
        <Route path="/poll-history" element={<QuestionHistory />} />
      </Routes>
    </Router>
  );
}
