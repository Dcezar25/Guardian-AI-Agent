import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type Message = {
  sender: "user" | "guardian";
  text?: string;
  file?: File;
  fileType?: "pdf" | "image";
};

export type Conversation = {
  id: string;
  messages: Message[];
};

type UserContextType = {
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversation: (id: string) => void;
  newConversation: () => void;
  addMessage: (msg: Message) => void;
  downloadConversation: (id: string | null) => void;
  clearHistory: () => void; // Funcție nouă utilă
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  // 1. ÎNCĂRCAREA LA PORNIRE (Lazy Initialization)
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem("GUARDIAN_HISTORY");
    if (saved) {
      try {
        // Trebuie să gestionăm faptul că fișierele nu se pot salva în localStorage
        // Deci încărcăm doar textele
        return JSON.parse(saved);
      } catch (e) {
        console.error("Eroare la citirea istoricului", e);
      }
    }
    // Dacă nu avem nimic salvat, pornim cu un mesaj default
    return [{
      id: crypto.randomUUID(),
      messages: [{ sender: "guardian", text: "Hello. I am The Guardian. I am here to protect you." }]
    }];
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    conversations.length > 0 ? conversations[0].id : null
  );

  // 2. SALVAREA AUTOMATĂ (La fiecare modificare)
  useEffect(() => {
    // Filtrăm fișierele (File object) pentru că nu pot fi salvate în text
    const cleanConversations = conversations.map(conv => ({
      ...conv,
      messages: conv.messages.map(msg => ({
        ...msg,
        file: undefined, // Nu salvăm blob-ul
        text: msg.text,
        sender: msg.sender,
        fileType: msg.fileType
      }))
    }));
    localStorage.setItem("GUARDIAN_HISTORY", JSON.stringify(cleanConversations));
  }, [conversations]);

  const setActiveConversation = (id: string) => setActiveConversationId(id);

  const newConversation = () => {
    const id = crypto.randomUUID();
    const greetingMsg: Message = {
        sender: "guardian",
        text: "Hello. I am The Guardian. I am here to protect, guide, and support you.",
    };
    const conv: Conversation = { id, messages: [greetingMsg] };
    setConversations(prev => [conv, ...prev]);
    setActiveConversationId(id);
  };

  const addMessage = (msg: Message) => {
    if (!activeConversationId) return;
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversationId
          ? { ...conv, messages: [...conv.messages, msg] }
          : conv
      )
    );
  };

  const downloadConversation = (id: string | null) => {
    if (!id) return;
    const conv = conversations.find(c => c.id === id);
    if (!conv) return;
    const text = conv.messages.map(m => `${m.sender}: ${m.text || "[file]"}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation_${id}.txt`;
    a.click();
  };

  const clearHistory = () => {
      localStorage.removeItem("GUARDIAN_HISTORY");
      window.location.reload();
  }

  return (
    <UserContext.Provider
      value={{
        conversations,
        activeConversationId,
        setActiveConversation,
        newConversation,
        addMessage,
        downloadConversation,
        clearHistory
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
}