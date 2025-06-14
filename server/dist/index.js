"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
app.use(express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
let currentQuestion = null;
let responses = {};
let students = {};
let waitingStudents = {};
let pastPolls = [];
io.on("connection", (socket) => {
    console.log("🔌 New connection:", socket.id);
    socket.on("student-join", ({ name }) => {
        console.log(`${name} joined as student`);
        if (currentQuestion)
            waitingStudents[socket.id] = name;
        else
            students[socket.id] = name;
        io.emit("update-participants", Object.entries(Object.assign(Object.assign({}, students), waitingStudents)).map(([id, name]) => ({
            id,
            name,
        })));
    });
    socket.on("teacher-ask-question", (questionData) => {
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
    socket.on("student-submit-answer", ({ answer }) => {
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
            const name = Object.keys(students).find((key) => students[key] === waitingStudents[socket.id]);
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
        var _a;
        io.to(socketId).emit("kicked");
        (_a = io.sockets.sockets.get(socketId)) === null || _a === void 0 ? void 0 : _a.disconnect();
    });
});
function finishPoll() {
    if (currentQuestion) {
        pastPolls.push({
            question: currentQuestion.question,
            options: currentQuestion.options,
            correctAnswers: currentQuestion.correctAnswers,
            duration: currentQuestion.duration,
            responses: Object.assign({}, responses),
        });
    }
    currentQuestion = null;
    responses = {};
}
app.post("/api/polls", (req, res) => {
    const { question, options, correctAnswers, duration } = req.body;
    pastPolls.push({ question, options, correctAnswers, duration });
    res.status(201).json({ message: "Poll saved" });
});
app.get("/api/past-polls", (_req, res) => {
    res.json(pastPolls);
});
app.get("/api/students", (_req, res) => {
    res.json(Object.entries(students).map(([id, name]) => ({ id, name })));
});
app.get("/api/current-question", (_req, res) => {
    if (currentQuestion) {
        res.json(currentQuestion);
    }
    else {
        res.status(404).json({ message: "No current question" });
    }
});
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../client/dist", "index.html"));
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
