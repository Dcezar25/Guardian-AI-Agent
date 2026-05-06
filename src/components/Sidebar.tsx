import { useRef, useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import type { Conversation } from "../context/UserContext";
import {
  FiSearch,
  FiDownload,
  FiPlus,
  FiAlertCircle,
  FiX,
  FiSettings,
  FiGlobe,
  FiMessageSquare,
} from "react-icons/fi";
import { FaPills } from "react-icons/fa";
import { GiAngelWings } from "react-icons/gi";
import InfoBox from "./InfoBox";

interface SidebarProps {
  currentView: "ai" | "community";
  setView: (view: "ai" | "community") => void;
}

export default function Sidebar({ currentView, setView }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [showConversations, setShowConversations] = useState(false);
  const [panicOpen, setPanicOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // HEALTH VARIABLES
  const [healthOpen, setHealthOpen] = useState(false);
  const [healthEnabled, setHealthEnabled] = useState(false);
  const [healthInterval, setHealthInterval] = useState<number | null>(null);

  const [helperNumber, setHelperNumber] = useState<string>("");

  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    newConversation,
    downloadConversation,
  } = useUser();

  // Load Phone Number
  useEffect(() => {
    const saved = localStorage.getItem("HELPER_NUMBER");
    if (saved) setHelperNumber(saved);
  }, []);

  // Click Outside logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setShowConversations(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getConversationTitle = (conv: Conversation) => {
    const userMsg = conv.messages.find((m) => m.sender === "user" && m.text);
    if (!userMsg) return "Conversation";
    const words = userMsg.text!.split(" ");
    return words.slice(0, 3).join(" ") + (words.length > 3 ? "..." : "");
  };

  const saveHelperNumber = () => {
    if (!helperNumber) return alert("Please enter a valid number!");
    localStorage.setItem("HELPER_NUMBER", helperNumber);
    setSettingsOpen(false);
    alert("Number saved successfully!");
  };

  const sendLocationToHelper = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const mapLink = `http://googleusercontent.com/maps.google.com/?q=${latitude},${longitude}`;

        if (helperNumber) {
          const message = `🚨 ALERT!\nI need help!\nMy location:\n${mapLink}`;
          const whatsappLink = `https://wa.me/${helperNumber}?text=${encodeURIComponent(message)}`;
          window.open(whatsappLink, "_blank");
        } else {
          alert("No contact number set! Sending email to authorities only.");
        }

        try {
          await fetch("http://127.0.0.1:5000/api/panic", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat: latitude, long: longitude })
          });
        } catch (e) {
          console.error("Server alert failed:", e);
        }

        setPanicOpen(false);
      },
      () => alert("Could not retrieve location!")
    );
  };

  const toggleHealthReminder = async () => {
    if (!("Notification" in window)) {
      alert("Notifications not supported in this browser.");
      return;
    }
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;
    }

    if (!healthEnabled) {
      const interval = window.setInterval(() => {
        new Notification("💊 Medication Reminder", {
          body: "It is time to take your medication. Stay healthy!",
        });
      }, 60000); 
      setHealthInterval(interval);
      setHealthEnabled(true);
    } else {
      if (healthInterval) clearInterval(healthInterval);
      setHealthInterval(null);
      setHealthEnabled(false);
    }
  };

  return (
    // MAIN CONTAINER - RELATIVE pentru poziționarea overlay-urilor
    <div
      ref={sidebarRef}
      className={`relative bg-gray-900 text-white border-r-2 border-blue-600 transition-all duration-300 h-full flex flex-col items-center w-24`}
    >
      {/* SCROLLABLE AREA - Aici stau butoanele. 
         Folosim 'no-scrollbar' (clasa custom sau CSS standard) pentru aspect curat
         și 'overflow-y-auto' ca să putem da scroll pe laptopuri mici.
      */}
      <div className="flex-1 w-full flex flex-col items-center py-4 overflow-y-auto scrollbar-hide">
        
        {/* --- LOGO --- */}
        <GiAngelWings size={36} className="text-blue-400 mb-6 flex-shrink-0" />

        {/* --- TOP TOOLS --- */}
        <div className="flex flex-col gap-4 mb-6 w-full items-center">
            <button
                className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition shadow-lg"
                onClick={() => setSettingsOpen(true)}
                title="Settings"
            >
                <FiSettings size={20} />
            </button>

            <button
                className="p-3 bg-red-600 rounded-full hover:bg-red-700 animate-pulse transition shadow-red-900/50 shadow-lg"
                onClick={() => setPanicOpen(true)}
                title="PANIC BUTTON"
            >
                <FiAlertCircle size={24} />
            </button>

            <button
                className={`p-3 rounded-full transition shadow-lg ${healthEnabled ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-700 hover:bg-gray-600"}`}
                onClick={() => setHealthOpen(true)}
                title="Health Reminders"
            >
                <FaPills size={20} />
            </button>
        </div>

        <hr className="w-10 border-gray-700 mb-6 flex-shrink-0" />

        {/* --- NAVIGATION --- */}
        <div className="flex flex-col gap-4 mb-6 w-full items-center">
            <button
                className={`p-3 rounded-xl transition w-12 h-12 flex items-center justify-center ${currentView === 'ai' ? 'bg-blue-500 text-white shadow-blue-500/50 shadow-lg' : 'hover:bg-gray-800 text-gray-400'}`}
                onClick={() => setView('ai')}
                title="AI Assistant"
            >
                <FiMessageSquare size={24} />
            </button>

            <button
                className={`p-3 rounded-xl transition w-12 h-12 flex items-center justify-center ${currentView === 'community' ? 'bg-green-600 text-white shadow-green-600/50 shadow-lg' : 'hover:bg-gray-800 text-gray-400'}`}
                onClick={() => setView('community')}
                title="Community Chat"
            >
                <FiGlobe size={24} />
            </button>
        </div>

        <hr className="w-10 border-gray-700 mb-6 flex-shrink-0" />

        {/* --- ACTIONS --- */}
        <div className="flex flex-col gap-4 w-full items-center mb-auto">
            <button
                className="p-2 rounded hover:text-blue-400 transition transform hover:scale-110"
                onClick={() => {
                    newConversation();
                    setView('ai');
                }}
                title="New Chat"
            >
                <FiPlus size={28} />
            </button>

            <InfoBox />
        </div>

        {/* --- BOTTOM BUTTONS (Pushed down but accessible via scroll) --- */}
        <div className="flex flex-col gap-4 mt-6 w-full items-center pb-2">
            <button
                className="hover:text-blue-400 transition"
                onClick={() => downloadConversation(activeConversationId)}
                title="Download Transcript"
            >
                <FiDownload size={24} />
            </button>

            <button
                className={`hover:text-blue-400 transition p-2 rounded ${showConversations ? "text-blue-400 bg-gray-800" : ""}`}
                onClick={() => setShowConversations(!showConversations)}
                title="History"
            >
                <FiSearch size={24} />
            </button>
        </div>
      </div>

      {/* --- OVERLAYS (Outside scroll area) --- 
          Acestea sunt poziționate absolut față de div-ul principal,
          deci nu vor fi tăiate de scroll-ul intern.
      */}

      {/* HISTORY SIDEBAR */}
      {showConversations && (
        <div className="absolute left-full top-0 bottom-0 w-64 bg-gray-800 border-r border-blue-600 z-50 p-4 overflow-y-auto shadow-2xl">
          <h3 className="text-gray-400 text-sm font-bold mb-4 uppercase tracking-wider">History</h3>
          {conversations.map((conv: Conversation) => (
            <div
              key={conv.id}
              className={`p-3 mb-2 rounded-lg cursor-pointer transition border border-transparent ${
                conv.id === activeConversationId ? "bg-blue-600 text-white border-blue-400" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => {
                  setActiveConversation(conv.id);
                  setView('ai');
                  // setShowConversations(false); // Optional: închide meniul la click
              }}
            >
              <div className="truncate text-sm font-medium">
                {getConversationTitle(conv)}
              </div>
              <div className="text-xs opacity-70 mt-1">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS (Health, Settings, Panic) */}
      {healthOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white text-black p-6 rounded-2xl w-80 relative text-center shadow-2xl">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-black" onClick={() => setHealthOpen(false)}>
              <FiX size={20} />
            </button>
            <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaPills size={30} className="text-purple-600"/>
            </div>
            <h2 className="text-xl font-bold mb-2">Medication Reminder</h2>
            <p className="text-sm text-gray-500 mb-6">Receive notifications every minute to take your meds.</p>
            <div
              className={`w-16 h-8 mx-auto flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                healthEnabled ? "bg-green-500" : "bg-gray-300"
              }`}
              onClick={toggleHealthReminder}
            >
              <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${healthEnabled ? "translate-x-8" : ""}`} />
            </div>
            <p className="mt-3 text-xs font-bold text-gray-400">{healthEnabled ? "ON" : "OFF"}</p>
          </div>
        </div>
      )}

      {settingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white text-black p-6 rounded-2xl w-80 relative text-center shadow-xl">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-black" onClick={() => setSettingsOpen(false)}>
              <FiX size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Emergency Contact</h2>
            <p className="text-xs text-gray-500 mb-4">Enter a trusted phone number (WhatsApp format).</p>
            <input
              type="text"
              value={helperNumber}
              onChange={(e) => setHelperNumber(e.target.value)}
              placeholder="e.g. 40722123456"
              className="w-full border-2 border-gray-200 p-2 rounded-lg mb-4 text-center focus:border-blue-500 outline-none"
            />
            <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold" onClick={saveHelperNumber}>
              SAVE
            </button>
          </div>
        </div>
      )}

      {panicOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white text-black p-6 rounded-2xl w-80 relative text-center shadow-2xl border-4 border-red-600">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-black" onClick={() => setPanicOpen(false)}>
              <FiX size={20} />
            </button>
            <div className="bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <FiAlertCircle size={30} className="text-red-600"/>
            </div>
            <h2 className="text-2xl font-black text-red-600 mb-2">EMERGENCY</h2>
            <p className="text-sm text-gray-600 mb-6">
                This will send your <strong>GPS Location</strong> to your contact via WhatsApp AND log it to the secure server.
            </p>
            <button className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-lg shadow-lg transform hover:scale-105 transition" onClick={sendLocationToHelper}>
              SEND HELP NOW
            </button>
          </div>
        </div>
      )}
    </div>
  );
}