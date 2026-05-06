import { useState, useEffect, useRef } from "react";
import { FiSend, FiUser } from "react-icons/fi";

type PublicMessage = {
  username: string;
  text: string;
  time: string;
};

export default function PublicChat({ username }: { username: string }){
  const [messages, setMessages] = useState<PublicMessage[]>([]);
  const [input, setInput] = useState("");
  // Generăm un nume random la început (ex: User492)
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Funcția care descarcă mesajele (POLLING)
  const fetchMessages = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/public-chat");
      const data = await res.json();
      setMessages(data.messages);
    } catch (e) {
      console.error("Eroare chat:", e);
    }
  };

  // 2. Auto-Refresh la fiecare 2 secunde
  useEffect(() => {
    fetchMessages(); // Prima dată imediat
    const interval = setInterval(fetchMessages, 2000); // Apoi la 2 secunde
    return () => clearInterval(interval); // Curățăm la ieșire
  }, []);

  // 3. Auto-Scroll jos când apar mesaje noi
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 4. Trimitere mesaj
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Trimitem la server
    await fetch("http://127.0.0.1:5000/api/public-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, message: input }),
    });

    setInput("");
    fetchMessages(); // Refresh instant
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Header */}
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-green-400">🌍 Community Chat</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <FiUser /> You are: <span className="text-white font-bold">{username}</span>
        </div>
      </div>

      {/* Lista Mesaje */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => {
          const isMe = msg.username === username;
          return (
            <div key={idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              <span className="text-xs text-gray-500 mb-1">{msg.username}</span>
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] break-words ${
                  isMe ? "bg-green-600 text-white" : "bg-slate-700 text-gray-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-800 flex gap-2">
        <input
          className="flex-1 bg-slate-900 text-white p-2 rounded border border-slate-700 outline-none focus:border-green-500"
          placeholder="Scrie un mesaj către comunitate..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}