'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { useToast } from '@/components/ui/toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Send,
  MessageCircle,
  Crown,
  AlertCircle,
  Sparkles,
  Bot,
  User,
  Loader2,
  Clock,
  Lightbulb,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  updatedAt: string;
  createdAt: string;
  messageCount: number;
  lastMessage: string;
  title?: string;
}

export default function ChatPage() {
  const router = useRouter();
  const { user, isPremium, checkChatLimit } = useAuth();
  const { tr, lang } = useLang();
  const { error: toastError } = useToast();
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [chatLimit, setChatLimit] = React.useState<{ allowed: boolean; remaining: number; limit: number; used: number; hoursRemaining?: number; minutesRemaining?: number } | null>(null);
  const [conversationHistory, setConversationHistory] = React.useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = React.useState<string | null>(null);
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [menuOpenId, setMenuOpenId] = React.useState<string | null>(null);
  const [editingConvId, setEditingConvId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  // Track if user explicitly started a new conversation to prevent auto-reload
  const skipAutoLoadRef = React.useRef(false);

  const SUGGESTED_QUESTIONS = [
    { icon: '🍎', question: tr('chat_suggest_1') },
    { icon: '💪', question: tr('chat_suggest_2') },
    { icon: '🥗', question: tr('chat_suggest_3') },
    { icon: '💧', question: tr('chat_suggest_4') },
    { icon: '🏋️', question: tr('chat_suggest_5') },
    { icon: '😴', question: tr('chat_suggest_6') },
  ];

  React.useEffect(() => {
    loadConversations();
    loadChatLimit();
  }, []);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatLimit = async () => {
    try {
      const limit = await checkChatLimit();
      setChatLimit(limit);
    } catch (error) {
      console.error('Error loading chat limit:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/chat/conversations?action=list', { credentials: 'include' });
      if (response.status === 401) return; // Session expired, silently ignore
      if (response.ok) {
        const data = await response.json();
        const convs = data.conversations || [];
        setConversations(convs);

        // Auto-load most recent conversation if none active and we have valid conversations
        const validConvs = convs.filter((c: Conversation) => c.id && c.id !== 'null' && c.id !== 'undefined');
        if (validConvs.length > 0) {
          // Skip auto-load if user explicitly started a new conversation
          if (!skipAutoLoadRef.current && !activeConversationId && messages.length === 0) {
            await loadConversation(validConvs[0].id);
          }
        }
      }
    } catch (error) {
      console.error('[CHAT] Error loading conversations:', error);
    }
  };

  const loadConversation = async (convId: string) => {
    skipAutoLoadRef.current = false;
    try {
      const response = await fetch(`/api/chat/conversations?action=load&conversationId=${convId}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        console.log('[CHAT] Loaded messages for conversation:', convId, '- count:', data.messages?.length);
        const loadedMessages = (data.messages || []).map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp instanceof Date ? m.timestamp : new Date(m.timestamp),
        }));
        setMessages(loadedMessages);
        setActiveConversationId(convId);
        // CRITICAL: Rebuild conversationHistory from DB messages so AI has context after page refresh
        setConversationHistory(loadedMessages.map((m: ChatMessage) => ({ role: m.role, content: m.content })));
        setMenuOpenId(null);
      } else {
        console.error('[CHAT] Failed to load messages, status:', response.status);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const startNewConversation = () => {
    skipAutoLoadRef.current = true;
    setMessages([]);
    setActiveConversationId(null);
    setConversationHistory([]);
    setInput('');
    // Refresh sidebar list without auto-loading
    loadConversations();
  };

  const deleteConversation = async (convId: string) => {
    if (!confirm(tr('food_delete_confirm'))) return;
    skipAutoLoadRef.current = false;
    try {
      const response = await fetch(`/api/chat/conversations?action=delete&conversationId=${convId}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        if (activeConversationId === convId) startNewConversation();
        loadConversations();
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const startRename = (conv: Conversation) => {
    setEditingConvId(conv.id);
    setEditTitle(conv.title || conv.lastMessage || 'Conversación');
    setMenuOpenId(null);
  };

  const saveRename = async () => {
    if (!editingConvId || !editTitle.trim()) { setEditingConvId(null); return; }
    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ conversationId: editingConvId, title: editTitle.trim() }),
      });
      if (response.ok) {
        setEditingConvId(null);
        setEditTitle('');
        loadConversations();
      }
    } catch (error) {
      console.error('Error renaming conversation:', error);
    }
  };

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || input;
    if (!content.trim() || isLoading) return;
    setIsLoading(true);
    const userMessage = content.trim();
    setInput('');

    setMessages((prev) => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          message: userMessage,
          conversationHistory: conversationHistory.slice(-10),
          conversationId: activeConversationId,
        }),
      });

      if (response.status === 429) {
        const data = await response.json();
        setMessages((prev) => [...prev, { role: 'assistant', content: `⚠️ ${data.message || data.error}`, timestamp: new Date() }]);
        setChatLimit({ allowed: false, remaining: data.remaining, limit: data.limit, used: data.used, hoursRemaining: data.hoursRemaining, minutesRemaining: data.minutesRemaining });
        return;
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('[CHAT UI] Server error:', response.status, JSON.stringify(errData));

        // Handle 401 - session expired
        if (response.status === 401) {
          toastError(lang === 'es'
            ? 'Sesión expirada. Redirigiendo al login...'
            : 'Session expired. Redirecting to login...');
          router.push('/login?redirect=/chat');
          return;
        }

        throw new Error(errData.message || errData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message, timestamp: new Date() }]);
      if (data.conversation) setConversationHistory(data.conversation);
      if (data.conversationId) {
        setActiveConversationId(data.conversationId);
        loadConversations();
      }
      if (data.usage) setChatLimit({ allowed: data.usage.remaining > 0, remaining: data.usage.remaining, limit: data.usage.limit, used: data.usage.used });
    } catch (error) {
      console.error('[CHAT UI] Error:', error);
      let errorMessage = `❌ ${tr('chat_error_message') || 'Error processing message'}`;
      if (error && typeof error === 'object' && 'message' in error) {
        const msg = error.message as string;
        if (msg.includes('cuota') || msg.includes('quota')) errorMessage = `⚠️ ${tr('chat_limit_warning')}`;
        else if (msg.includes('API de IA')) errorMessage = `🔧 ${tr('chat_api_error') || 'IA API not configured'}`;
        else if (msg.includes('Error interno') || msg.includes('Error procesando')) {
          errorMessage = `❌ ${tr('chat_error_message') || 'Error al enviar mensaje'}`;
          // Show visible toast for server errors
          toastError(lang === 'es'
            ? 'Error al guardar el mensaje. Intenta de nuevo.'
            : 'Failed to save message. Please try again.');
        }
        else errorMessage = `❌ ${msg}`;
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMessage, timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return tr('dash_today');
    if (diff < 3600) return `${tr('common_back')} ${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${tr('common_back')} ${Math.floor(diff / 3600)}h`;
    return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] gap-4 transition-colors duration-300">
        {/* Sidebar - hidden on mobile by default */}
        {showSidebar && (
          <Card className="w-full md:w-72 flex-shrink-0 flex flex-col border-slate-200 dark:border-slate-800 shadow-md dark:bg-slate-900 max-h-[40vh] md:max-h-full">
            <CardHeader className="pb-3 pt-4 px-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{tr('chat_conversations') || (lang === 'en' ? 'History' : 'Historial')}</CardTitle>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-900/30" onClick={startNewConversation}><Plus className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setShowSidebar(false)}><PanelLeftClose className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto px-2 pb-3 custom-scrollbar">
              {conversations.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-8">{tr('dash_no_weekly_data')}</p>
              ) : (
                <div className="space-y-1">
                  {conversations
                    .filter(c => c.id && c.id.trim() !== '')
                    .map((conv, i) => (
                    <div
                      key={`conv-${i}-${conv.id}`}
                      className={`group flex items-start gap-2 p-3 rounded-xl cursor-pointer transition-all relative ${activeConversationId === conv.id ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'}`}
                      onClick={() => loadConversation(conv.id)}
                    >
                      <MessageCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${activeConversationId === conv.id ? 'text-purple-600' : 'text-slate-400'}`} />
                      <div className="flex-1 min-w-0">
                        {editingConvId === conv.id ? (
                          <div onClick={(e) => e.stopPropagation()}>
                            <input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') setEditingConvId(null); }}
                              onBlur={saveRename}
                              autoFocus
                              className="w-full text-xs font-semibold bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-800 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:text-slate-100"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{conv.title || conv.lastMessage || tr('common_confirm')}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{formatTimeAgo(conv.updatedAt)}{conv.messageCount ? ` · ${conv.messageCount} msgs` : ''}</p>
                          </>
                        )}
                      </div>
                      <div className="relative flex-shrink-0">
                        <button type="button" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setMenuOpenId((menuOpenId === conv.id && conv.id) ? null : conv.id); }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all">
                          <MoreHorizontal className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                        </button>
                        {menuOpenId === conv.id && (
                          <div data-menu="conv-menu" className="absolute right-0 top-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 w-36 z-50">
                            <button onClick={(e) => { e.stopPropagation(); startRename(conv); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 dark:text-slate-300">✏️ {tr('common_confirm')}</button>
                            <button onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 flex items-center gap-2">🗑️ {tr('common_delete')}</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {!showSidebar && (
            <Button size="sm" variant="ghost" className="self-start mb-2 dark:text-slate-400" onClick={() => setShowSidebar(true)}>
              <PanelLeftOpen className="h-4 w-4 mr-1" /> {tr('all_items')}
            </Button>
          )}
          <div className="max-w-4xl mx-auto w-full space-y-4 pb-24">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none flex items-center gap-4">
                  <Sparkles className="h-10 w-10 text-purple-600 dark:text-purple-500 drop-shadow-[0_0_10px_rgba(147,51,234,0.3)]" /> NutriFlow IA
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mt-1">{tr('chat_welcome_subtitle')}</p>
              </div>
              <div className="text-right">
                {!isPremium && chatLimit && (
                  <><div className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-purple-600 dark:text-purple-500">{chatLimit.remaining} <span className="text-lg text-purple-600/50 dark:text-purple-500/50 font-bold">/ {chatLimit.limit}</span></div><div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase">{tr('chat_limit_title')}</div></>
                )}
                {isPremium && (
                  <><div className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-emerald-600 dark:text-emerald-500">∞</div><div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase">{tr('chat_limit_unlimited')}</div></>
                )}
              </div>
            </div>

            {!isPremium && chatLimit && (chatLimit.remaining <= 3 || chatLimit.remaining === 0) && (
              <Card className={chatLimit.remaining === 0 ? "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800" : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"}>
                <CardContent className="py-3 flex items-center gap-3">
                  <AlertCircle className={chatLimit.remaining === 0 ? "h-5 w-5 text-orange-600 dark:text-orange-500 flex-shrink-0" : "h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0"} />
                  <div className="flex-1">
                    <p className={chatLimit.remaining === 0 ? "text-sm font-bold text-orange-900 dark:text-orange-50" : "text-sm font-medium text-amber-900 dark:text-amber-50"}>
                      {chatLimit.remaining === 0 ? tr('chat_limit_warning') : `${tr('chat_limit_title')} ${chatLimit.remaining}`}
                    </p>
                    <p className={chatLimit.remaining === 0 ? "text-xs text-orange-700 dark:text-orange-400 font-medium" : "text-xs text-amber-700 dark:text-amber-400"}>
                      {tr('food_verified')} {chatLimit.hoursRemaining || 0}h {chatLimit.minutesRemaining || 0}min
                    </p>
                  </div>
                  <Link href="/subscription">
                    <Button size="sm" className={chatLimit.remaining === 0 ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-amber-600 hover:bg-amber-700 text-white"}>
                      <Crown className="h-3 w-3 mr-1" />Premium
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            <Card className="card-nutriflow shadow-2xl border-purple-100/50 dark:border-purple-900/10 dark:bg-slate-900/80 backdrop-blur-3xl min-h-[500px] flex flex-col overflow-hidden">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-900 dark:text-slate-100"><Bot className="h-6 w-6 text-purple-600 dark:text-purple-500" />{activeConversationId ? (conversations.find(c => c.id === activeConversationId)?.title || tr('common_confirm')) : (tr('chat_asistant_name') || 'NutriFlow IA')}</CardTitle>
                <CardDescription className="dark:text-slate-400 font-medium">{tr('chat_welcome_subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <div className="max-h-[calc(100vh-380px)] overflow-y-auto p-4 space-y-6 custom-scrollbar">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-6">
                      <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-200 dark:shadow-purple-900/40"><Sparkles className="h-10 w-10 text-white" /></div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{tr('chat_welcome_title')} 🤖</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">{tr('chat_welcome_subtitle')}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl px-4">
                        {SUGGESTED_QUESTIONS.map((sq) => (
                          <button key={sq.question} onClick={() => sendMessage(sq.question)} disabled={isLoading} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-200 dark:hover:border-purple-800 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed">
                            <span className="text-xl">{sq.icon}</span>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight">{sq.question}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id || `${message.role}-${message.timestamp.getTime()}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.role === 'user' ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-100 dark:border-slate-700'}`}>
                          <div className="flex items-start gap-2">
                            {message.role === 'assistant' && (
                              <div className="flex-shrink-0 mt-0.5"><div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"><Bot className="h-3 w-3 text-white" /></div></div>
                            )}
                            <div className="flex-1 min-w-0">
                              {message.role === 'user' ? (
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              ) : (
                                <div className="text-sm prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 dark:prose-invert">
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                                </div>
                              )}
                              <div className={`text-[9px] mt-1.5 ${message.role === 'user' ? 'text-purple-200' : 'text-slate-400 dark:text-slate-500'}`}>{message.timestamp.toLocaleTimeString(lang === 'en' ? 'en-US' : 'es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                            {message.role === 'user' && (
                              <div className="flex-shrink-0 mt-0.5"><div className="w-6 h-6 rounded-full bg-purple-200 dark:bg-purple-900 flex items-center justify-center"><User className="h-3 w-3 text-purple-700 dark:text-purple-300" /></div></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"><Bot className="h-3 w-3 text-white" /></div>
                        <div className="flex gap-1 ml-1"><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" /><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]" /><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]" /></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/50 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-b-xl">
                  <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
                    <Input 
                      value={input} 
                      onChange={(e) => setInput(e.target.value)} 
                      placeholder={!isPremium && chatLimit?.remaining === 0 ? tr('chat_limit_warning') : tr('chat_input_placeholder')} 
                      disabled={isLoading || (!isPremium && chatLimit?.remaining === 0)} 
                      className="flex-1 h-14 text-base rounded-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-inner focus:ring-2 focus:ring-purple-500/50 hover:border-purple-200 dark:hover:border-purple-800 transition-all dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-900/50 disabled:text-slate-400" 
                    />
                    <Button 
                      type="submit" 
                      disabled={isLoading || !input.trim() || (!isPremium && chatLimit?.remaining === 0)} 
                      className="h-14 w-14 p-0 bg-gradient-to-br from-purple-600 to-purple-800 hover:scale-105 active:scale-95 text-white rounded-2xl shadow-lg shadow-purple-500/20 disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none transition-all flex items-center justify-center"
                    >
                      {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
                    </Button>
                  </form>
                  <div className="flex items-center justify-between mt-3 px-1">
                    <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 dark:text-slate-500 flex items-center gap-1.5 opacity-70"><Lightbulb className="h-3 w-3" /> {tr('chat_asistant_name') || 'NutriFlow AI'} {tr('common_error')}.</p>
                    {chatLimit && chatLimit.limit < 9999 && (<div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-slate-400 dark:text-slate-500"><Clock className="h-3 w-3" />{chatLimit.remaining} {tr('chat_limit_title')}</div>)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 20px; }
      `}</style>
    </DashboardLayout>
  );
}
