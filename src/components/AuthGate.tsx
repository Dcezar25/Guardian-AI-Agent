import { useState, type FormEvent } from "react";

// Definim tipul User exact cum vine de la Backend
export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contact_person?: string;
};

type AuthGateProps = {
  onLogin: (user: User) => void;
};

type Mode = "login" | "signup";

export default function AuthGate({ onLogin }: AuthGateProps) {
  const [mode, setMode] = useState<Mode>("signup");
  const [loading, setLoading] = useState(false);

  // Câmpuri Sign up
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Câmpuri Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // --- LOGICA DE SIGN UP (Backend) ---
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !address || !phone || !email || !password) {
      alert("Te rog completează toate câmpurile obligatorii.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          address,
          phone,
          contactPerson,
          email,
          password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cont creat cu succes!");
        onLogin(data.user); // Primim userul cu ID din baza de date
      } else {
        alert(data.error || "Eroare la înregistrare.");
      }
    } catch (error) {
      console.error(error);
      alert("Eroare de conexiune cu serverul. Verifică dacă agent.py rulează.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGICA DE LOGIN (Backend) ---
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      alert("Introdu email și parolă.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user);
      } else {
        alert(data.error || "Date incorecte.");
      }
    } catch (error) {
      console.error(error);
      alert("Eroare server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1c2d] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-blue-600 rounded-2xl p-8 w-full max-w-md shadow-xl animate-fade-in">
        <h1 className="text-3xl font-extrabold text-blue-500 text-center mb-2 tracking-wider">
          THE GUARDIAN
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Platforma ta sigură de asistență socială.
        </p>

        {/* TAB-URI */}
        <div className="flex mb-6 border-b border-slate-700">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-3 text-center text-sm font-bold transition-colors ${
              mode === "login"
                ? "text-blue-400 border-b-2 border-blue-500"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            LOGIN
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-3 text-center text-sm font-bold transition-colors ${
              mode === "signup"
                ? "text-blue-400 border-b-2 border-blue-500"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            SIGN UP
          </button>
        </div>

        {/* --- FORMULAR LOGIN --- */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase font-bold">Email</label>
              <input
                type="email"
                className="w-full mt-1 p-3 rounded bg-slate-800 text-white border border-slate-700 focus:border-blue-500 outline-none transition"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="email@exemplu.com"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase font-bold">Parolă</label>
              <input
                type="password"
                className="w-full mt-1 p-3 rounded bg-slate-800 text-white border border-slate-700 focus:border-blue-500 outline-none transition"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-4 transition shadow-lg shadow-blue-900/20 disabled:opacity-50"
            >
              {loading ? "Se verifică..." : "INTRĂ ÎN CONT"}
            </button>
          </form>
        )}

        {/* --- FORMULAR SIGN UP --- */}
        {mode === "signup" && (
          <form onSubmit={handleSignup} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 font-bold">Nume</label>
                <input
                  className="w-full mt-1 p-2 rounded bg-slate-800 text-white border border-slate-700 focus:border-blue-500 outline-none"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Nume"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-bold">Prenume</label>
                <input
                  className="w-full mt-1 p-2 rounded bg-slate-800 text-white border border-slate-700 focus:border-blue-500 outline-none"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Prenume"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-bold">Adresă (Pt. Urgențe)</label>
              <input
                className="w-full mt-1 p-2 rounded bg-slate-800 text-white border border-slate-700 focus:border-blue-500 outline-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Strada, Număr, Oraș"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 font-bold">Telefon</label>
                <input
                  className="w-full mt-1 p-2 rounded bg-slate-800 text-white border border-slate-700 focus:border-blue-500 outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07xx..."
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-bold">Pers. Contact</label>
                <input
                  className="w-full mt-1 p-2 rounded bg-slate-800 text-white border border-slate-700 focus:border-blue-500 outline-none"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Mama/Tata"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-bold">Email</label>
              <input
                type="email"
                className="w-full mt-1 p-2 rounded bg-slate-800 text-white border border-slate-700 focus:border-blue-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplu.com"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 font-bold">Parolă</label>
              <input
                type="password"
                className="w-full mt-1 p-2 rounded bg-slate-800 text-white border border-slate-700 focus:border-blue-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minim 6 caractere"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-2 transition shadow-lg shadow-blue-900/20 disabled:opacity-50"
            >
              {loading ? "Se creează contul..." : "CREEAZĂ CONT"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}