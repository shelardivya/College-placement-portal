// src/components/chatbot/ChatbotWidget.jsx

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatbot, LANGUAGE_OPTIONS } from "../../hooks/useChatbot";
import "./ChatbotWidget.css";
import roboIcon from "../../assets/robo icon.jpg";

// Robot avatar component using saved robo icon from assets
function RobotIcon({ size = 28 }) {
  return (
    <img
      src={roboIcon}
      alt="Robot Assistant"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        objectFit: "cover",
        objectPosition: "center 20%",
        display: "block"
      }}
    />
  );
}

// Custom animated language dropdown component
function LanguageDropdown({ language, changeLanguage }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentOption = LANGUAGE_OPTIONS.find(opt => opt.code === language) || LANGUAGE_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="chatbot-lang-container">
      <button
        type="button"
        className="chatbot-lang-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Select Language"
      >
        <span>{currentOption.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease"
          }}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-lang-menu"
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {LANGUAGE_OPTIONS.map((opt) => {
              const isSelected = opt.code === language;
              return (
                <button
                  key={opt.code}
                  type="button"
                  className={`chatbot-lang-option ${isSelected ? "chatbot-lang-option--selected" : ""}`}
                  onClick={() => {
                    changeLanguage(opt.code);
                    setIsOpen(false);
                  }}
                >
                  <span>{opt.fullLabel}</span>
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const { messages, isLoading, language, changeLanguage, t, sendMessage, retryMessage, clearChat } = useChatbot();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    sendMessage(inputText);
    setInputText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) handleSend();
  };

  // suggestion chips shown before first user message
  const suggestions = t.suggestions || ["What companies are visiting?", "Eligibility criteria?", "Resume tips"];
  const showSuggestions = messages.length === 1;

  return (
    <div className="chatbot-wrapper">

      {/* chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {/* header */}
            <div className="chatbot-header">
              <div className="chatbot-header__info">
                <div className="chatbot-header__avatar"><RobotIcon size={32} /></div>
                <div>
                  <div className="chatbot-header__title">{t.title}</div>
                  <div className="chatbot-header__status">
                    <span className={`chatbot-header__dot ${isLoading ? "chatbot-header__dot--typing" : "chatbot-header__dot--online"}`} />
                    <span className="chatbot-header__status-text">
                      {isLoading ? t.typing : t.online}
                    </span>
                  </div>
                </div>
              </div>
              <div className="chatbot-header__actions">
                {/* Custom Animated Language Dropdown */}
                <LanguageDropdown language={language} changeLanguage={changeLanguage} />

                <motion.button
                  className="chatbot-header__clear"
                  onClick={clearChat}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  title={t.clearTitle}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* messages */}
            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  className={`chatbot-message-row chatbot-message-row--${msg.role}`}
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {msg.role === "model" && (
                    <div className="chatbot-msg-avatar"><RobotIcon size={28} /></div>
                  )}
                  <div className={`chatbot-bubble chatbot-bubble--${msg.role} ${msg.isError ? 'chatbot-bubble--error' : ''}`}>
                    <div>{msg.text}</div>
                    {msg.isError && (
                      <button
                        type="button"
                        className="chatbot-retry-btn"
                        onClick={() => retryMessage(index)}
                        disabled={isLoading}
                      >
                        {t.retry}
                      </button>
                    )}
                    {msg.timestamp && (
                      <div className={`chatbot-bubble-time chatbot-bubble-time--${msg.role}`}>
                        {msg.timestamp}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* suggestion chips */}
              {showSuggestions && (
                <motion.div
                  className="chatbot-suggestions"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      className="chatbot-chip"
                      onClick={() => sendMessage(s)}
                    >{s}</button>
                  ))}
                </motion.div>
              )}

              {/* typing dots */}
              {isLoading && (
                <motion.div
                  className="chatbot-typing-row"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="chatbot-msg-avatar"><RobotIcon size={28} /></div>
                  <div className="chatbot-typing-bubble">
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        className="chatbot-typing-dot"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* input */}
            <div className="chatbot-input-area">
              <input
                ref={inputRef}
                type="text"
                className="chatbot-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.placeholder}
                disabled={isLoading}
              />
              <motion.button
                className={`chatbot-send-btn ${isLoading || !inputText.trim() ? "chatbot-send-btn--disabled" : "chatbot-send-btn--active"}`}
                onClick={handleSend}
                disabled={isLoading || !inputText.trim()}
                whileHover={!isLoading && inputText.trim() ? { scale: 1.05 } : {}}
                whileTap={!isLoading && inputText.trim() ? { scale: 0.95 } : {}}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                    stroke={isLoading || !inputText.trim() ? "#94A3B8" : "#ffffff"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* floating button + label */}
      <div className="chatbot-fab-wrapper">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              className="chatbot-chat-label"
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              Chat with pleo! 💬
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className={`chatbot-fab ${isOpen ? "chatbot-fab--open" : "chatbot-fab--closed"}`}
          onClick={() => setIsOpen(prev => !prev)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span
                key="close"
                className="chatbot-fab__icon"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </motion.span>
            ) : (
              <motion.span
                key="chat"
                className="chatbot-fab__icon"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              ><RobotIcon size={58} /></motion.span>
            )}
          </AnimatePresence>

          {/* pulse ring */}
          {!isOpen && (
            <motion.span
              className="chatbot-pulse-ring"
              animate={{ scale: [1, 1.55, 1.55], opacity: [0.5, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}
