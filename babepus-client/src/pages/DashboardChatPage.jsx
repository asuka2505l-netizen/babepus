import { useCallback, useEffect, useState } from "react";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import Textarea from "../components/ui/Textarea";
import { useAuth } from "../hooks/useAuth";
import { chatService } from "../services/chatService";
import { formatDate } from "../utils/date";

const DashboardChatPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    const data = await chatService.getConversations();
    setConversations(data);
    setActiveConversation((current) => current || data[0] || null);
  }, []);

  const fetchMessages = useCallback(async (conversation) => {
    if (!conversation) {
      return;
    }
    const data = await chatService.getMessages(conversation.id);
    setMessages(data);
  }, []);

  useEffect(() => {
    fetchConversations().finally(() => setIsLoading(false));
  }, [fetchConversations]);

  useEffect(() => {
    fetchMessages(activeConversation);
  }, [activeConversation, fetchMessages]);

  useEffect(() => {
    const stream = chatService.createStream();
    if (!stream) {
      return undefined;
    }

    stream.addEventListener("message", (event) => {
      const incoming = JSON.parse(event.data);
      if (incoming.conversationId === activeConversation?.id) {
        setMessages((current) => [...current, incoming]);
      }
      fetchConversations();
    });

    return () => stream.close();
  }, [activeConversation?.id, fetchConversations]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!activeConversation || !message.trim()) {
      return;
    }

    const sent = await chatService.sendMessage(activeConversation.id, message.trim());
    setMessages((current) => [...current, sent]);
    setMessage("");
    await fetchConversations();
  };

  if (isLoading) {
    return <Skeleton className="h-[560px]" />;
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-[2rem] bg-white p-5 shadow-soft">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Chat Realtime</p>
        <h1 className="mt-2 text-2xl font-black text-slate-950">Percakapan Produk</h1>
      </div>

      {conversations.length ? (
        <div className="grid min-h-[620px] gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-[2rem] border border-slate-100 bg-white p-3 shadow-soft">
            <div className="grid gap-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setActiveConversation(conversation)}
                  className={`rounded-2xl p-4 text-left transition ${
                    activeConversation?.id === conversation.id ? "bg-emerald-600 text-white" : "bg-slate-50 text-slate-700"
                  }`}
                >
                  <p className="font-black">{conversation.counterpart.fullName}</p>
                  <p className="mt-1 line-clamp-1 text-xs opacity-80">{conversation.product.title}</p>
                  {conversation.unreadCount ? <p className="mt-2 text-xs font-black">{conversation.unreadCount} baru</p> : null}
                </button>
              ))}
            </div>
          </aside>
          <section className="flex min-h-[620px] flex-col rounded-[2rem] border border-slate-100 bg-white p-4 shadow-soft">
            <div className="border-b border-slate-100 pb-4">
              <p className="font-black text-slate-950">{activeConversation?.counterpart.fullName}</p>
              <p className="text-sm text-slate-500">{activeConversation?.product.title}</p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto py-4">
              {messages.map((item) => {
                const mine = item.senderId === user.id;
                return (
                  <div key={item.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[78%] rounded-2xl p-3 ${mine ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-800"}`}>
                      <p className="text-sm leading-6">{item.body}</p>
                      <p className="mt-2 text-[11px] opacity-70">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <form onSubmit={sendMessage} className="grid gap-3 border-t border-slate-100 pt-4">
              <Textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tulis pesan..." />
              <Button type="submit">Kirim Pesan</Button>
            </form>
          </section>
        </div>
      ) : (
        <EmptyState title="Belum ada chat" description="Chat dimulai dari halaman detail produk ketika pembeli menghubungi seller." />
      )}
    </div>
  );
};

export default DashboardChatPage;
