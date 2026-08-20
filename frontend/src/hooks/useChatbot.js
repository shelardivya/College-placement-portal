// src/hooks/useChatbot.js

import { useState, useCallback, useEffect } from "react";
import { sendChatMessage } from "../api/chatApi";

const STORAGE_KEY = "placement_assistant_chat_history";
const LANG_STORAGE_KEY = "placement_assistant_language";

export const LANGUAGE_OPTIONS = [
  { code: "en", label: "🇬🇧 English", fullLabel: "English 🇬🇧" },
  { code: "hi", label: "🇮🇳 हिंदी", fullLabel: "हिंदी (Hindi) 🇮🇳" },
  { code: "mr", label: "🇮🇳 मराठी", fullLabel: "मराठी (Marathi) 🇮🇳" }
];

export const CHAT_TRANSLATIONS = {
  en: {
    title: "Placement Assistant",
    online: "Online",
    typing: "Typing…",
    placeholder: "Ask about placements...",
    clearTitle: "Clear conversation",
    retry: "🔄 Retry",
    defaultGreeting: "👋 Hi! I'm your Placement Assistant. Ask me anything about placements!",
    suggestions: [
      "What companies are visiting?",
      "Eligibility criteria?",
      "Resume tips"
    ],
    outOfScope: "Sorry, I can only answer questions related to the CampusHire College Placement Portal.",
    errorMsg: "⚠️ Sorry, I couldn't connect to the placement assistant.",
    error403: "⚠️ Access denied (403). Please make sure you are logged in to chat."
  },
  hi: {
    title: "प्लेसमेंट सहायक",
    online: "ऑनलाइन",
    typing: "टाइप कर रहा है…",
    placeholder: "प्लेसमेंट के बारे में पूछें...",
    clearTitle: "बातचीत साफ करें",
    retry: "🔄 पुनः प्रयास करें",
    defaultGreeting: "👋 नमस्ते! मैं आपका प्लेसमेंट सहायक हूँ। प्लेसमेंट से जुड़ा कुछ भी पूछें!",
    suggestions: [
      "कौन सी कंपनियां आ रही हैं?",
      "पात्रता मानदंड क्या हैं?",
      "रेज्यूमे टिप्स"
    ],
    outOfScope: "क्षमा करें, मैं केवल CampusHire कॉलेज प्लेसमेंट पोर्टल से संबंधित प्रश्नों के उत्तर दे सकता हूँ।",
    errorMsg: "⚠️ क्षमा करें, मैं प्लेसमेंट सहायक से कनेक्ट नहीं हो सका।",
    error403: "⚠️ पहुंच अस्वीकृत (403)। कृपया चैट करने के लिए लॉगिन करें।"
  },
  mr: {
    title: "प्लेसमेंट सहाय्यक",
    online: "ऑनलाइन",
    typing: "टाइप करत आहे…",
    placeholder: "प्लेसमेंटबद्दल विचारा...",
    clearTitle: "संभाषण साफ करा",
    retry: "🔄 पुन्हा प्रयत्न करा",
    defaultGreeting: "👋 नमस्कार! मी तुमचा प्लेसमेंट सहाय्यक आहे. प्लेसमेंटबद्दल काहीही विचारा!",
    suggestions: [
      "कोणत्या कंपन्या येत आहेत?",
      "पात्रता निकष काय आहेत?",
      "रेझ्युमे टिप्स"
    ],
    outOfScope: "माफ करा, मी फक्त CampusHire कॉलेज placement पोर्टलशी संबंधित प्रश्नांची उत्तरे देऊ शकतो.",
    errorMsg: "⚠️ माफ करा, मी प्लेसमेंट सहाय्यकाशी कनेक्ट होऊ शकलो नाही.",
    error403: "⚠️ प्रवेश नाकारला (403). कृपया चॅट करण्यासाठी लॉग इन करा."
  }
};

const getFormattedTime = () => {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
};

