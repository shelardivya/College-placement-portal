// src/hooks/useChatbot.js

import { useState, useCallback, useEffect } from "react";
import { sendChatMessage } from "../api/chatApi";

const STORAGE_KEY = "placement_assistant_chat_history";

const getFormattedTime = () => {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
};

// Reads initial messages from localStorage if present
const getInitialMessages = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse saved chat history:", e);
  }
  return [
    {
      role: "model",
      text: "👋 Hi! I'm your Placement Assistant. Ask me anything about placements!",
      timestamp: getFormattedTime()
    }
  ];
};

export function useChatbot() {

  // messages array — persisted in localStorage
  const [messages, setMessages] = useState(getInitialMessages);

  // true while waiting for AI chatbot response
  const [isLoading, setIsLoading] = useState(false);

  // Sync messages state to localStorage whenever messages update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat history to localStorage:", e);
    }
  }, [messages]);

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
        : "⚠️ Sorry, I couldn't connect to the placement assistant.";

      setMessages(prev => [...prev, {
        role: "model",
        text: errorText,
        isError: true,
        lastQuestion: userText,
        timestamp: getFormattedTime()
      }]);
    } finally {
      // reset loading
      setIsLoading(false);
    }
  }, [messages]);

  // retries sending a failed message
  const retryMessage = useCallback(async (index) => {
    if (isLoading) return;

    const errorMsg = messages[index];
    const questionToRetry = errorMsg?.lastQuestion || [...messages].slice(0, index).reverse().find(m => m.role === "user")?.text;

    if (!questionToRetry) return;

    // Remove the error message bubble
    setMessages(prev => prev.filter((_, i) => i !== index));
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(questionToRetry);
      setMessages(prev => [...prev, { role: "model", text: reply, timestamp: getFormattedTime() }]);
    } catch (error) {
      console.error("Retry failed:", error);
      const is403 = error?.response?.status === 403;
      const errorText = is403
        ? "⚠️ Access denied (403). Please make sure you are logged in to chat."
        : "⚠️ Sorry, I couldn't connect to the placement assistant.";

      setMessages(prev => [...prev, {
        role: "model",
        text: errorText,
        isError: true,
        lastQuestion: questionToRetry,
        timestamp: getFormattedTime()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  // resets conversation to the initial greeting and clears storage
  const clearChat = () => {
    const defaultGreeting = [
      {
        role: "model",
        text: "👋 Hi! I'm your Placement Assistant. Ask me anything about placements!",
        timestamp: getFormattedTime()
      }
    ];
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to remove chat history:", e);
    }
    setMessages(defaultGreeting);
  };

  return { messages, isLoading, sendMessage, retryMessage, clearChat };
}
