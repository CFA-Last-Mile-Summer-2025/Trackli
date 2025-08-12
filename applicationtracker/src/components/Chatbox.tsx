import React, { useState } from "react";

const ResumeChat: React.FC = () => {
  const [message, setMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const backendURL = "http://localhost:3002/ai/resume-chat";

const handleSend = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const body = JSON.stringify(
        { useSavedResume: false, message }
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s

    const res = await fetch(backendURL, {
      method: "POST",
      headers: myHeaders,
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await res.json();
    setAiResponse(data.reply || data.error || "No response");
  } catch (error) {
    console.error("AI chat error:", error);
    setAiResponse("No response (timeout or error).");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="max-w-xl mx-auto mt-6 mb-10 p-4 border border-white/30 rounded-xl bg-white/10 backdrop-blur-xl shadow-xl">
      {(
        <textarea
          className="w-full p-2 border rounded mb-2"
          rows={4}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      )}
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center space-x-2">
        </label>
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
      <div className="whitespace-pre-wrap bg-gray-100 p-3 rounded">
        <p>AI Response:</p>
        {aiResponse}
      </div>
    </div>
  );
};

export default ResumeChat;
