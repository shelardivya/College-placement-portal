// src/hooks/useChatbot.js

import { useState, useCallback } from "react";
import { sendChatMessage } from "../api/chatApi";

const getFormattedTime = () => {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
};

export function useChatbot() {

  // messages array — each item: { role: "user" | "model", text, timestamp }
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "👋 Hi! I'm your Placement Assistant. Ask me anything about placements!",
      timestamp: getFormattedTime()
    }
  ]);

  // true while waiting for AI chatbot response
  const [isLoading, setIsLoading] = useState(false);

  // called by UI when user sends a message
  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim()) return; // ignore empty input

    const time = getFormattedTime();

    // build updated history with new user message
    const updatedMessages = [...messages, { role: "user", text: userText, timestamp: time }];

    // update UI immediately, start loading
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // call Spring Boot backend POST /api/ai/chat
      const reply = await sendChatMessage(userText);

      // append bot reply
      setMessages(prev => [...prev, { role: "model", text: reply, timestamp: getFormattedTime() }]);
    } catch (error) {
      console.error("Chatbot backend error:", error);
      const is403 = error?.response?.status === 403;
      const errorText = is403
        ? "⚠️ Access denied (403). Please make sure you are logged in to chat."
        : "⚠️ Sorry, I couldn't connect to the placement assistant. Please try again.";

      setMessages(prev => [...prev, {
        role: "model",
        text: errorText,
        timestamp: getFormattedTime()
      }]);
    } finally {
      // reset loading
      setIsLoading(false);
    }
  }, [messages]);

  // resets conversation to the initial greeting
  const clearChat = () => {
    setMessages([{
      role: "model",
      text: "👋 Hi! I'm your Placement Assistant. Ask me anything about placements!",
      timestamp: getFormattedTime()
    }]);
  };

  return { messages, isLoading, sendMessage, clearChat };
}

