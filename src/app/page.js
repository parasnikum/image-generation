"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const generateId = () => crypto.randomUUID();

export default function Home() {
  const [sessions, setSessions] = useState({});
  const [currentId, setCurrentId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const fileDropRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("chat_sessions")) || {};
    setSessions(stored);
    const firstId = Object.keys(stored)[0];
    if (firstId) setCurrentId(firstId);
  }, []);

  useEffect(() => {
    localStorage.setItem("chat_sessions", JSON.stringify(sessions));
  }, [sessions]);

  const currentMessages = sessions[currentId]?.messages || [];

  const startNewChat = () => {
    const id = generateId();
    setSessions((prev) => ({
      ...prev,
      [id]: { messages: [], created: Date.now() },
    }));
    setCurrentId(id);
  };

  const generateImage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const userMessage = { text: input, isUser: true };
    
    const updated = {
      ...sessions,
      [currentId]: {
        ...sessions[currentId],
        messages: [...(sessions[currentId]?.messages || []), userMessage],
      },
    };
    setSessions(updated);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      const botMessage = {
        text: data.image,
        isUser: false,
        isImage: true,
        error: false,  
      };

      setSessions((prev) => ({
        ...prev,
        [currentId]: {
          ...prev[currentId],
          messages: [...prev[currentId].messages, botMessage],
        },
      }));
    } catch (err) {
      console.error(err);
      const botMessage = {
        text: "Failed to Generate",
        isUser: false,
        isImage: true,
        error: true, 
      };

      setSessions((prev) => ({
        ...prev,
        [currentId]: {
          ...prev[currentId],
          messages: [...prev[currentId].messages, botMessage],
        },
      }));
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    alert(`Drag-and-drop support stub: ${file.name}`);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      setInput("");
      generateImage();
    }
  };

  return (
    <div className="flex h-screen bg-white text-black">
      <aside className="w-[280px] border-r p-4 flex flex-col bg-gray-50">
        <button
          onClick={startNewChat}
          className="mb-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          + New Chat
        </button>
        <div className="flex-1 overflow-y-auto space-y-2">
          {Object.entries(sessions).map(([id, session]) => (
            <button
              key={id}
              onClick={() => setCurrentId(id)}
              className={`text-left w-full px-3 py-2 rounded ${
                id === currentId
                  ? "bg-blue-100 font-semibold"
                  : "hover:bg-gray-200"
              }`}
            >
              Chat {id != "null" ? id : "Default" }
            </button>
          ))}
        </div>
      </aside>

      <main
        className="flex-1 flex flex-col p-4 relative"
        onDrop={handleDrop}
        onDragOver={allowDrop}
        ref={fileDropRef}
      >
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {currentMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.isUser ? "justify-end" : "justify-start"
              }`}
            >
              {msg.isImage ? (
                <div className="relative w-[300px] h-[300px]">
                  {loading && !msg.error && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                  {msg.error ? (
                    <div className="absolute inset-0 flex items-center justify-center text-red-500 font-semibold">
                      Failed to Generate
                    </div>
                  ) : (
                    <Image
                      src={`data:image/png;base64,${msg.text}`}
                      alt="Generated"
                      fill
                      className="rounded-md object-cover"
                    />
                  )}
                </div>
              ) : (
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg ${
                    msg.isUser ? "bg-blue-500 text-white" : "bg-gray-300"
                  }`}
                >
                  {msg.text}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex border-t pt-4 gap-2">
          <input
            type="text"
            className="flex-1 border rounded p-3"
            placeholder="Type your prompt or drop a file..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}  
          />
          <button
            onClick={generateImage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
