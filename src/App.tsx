import { useState } from "react";
import Header from "./components/Header";
import ChatInput from "./components/ChatInput";
import Sidebar from "./components/Sidebar";
import { UserProvider } from "./context/UserContext";
import ChatMessages from "./components/ChatMessages";
import PublicChat from "./components/PublicChat";
import AuthGate, { type User } from "./components/AuthGate";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<"ai" | "community">("ai");
  const [isGuest, setIsGuest] = useState(false); // ✅ Stare nouă pentru Vizitator

  // Dacă nu e logat și nici nu a ales Guest, arată AuthGate
  if (!currentUser && !isGuest) {
    return (
      <div className="relative">
        <AuthGate onLogin={(user) => setCurrentUser(user)} />
        
        {/* BUTON DE GUEST MODE */}
        <button 
          onClick={() => setIsGuest(true)}
          className="fixed bottom-4 right-4 text-gray-400 hover:text-white text-xs underline z-50 transition hover:scale-105"
        >
          Sau continuă ca Vizitator (Fără salvare istoric)
        </button>
      </div>
    );
  }

  // Numele pentru chat: Ori Userul real, ori "Vizitator_123"
  const displayName = currentUser ? currentUser.name : "Vizitator_" + Math.floor(Math.random() * 100);

  return (
    <UserProvider>
      <div className="flex flex-col h-screen bg-[#0b1c2d]">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar currentView={view} setView={setView} />

          <div className="flex-1 flex flex-col">
            {view === "ai" ? (
              <>
                <div className="flex-1 overflow-y-auto">
                  <ChatMessages />
                </div>
                {/* Trimitem currentUser (care poate fi null) la ChatInput */}
                <ChatInput currentUser={currentUser} />
              </>
            ) : (
              <PublicChat username={displayName} />
            )}
          </div>
        </div>
      </div>
    </UserProvider>
  );
}