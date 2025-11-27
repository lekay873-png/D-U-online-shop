import React from 'react';
import { Message, Role } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { User, Bot, AlertCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600' : message.isError ? 'bg-red-500' : 'bg-emerald-600'
        }`}>
          {isUser ? (
            <User size={16} className="text-white" />
          ) : message.isError ? (
            <AlertCircle size={16} className="text-white" />
          ) : (
            <Bot size={16} className="text-white" />
          )}
        </div>

        {/* Content Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-2xl ${
            isUser 
              ? 'bg-blue-600 text-white rounded-tr-sm' 
              : message.isError 
                ? 'bg-red-900/50 border border-red-700 text-red-200 rounded-tl-sm'
                : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'
          }`}>
            {message.image && (
              <div className="mb-3">
                <img 
                  src={message.image} 
                  alt="User uploaded" 
                  className="max-w-full h-auto max-h-64 rounded-lg border border-white/20"
                />
              </div>
            )}
            
            {message.text ? (
               <MarkdownRenderer content={message.text} />
            ) : (
               <span className="italic opacity-70">Зөвхөн зураг илгээлээ...</span>
            )}
          </div>
          
          <span className="text-xs text-slate-500 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};