import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";
import { useUser } from "../context/UserContext";
import { FiPlus, FiX, FiSend, FiLoader } from "react-icons/fi";

// Acceptăm currentUser care poate fi null
export default function ChatInput({ currentUser }: { currentUser: any }) {
  const [text, setText] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fileDialog, setFileDialog] = useState<{ type: "pdf" | "image"; show: boolean }>({ type: "pdf", show: false });
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addMessage, activeConversationId, conversations } = useUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = async () => {
    if (!text.trim() || loading) return;

    const userMsgText = text;
    addMessage({ sender: "user", text: userMsgText });
    setText("");
    setLoading(true);

    const currentConv = conversations.find(c => c.id === activeConversationId);
    const history = currentConv ? currentConv.messages : [];
    const userIdToSend = currentUser ? currentUser.id : null;

    try {
      const response = await fetch("http://127.0.0.1:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsgText,
          history: history,
          userId: userIdToSend
        }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();

      addMessage({
        sender: "guardian",
        text: data.response,
      });

    } catch (error) {
      console.error("Eroare Chat:", error);
      addMessage({
        sender: "guardian",
        text: "⚠️ Eroare de conexiune. Verifică dacă serverul Python (agent.py) rulează.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>, type: "pdf" | "image") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "pdf" && file.type !== "application/pdf") {
      setAlertMsg("Only PDF files are allowed!");
      return;
    }
    if (type === "image" && !["image/png", "image/jpeg"].includes(file.type)) {
      setAlertMsg("Only PNG or JPEG images are allowed!");
      return;
    }

    addMessage({ sender: "user", file, fileType: type });
    setFileDialog({ ...fileDialog, show: false });
    setDropdownOpen(false);
  };

  return (
    <div className="w-full p-4 flex flex-col items-center space-y-2 bg-gray-900 border-t border-slate-800">
      <div className="flex items-center space-x-2 w-full relative max-w-4xl">
        
        {/* Buton Upload (+) */}
        <div ref={dropdownRef} className="relative">
          <button 
            className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition text-white border border-gray-600" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={loading}
          >
            <FiPlus size={20} />
          </button>

          {dropdownOpen && (
            <div className="absolute bottom-14 left-0 bg-gray-800 text-white p-2 rounded-xl shadow-xl flex flex-col space-y-1 z-50 w-40 border border-slate-700 animate-fade-in">
              <button
                className="hover:bg-gray-700 px-3 py-2 rounded text-left text-sm font-medium transition"
                onClick={() => setFileDialog({ type: "pdf", show: true })}
              >
                📄 Add Document
              </button>
              <button
                className="hover:bg-gray-700 px-3 py-2 rounded text-left text-sm font-medium transition"
                onClick={() => setFileDialog({ type: "image", show: true })}
              >
                🖼️ Add Image
              </button>
            </div>
          )}
        </div>

        {/* Input Text */}
        <div className="flex-1 relative">
            <input
            type="text"
            placeholder={loading ? "Guardian se gândește..." : "Scrie un mesaj..."}
            className={`w-full p-3 pl-4 pr-12 rounded-full bg-slate-800 text-white placeholder-gray-400 outline-none border-2 transition ${loading ? 'border-gray-600 opacity-70 cursor-not-allowed' : 'border-transparent focus:border-blue-600'}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            />
            
            {/* Buton Send */}
            <button
            onClick={handleSend}
            disabled={loading || !text.trim()}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition ${
                loading || !text.trim() ? "text-gray-500" : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
            }`}
            >
            {loading ? <FiLoader className="animate-spin" size={18}/> : <FiSend size={18} className="ml-0.5" />}
            </button>
        </div>
      </div>

      {/* Modal Upload */}
      {fileDialog.show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-blue-600 text-white p-6 rounded-2xl w-full max-w-sm relative shadow-2xl animate-scale-up">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
              onClick={() => setFileDialog({ ...fileDialog, show: false })}
            >
              <FiX size={20} />
            </button>
            <h3 className="text-lg font-bold mb-2 text-blue-400">Upload File</h3>
            <p className="text-sm text-gray-400 mb-6">
              {fileDialog.type === "pdf" ? "Select a PDF document to analyze." : "Select an image (PNG/JPEG)."}
            </p>
            
            <label className="block w-full cursor-pointer">
                <div className="w-full border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:bg-gray-800 hover:border-blue-500 transition group">
                    <span className="text-blue-400 font-medium group-hover:underline">Click to browse</span>
                </div>
                <input
                type="file"
                className="hidden"
                accept={fileDialog.type === "pdf" ? "application/pdf" : "image/png, image/jpeg"}
                onChange={(e) => handleFile(e, fileDialog.type)}
                />
            </label>
          </div>
        </div>
      )}

      {/* Alert Toast */}
      {alertMsg && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full z-50 flex items-center shadow-lg animate-bounce-in">
          <span className="font-medium mr-4">{alertMsg}</span>
          <button onClick={() => setAlertMsg(null)} className="hover:bg-red-700 rounded-full p-1">
            <FiX />
          </button>
        </div>
      )}
    </div>
  );
}