// Reads initial messages from localStorage if present
const getInitialMessages = (currentLang = "en") => {
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
  const greetingText = CHAT_TRANSLATIONS[currentLang]?.defaultGreeting || CHAT_TRANSLATIONS.en.defaultGreeting;
  return [
    {
      role: "model",
      text: greetingText,
      timestamp: getFormattedTime()
    }
  ];
};

export function useChatbot() {
  // language state — persisted in localStorage ('en', 'hi', 'mr')
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem(LANG_STORAGE_KEY) || "en";
    } catch {
      return "en";
    }
  });

  // messages array — persisted in localStorage
  const [messages, setMessages] = useState(() => getInitialMessages(language));

  // true while waiting for AI chatbot response
  const [isLoading, setIsLoading] = useState(false);

  // Sync language state to localStorage and update initial greeting if it's the only message
  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch (e) {
      console.error("Failed to save language to localStorage:", e);
    }

    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === "model") {
        const newGreeting = CHAT_TRANSLATIONS[newLang]?.defaultGreeting || CHAT_TRANSLATIONS.en.defaultGreeting;
        return [{ ...prev[0], text: newGreeting }];
      }
      return prev;
    });
  };

  // Current active translations
  const t = CHAT_TRANSLATIONS[language] || CHAT_TRANSLATIONS.en;

  // Sync messages state to localStorage whenever messages update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat history to localStorage:", e);
    }
  }, [messages]);

  // Format question payload with explicit AI prompt instruction for language enforcement
  const formatApiPrompt = (userText, lang) => {
    if (lang === "hi") {
      return `${userText}\n\n(IMPORTANT SYSTEM INSTRUCTION: Respond ONLY in Hindi / हिंदी language.)`;
    }
    if (lang === "mr") {
      return `${userText}\n\n(IMPORTANT SYSTEM INSTRUCTION: Respond ONLY in Marathi / मराठी language.)`;
    }
    return userText;
  };

  // Process and translate backend responses (including out-of-scope guardrails) if necessary
  const processBackendReply = (reply, lang) => {
    if (!reply || typeof reply !== "string") return reply;

    const lower = reply.toLowerCase();
    const isOutOfScope = lower.includes("sorry, i can only answer questions related") || 
                         lower.includes("only answer questions related to the campushire");

    if (isOutOfScope) {
      return CHAT_TRANSLATIONS[lang]?.outOfScope || reply;
    }

    return reply;
  };

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
      const apiPrompt = formatApiPrompt(userText, language);
      const rawReply = await sendChatMessage(apiPrompt);
      const finalReply = processBackendReply(rawReply, language);

      // append bot reply
      setMessages(prev => [...prev, { role: "model", text: finalReply, timestamp: getFormattedTime() }]);
    } catch (error) {
      console.error("Chatbot backend error:", error);
      const is403 = error?.response?.status === 403;
      const errorText = is403 ? t.error403 : t.errorMsg;

      setMessages(prev => [...prev, {
        role: "model",
        text: errorText,
        isError: true,
        lastQuestion: userText,
        timestamp: getFormattedTime()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, language, t]);

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
      const apiPrompt = formatApiPrompt(questionToRetry, language);
      const rawReply = await sendChatMessage(questionToRetry);
      const finalReply = processBackendReply(rawReply, language);
      setMessages(prev => [...prev, { role: "model", text: finalReply, timestamp: getFormattedTime() }]);
    } catch (error) {
      console.error("Retry failed:", error);
      const is403 = error?.response?.status === 403;
      const errorText = is403 ? t.error403 : t.errorMsg;

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
  }, [messages, isLoading, language, t]);

  // resets conversation to the initial greeting in the current language
  const clearChat = () => {
    const defaultGreeting = [
      {
        role: "model",
        text: t.defaultGreeting,
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

  return {
    messages,
    isLoading,
    language,
    changeLanguage,
    t,
    sendMessage,
    retryMessage,
    clearChat
  };
}
