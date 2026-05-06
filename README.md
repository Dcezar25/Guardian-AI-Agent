# The Guardian - AI Assistant & Community Support

![The Guardian Banner](src/assets/header2.jpg)

## 📖 Overview
**The Guardian** is a modern, web-based platform designed to provide AI-assisted support, community engagement, and critical emergency tools. Built with React, Vite, and TailwindCSS, it offers a secure, responsive, and accessible environment for users to seek instant advice, remember their medications, and connect with a broader supportive community.

## ✨ Key Features
- 🤖 **AI Chat Assistant**: Get instant, personalized support and advice from an advanced AI.
- 🌍 **Community Chat**: Connect with other users in a real-time public chat room for shared experiences and peer support.
- 🚨 **Emergency Panic Button**: Instantly share your live GPS location via WhatsApp to a trusted emergency contact and log the alert securely on the backend.
- 💊 **Medication & Health Reminders**: Opt-in browser notifications to remind you to take medications or attend to health needs regularly.
- 🔒 **Flexible Authentication**: Create an account to save your chat history, or proceed seamlessly as a **Guest** for complete privacy (no history saved).
- 📥 **Download Transcripts**: Easily download your AI conversation history as a text file for your records.

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS, React Icons
- **Backend / API**: Node.js, Express, Twilio, Dotenv
- **Linting & Formatting**: ESLint

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+ recommended) and npm installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dcezar25/Guardian-AI-Agent.git
   cd Guardian-AI-Agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and configure your necessary environment variables (e.g., API keys, backend URL, Twilio credentials).

### Running the Application

**Start the Development Server (Frontend):**
```bash
npm run dev
```
The application will typically be available at `http://localhost:5173`.

**Start the Backend Server:**
Ensure your `server.js` or backend API is running on port 5000 (default configuration for the Panic Button API):
```bash
npm run start
```

**Build for Production:**
```bash
npm run build
npm run preview
```

## 📱 Usage Guide

- **Configuring Emergency Contact**: Click the **Settings (Gear)** icon on the sidebar and enter a trusted phone number (in WhatsApp format, e.g., `40722123456`).
- **Triggering the Panic Button**: Click the pulsing red **Alert** icon. The app will fetch your GPS location and automatically format a WhatsApp message containing a Google Maps link to your exact location, while simultaneously alerting the backend.
- **Enabling Health Reminders**: Click the **Pills** icon and toggle reminders ON. You must allow browser notifications when prompted.
- **Switching Views**: Use the Sidebar to switch seamlessly between the personal **AI Assistant** and the **Community Chat**.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
Feel free to check out the [issues page](https://github.com/Dcezar25/Guardian-AI-Agent/issues) if you want to contribute.

## 📝 License
This project is licensed under the **ISC** License.
