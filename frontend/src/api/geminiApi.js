// src/api/geminiApi.js

import axios from "axios";

// Gemini API endpoint with key from .env
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;

// system prompt — defines the bot's role and context
const SYSTEM_PROMPT = `You are a helpful assistant for a College Placement Portal. 
Answer questions about placement drives, eligibility criteria, visiting companies, 
application deadlines, and resume tips. Be concise, friendly, and student-focused.`;

// sends full message history to Gemini and returns reply text
export async function sendMessageToGemini(messageHistory) {
  const contents = [
    // inject system prompt as first turn
    { role: "user",  parts: [{ text: SYSTEM_PROMPT }] },
    { role: "model", parts: [{ text: "Understood! I am ready to help." }] },

    // real conversation history
    ...messageHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }))
  ];

  // call Gemini API
  const response = await axios.post(GEMINI_URL, { contents });

  // return reply text
  return response.data.candidates[0].content.parts[0].text;
}
