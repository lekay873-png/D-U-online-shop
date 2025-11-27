import React, { useState, useRef, useEffect } from 'react';
import { Message, Role } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { MessageBubble } from './MessageBubble';
import { Send, Image as ImageIcon, X, Loader2, MessageCircle, Minimize2 } from 'lucide-react';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      text: 'Сайн байна уу? Би **"Монгол Шоп"**-ын ухаалаг туслах байна. \n\nТанд бараа сонгоход эсвэл захиалга хийхэд туслах уу?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isLoading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Зургийн хэмжээ 5MB-аас бага байх ёстой.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: input.trim(),
      image: selectedImage || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsLoading(true);

    try {
      const systemInstruction = `You are a helpful, polite, and knowledgeable sales assistant for an e-commerce website called "Mongol Shop" (Монгол Шоп). 
      The store sells clothes (Deel, Cashmere), electronics, household goods, and food in Mongolia. 
      Your goal is to help customers find products, explain features, and suggest items. 
      Answer in Mongolian language. 
      If the user uploads an image, analyze it and suggest similar products from a hypothetical inventory.
      Keep answers concise and friendly.`;

      const responseText = await sendMessageToGemini(
        newUserMessage.text, 
        newUserMessage.image,
        systemInstruction
      );
      
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: responseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: 'Уучлаарай, системд алдаа гарлаа.',
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-slate-900 border border-slate-700 w-[90vw] md:w-[400px] h-[500px] md:h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <h3 className="font-semibold text-sm">AI Туслах</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-900/95">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
               <div className="flex w-full mb-4 justify-start">
                 <div className="bg-slate-800 px-4 py-2 rounded-2xl rounded-tl-sm border border-slate-700 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-emerald-500" />
                    <span className="text-slate-400 text-xs">Хариулж байна...</span>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-slate-800 border-t border-slate-700">
             {selectedImage && (
              <div className="mb-2 relative inline-block">
                <img src={selectedImage} alt="Preview" className="h-12 w-auto rounded border border-slate-600" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-lg transition-colors ${selectedImage ? 'text-emerald-400' : 'text-slate-400 hover:bg-slate-700'}`}
              >
                <ImageIcon size={20} />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Асуулт асуух..."
                className="flex-1 bg-slate-700 text-white text-sm rounded-lg px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && !selectedImage)}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-slate-700' : 'bg-blue-600 hover:bg-blue-500'} text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
        {!isOpen && <span className="font-medium pr-1 hidden md:inline">Туслах</span>}
      </button>
    </div>
  );
};