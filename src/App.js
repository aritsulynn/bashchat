import React from "react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const starterPrompt = ["น้ำส้มราคาเท่าไร", "ร้านเปิดกี่โมง", "ร้านอยู่ไหน"];

  const generateSessionId = () => {
    return "xxxx-xxxx-xxxx-xxxx".replace(/[x]/g, () =>
      ((Math.random() * 16) | 0).toString(16)
    );
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sessionId = localStorage.getItem("sessionId") || generateSessionId();

  if (!localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", sessionId);
  }

  const createMessage = (text, sender) => ({
    text,
    sender,
    timestamp: new Date().toLocaleTimeString(),
  });
  
  const fetchBotResponse = async (question, sessionId) => {
    try {
      const response = await fetch(
        "http://localhost:15542/api/v1/prediction/700dfedc-78ed-461b-88b6-6eb0a086c053",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            overrideConfig: { sessionId },
          }),
        }
      );
  
      if (!response.ok) throw new Error("Failed to fetch response");
      
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Sorry, I encountered an error. Please try again.");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!inputMessage.trim()) return;
  
    // Add user message
    const userMessage = createMessage(inputMessage, "user");
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
  
    try {
      const result = await fetchBotResponse(inputMessage, sessionId);
      const botMessage = createMessage(result.text, "bot");
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = createMessage(error.message, "bot");
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleReset = () => {
    setMessages([]);
    setInputMessage("");
    localStorage.removeItem("sessionId");
  };

  const MarkdownComponents = {
    p: ({ children }) => <p className="mb-2">{children}</p>,
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-bold mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-bold mb-2">{children}</h3>
    ),
    ul: ({ children }) => <ul className="list-disc ml-4 mb-4">{children}</ul>,
    ol: ({ children }) => (
      <ol className="list-decimal ml-4 mb-4">{children}</ol>
    ),
    li: ({ children }) => <li className="mb-1">{children}</li>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 my-4">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm">
        {children}
      </code>
    ),
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-100">
      <div className="bg-white shadow-sm flex items-center">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">BashAI</h1>
        </div>
        <div className="ml-auto px-6 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4 max-w-6xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-xl">👋 Welcome to the Bash Coffee!</p>
              <p className="mt-2">Start a conversation by sending a message.</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-2xl px-6 py-3 max-w-[80%] ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 shadow-sm"
                }`}
              >
                {message.sender === "bot" ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown components={MarkdownComponents}>
                      {message.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-base leading-relaxed">{message.text}</p>
                )}
                <span
                  className={`text-xs block mt-1 ${
                    message.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-6 py-3 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {messages.length === 0 && (
        <div className="flex-none">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="text-sm text-gray-500">
              <div className="list-disc ml-4 mt-2 flex gap-4">
                {starterPrompt.map((prompt, index) => (
                  <button
                    key={index}
                    className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
                    onClick={(e) => {
                      setInputMessage(prompt);
                      handleSubmit(e);
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white border-t flex-none">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-xl border border-gray-300 px-6 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
