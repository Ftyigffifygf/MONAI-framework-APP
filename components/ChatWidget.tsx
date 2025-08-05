
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { GUIDE_CONTEXT } from '../constants';
import { ChatIcon, CloseIcon, SendIcon, BotIcon, UserIcon } from './icons';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  useEffect(() => {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        setError("API_KEY is not configured. The chat assistant is disabled.");
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: GUIDE_CONTEXT,
        },
      });
      setMessages([
        { role: 'model', text: "Hello! I'm your MLOps assistant. Ask me anything about this MONAI deployment guide." },
      ]);
    } catch (e) {
        console.error("Error initializing GoogleGenAI:", e);
        setError("Failed to initialize the AI chat service. Please check the console for details.");
    }
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: currentInput });

      let modelResponse = '';
      for await (const chunk of stream) {
        modelResponse += chunk.text;
      }

      setMessages((prev) => [...prev, { role: 'model', text: modelResponse || "I don't have a response for that." }]);

    } catch (e) {
      console.error('Error sending message:', e);
      setMessages((prev) => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isModel = message.role === 'model';
    return (
      <div className={`flex items-start gap-3 my-4 ${isModel ? '' : 'justify-end'}`}>
        {isModel && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center"><BotIcon className="w-5 h-5 text-cyan-400" /></div>}
        <div className={`p-3 rounded-lg max-w-sm md:max-w-md ${isModel ? 'bg-gray-700 text-gray-200' : 'bg-cyan-600 text-white'}`}>
          <div className="prose prose-sm prose-invert max-w-none prose-p:my-0 prose-pre:my-2 prose-pre:bg-gray-800 prose-pre:p-2 prose-pre:rounded-md">
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        </div>
        {!isModel && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center"><UserIcon className="w-5 h-5 text-gray-200" /></div>}
      </div>
    );
  };


  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-cyan-500 text-white p-4 rounded-full shadow-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-transform hover:scale-110"
        aria-label="Toggle chat"
      >
        {isOpen ? <CloseIcon className="w-6 h-6" /> : <ChatIcon className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-md bg-gray-800/80 backdrop-blur-md rounded-lg shadow-2xl border border-gray-700 flex flex-col h-[70vh] max-h-[600px] z-20">
          <header className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">MLOps Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <CloseIcon className="w-6 h-6" />
            </button>
          </header>
          <div className="flex-1 p-4 overflow-y-auto">
            {error ? (
                 <div className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>
            ) : (
                <>
                    {messages.map((msg, index) => <ChatBubble key={index} message={msg} />)}
                    {isLoading && <ChatBubble message={{role: 'model', text: '...'}}/>}
                    <div ref={messagesEndRef} />
                </>
            )}
          </div>
          <div className="p-4 border-t border-gray-700">
             {error ? (
                <p className="text-center text-sm text-gray-500">Chat is disabled.</p>
             ) : (
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about the guide..."
                    className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                    disabled={isLoading}
                    />
                    <button type="submit" className="bg-cyan-500 text-white p-2 rounded-lg hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed" disabled={isLoading || !input.trim()}>
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
             )}
          </div>
        </div>
      )}
    </>
  );
};
