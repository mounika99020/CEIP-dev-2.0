import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Trash2,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DEMO_AI_SUGGESTIONS } from '../data/demoData';
import { sendChatMessage, ChatMessage } from '../lib/api';

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      role: 'assistant',
      content: `Hello! I am the **CEIP Intelligence Assistant**. 

I synthesize real-time customer experience signals, sentiment trends, churn predictions, and prescriptive retention playbooks across your **24,850 monitored accounts**.

How can I assist your customer success or analytics team today?`,
      timestamp: 'Just now',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const responseContent = await sendChatMessage(text);
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearConversation = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'Conversation cleared. How can I assist your customer experience analysis?',
        timestamp: 'Just now',
      },
    ]);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Simple Markdown renderer for chat responses
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-200">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-sm sm:text-base font-bold text-white mt-2 mb-1">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
            return (
              <div key={idx} className="pl-2 flex items-start gap-2 text-slate-300">
                <span className="font-mono text-indigo-400 font-bold shrink-0">{line.slice(0, 3)}</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line.slice(3)) }} />
              </div>
            );
          }
          if (line.startsWith('- ')) {
            return (
              <div key={idx} className="pl-3 flex items-start gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line.slice(2)) }} />
              </div>
            );
          }
          if (line.trim() === '') {
            return <div key={idx} className="h-1" />;
          }
          return (
            <p
              key={idx}
              dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }}
            />
          );
        })}
      </div>
    );
  };

  const formatInlineMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-slate-300 italic">$1</em>');
  };

  return (
    <PageContainer>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1c2638] gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Conversational Intelligence
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            CEIP AI Assistant
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ask questions about customer experience, sentiment, churn and retention intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearConversation}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear Conversation
          </Button>
        </div>
      </div>

      {/* Suggested Questions Quick Access Bar */}
      <div>
        <span className="text-xs font-medium text-slate-400 block mb-2">
          Suggested Inquiries:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {DEMO_AI_SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(suggestion)}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#111726] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1f2a3f] transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Area */}
      <Card className="h-[600px] border-[#1c2638] bg-[#0d121c] flex flex-col p-0 overflow-hidden shadow-2xl">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((message) => {
            const isUser = message.role === 'user';

            return (
              <div
                key={message.id}
                className={`flex gap-3 max-w-4xl ${
                  isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-md mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`group relative rounded-2xl p-4 sm:p-5 max-w-[85%] sm:max-w-[78%] ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-xs shadow-md shadow-indigo-950/30'
                      : 'bg-[#141b2a] border border-[#24314c] rounded-bl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5 opacity-70">
                    <span className="font-medium">
                      {isUser ? 'User (CX Analyst)' : 'CEIP Intelligence Core'}
                    </span>
                    <span>{message.timestamp}</span>
                  </div>

                  {isUser ? (
                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  ) : (
                    renderFormattedContent(message.content)
                  )}

                  {!isUser && (
                    <button
                      onClick={() => handleCopyMessage(message.id, message.content)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-white transition-opacity cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === message.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200 shrink-0 mt-1">
                    U
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 mr-auto items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#141b2a] border border-[#24314c] rounded-bl-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#111726] border-t border-[#1f2a3f]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask questions about customer experience, churn, or retention playbooks..."
              className="flex-1 bg-[#0b0f17] border border-[#1f2a3f] rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!inputValue.trim() || isTyping}
              className="h-11 px-5"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>FastAPI Chatbot Endpoint connector ready: POST /api/assistant/chat</span>
            <span>CEIP Model v2.4</span>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};