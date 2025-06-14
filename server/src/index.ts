import express from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

interface Question {
  question: string;
  options: string[];
  correctAnswers: number[];
  duration: number;
}

interface Responses {
  [studentName: string]: string;
}

let currentQuestion: Question | null = null;
let responses: Responses = {};
let students: { [socketId: string]: string } = {};
let waitingStudents: { [socketId: string]: string } = {};
let pastPolls: {
  question: string;
  options: string[];
  correctAnswers: number[];
  duration: number;
}[] = [];

io.on("connection", (socket: Socket) => {
  console.log("🔌 New connection:", socket.id);

  socket.on("student-join", ({ name }: { name: string }) => {
    console.log(`${name} joined as student`);
    if (currentQuestion) waitingStudents[socket.id] = name;
    else students[socket.id] = name;
    io.emit(
      "update-participants",
      Object.entries({ ...students, ...waitingStudents }).map(([id, name]) => ({
        id,
        name,
      }))
    );
  });

  socket.on("teacher-ask-question", (questionData: Question) => {
    if (!currentQuestion) {
      currentQuestion = questionData;
      responses = {};
      Object.entries(waitingStudents).forEach(([socketId, name]) => {
        students[socketId] = name;
        delete waitingStudents[socketId];
      });
      const payload = {
        questionData,
        questionNumber: pastPolls.length + 1,
      };
      Object.keys(students).forEach((socketId) => {
        io.to(socketId).emit("new-question", payload);
      });
      console.log("📢 New question asked:", questionData);
    }
  });

  socket.on("student-submit-answer", ({ answer }: { answer: string }) => {
    const name = students[socket.id];
    if (name && currentQuestion) {
      responses[name] = answer;
      const total = Object.keys(students).length;
      const submitted = Object.keys(responses).length;
      io.emit("poll-progress", responses);

      if (submitted === total) {
        finishPoll();
      }
    }
  });

  socket.on("disconnect", () => {
    delete students[socket.id];
    delete waitingStudents[socket.id];
    if (currentQuestion) {
      const name = Object.keys(students).find(
        (key) => students[key] === waitingStudents[socket.id]
      );
      if (name) {
        delete responses[name];
      }
    }
    console.log("❌ Disconnected:", socket.id);
  });

  socket.on("send-message", ({ name, message }) => {
    io.emit("receive-message", { name, message });
  });

  socket.on("kick-student", ({ socketId }) => {
    io.to(socketId).emit("kicked");
    io.sockets.sockets.get(socketId)?.disconnect();
  });
});

function finishPoll() {
  if (currentQuestion) {
    pastPolls.push({
      question: currentQuestion.question,
      options: currentQuestion.options,
      correctAnswers: currentQuestion.correctAnswers,
      duration: currentQuestion.duration,
    });
  }
  currentQuestion = null;
  responses = {};
}

app.post("/polls", (req, res) => {
  const { question, options, correctAnswers, duration } = req.body;
  pastPolls.push({ question, options, correctAnswers, duration });
  res.status(201).json({ message: "Poll saved" });
});

app.get("/past-polls", (_req, res) => {
  res.json({ pastPolls, responses });
});

app.get("/students", (_req, res) => {
  res.json(Object.entries(students).map(([id, name]) => ({ id, name })));
});

app.get("/current-question", (_req, res) => {
  if (currentQuestion) {
    res.json(currentQuestion);
  } else {
    res.status(404).json({ message: "No current question" });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
