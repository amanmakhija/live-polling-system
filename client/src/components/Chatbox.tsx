import React, { useEffect, useState } from "react";
import socket from "../utils/socket";
import axios from "axios";
import { MessageSquareIcon, XIcon } from "lucide-react";

export default function ChatBox({
  name,
  isTeacher,
}: {
  name: string;
  isTeacher: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "participants">("chat");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ name: string; message: string }[]>(
    []
  );
  const [participants, setParticipants] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    socket.on("receive-message", (msg) =>
      setMessages((prev) => [...prev, msg])
    );

    socket.on("update-participants", (participants) => {
      setParticipants(participants);
    });
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      socket.emit("send-message", { name, message });
      setMessage("");
    }
  };

  const kickStudent = (id: string) => {
    socket.emit("kick-student", { socketId: id });
  };

  return (
    <>
      <button
        className="fixed bottom-4 right-4 bg-purple-600 text-white rounded-full p-3 shadow-md hover:bg-purple-700 z-50"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <XIcon className="w-6 h-6" />
        ) : (
          <MessageSquareIcon className="w-6 h-6" />
        )}
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 w-80 rounded shadow-lg border bg-white z-50">
          <div className="flex border-b">
            <button
              onClick={() => setTab("chat")}
              className={`flex-1 text-sm px-4 py-2 ${
                tab === "chat"
                  ? "text-purple-600 font-semibold border-b-2 border-purple-600"
                  : ""
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setTab("participants")}
              className={`flex-1 text-sm px-4 py-2 ${
                tab === "participants"
                  ? "text-purple-600 font-semibold border-b-2 border-purple-600"
                  : ""
              }`}
            >
              Participants
            </button>
          </div>

          <div className="h-64 overflow-y-auto p-3 text-sm">
            {tab === "chat" ? (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-2 text-sm ${
                    m.name === name ? "text-right" : "text-left"
                  }`}
                >
                  <div className={"mt-1 text-blue-800"}>{m.name}</div>
                  <div
                    className={`inline-block px-3 py-2 rounded-b-lg ${
                      m.name === name
                        ? "bg-purple-500 text-white rounded-tr-sm rounded-tl-lg"
                        : "bg-black text-white rounded-tl-sm rounded-tr-lg"
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="flex justify-between font-semibold border-b pb-1 mb-2 text-xs text-gray-500">
                  <span>Name</span>
                  {isTeacher && <span>Action</span>}
                </div>
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center py-1"
                  >
                    <span>{p.name}</span>
                    {isTeacher && (
                      <button
                        onClick={() => kickStudent(p.id)}
                        className="text-blue-600 text-xs hover:underline"
                      >
                        Kick out
                      </button>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          <div
            className={`flex p-2 h-[50px] ${tab === "chat" ? "border-t" : ""}`}
          >
            {tab === "chat" && (
              <>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 text-sm px-2 py-1 border rounded"
                  placeholder="Type a message..."
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  className="ml-2 text-white bg-purple-600 hover:bg-purple-700 text-sm px-4 py-1 rounded"
                >
                  Send
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
