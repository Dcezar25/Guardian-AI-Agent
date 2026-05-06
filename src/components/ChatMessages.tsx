import { useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import { FiFile } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatMessages() {
  const { conversations, activeConversationId } = useUser();
  const containerRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [activeConversation?.messages]);

  if (!activeConversation) return null;

  // 🔹 Funcție helper pentru afișarea fișierelor
  const renderFile = (msg: { file?: File; fileType?: "pdf" | "image" }) => {
    if (!msg.file) return null;

    const file: File = msg.file;

    if (msg.fileType === "pdf") {
      const handleOpen = () => {
        const fileURL = URL.createObjectURL(file);
        const newWindow = window.open(fileURL);
        if (!newWindow) {
          alert("Could not open file. Please check your popup blocker.");
        }
      };

      return (
        <div
          className="mt-2 flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded border border-gray-600"
          onClick={handleOpen}
        >
          <FiFile size={24} />
          <span className="underline text-blue-300">{file.name}</span>
        </div>
      );
    }

    if (msg.fileType === "image") {
      return (
        <div className="mt-2">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="max-w-full rounded border border-gray-600"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-6 space-y-4 max-h-full">
      {activeConversation.messages.map((msg, index) => (
        <div
          key={index}
          className={`max-w-xl p-4 rounded-xl text-white break-words shadow-md ${
            msg.sender === "guardian"
              ? "bg-blue-700 self-start"
              : "bg-slate-700 self-end ml-auto"
          }`}
        >
          {msg.text && (
            <div className="markdown-content">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Stilizează link-urile ca să fie albastre și subliniate
                  a: ({node, ...props}) => <a {...props} className="text-blue-300 underline hover:text-blue-100" target="_blank" rel="noopener noreferrer" />,
                  // Stilizează listele
                  ul: ({node, ...props}) => <ul {...props} className="list-disc list-inside ml-2" />,
                  ol: ({node, ...props}) => <ol {...props} className="list-decimal list-inside ml-2" />,
                  // Stilizează bold
                  strong: ({node, ...props}) => <strong {...props} className="font-bold text-yellow-300" />,
                  // Paragrafe cu spațiu între ele
                  p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0" />
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          )}
          {renderFile(msg)}
        </div>
      ))}
    </div>
  );
}