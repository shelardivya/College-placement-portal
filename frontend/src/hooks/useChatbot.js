// src/hooks/useChatbot.js

import { useState, useCallback } from "react";
import { sendMessageToGemini } from "../api/geminiApi";

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

  // true while waiting for Gemini response
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
      // call Gemini with full history
      const reply = await sendMessageToGemini(updatedMessages);

      // append bot reply
      setMessages(prev => [...prev, { role: "model", text: reply, timestamp: getFormattedTime() }]);
    } catch (error) {
      // show error in chat
      setMessages(prev => [...prev, {
        role: "model",
        text: "⚠️ Sorry, I couldn't connect. Please try again.",
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
