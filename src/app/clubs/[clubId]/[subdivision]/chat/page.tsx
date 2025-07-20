"use client";

import { useState, useEffect, useRef, use } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import io from "socket.io-client";
import { suggestReply } from '@/ai/flows/suggest-reply-flow';
import { useToast } from "@/hooks/use-toast";

type Message = {
  user: { name: string; avatar: string; dataAiHint: string; };
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
};

function ChatClientPage({ subdivision }: { subdivision: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const socketRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
    async function fetchMessages() {
      const res = await fetch(`http://localhost:5000/api/subdivisions/${subdivision}/chat`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        setMessages([]);
      }
    }
    fetchMessages();

    // Setup Socket.IO for real-time chat
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000/chat");
      socketRef.current.emit("join_room", `${subdivision}-chat`);
      socketRef.current.on("receive_message", (message: any) => {
        setMessages((prev) => [...prev, message]);
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [subdivision]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socketRef.current) {
      const message: Message = {
        user: { name: 'You', avatar: 'https://placehold.co/40x40.png', dataAiHint: 'person' },
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
      };
      socketRef.current.emit("send_message", { room: `${subdivision}-chat`, message });
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleSuggestReply = async () => {
    setIsSuggesting(true);
    try {
      const history = messages.map(m => `${m.user.name}: ${m.text}`).join('\n');
      const result = await suggestReply({ history });
      setNewMessage(result.reply);
    } catch (error) {
       console.error("Error suggesting reply:", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to suggest a reply. Please try again.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  if (!isMounted) {
    // Return a skeleton or null to avoid hydration mismatch
    return null;
  }

  return (
    <div className="p-4 md:p-8 flex-1 flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="capitalize">{subdivision} Chat Room</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-end gap-2 ${msg.isCurrentUser ? 'justify-end' : ''}`}>
                  {!msg.isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.user.avatar} data-ai-hint={msg.user.dataAiHint}/>
                      <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg p-3 max-w-xs lg:max-w-md ${msg.isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {!msg.isCurrentUser && <p className="text-xs font-semibold pb-1">{msg.user.name}</p>}
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs text-right mt-1 opacity-70">{msg.timestamp}</p>
                  </div>
                   {msg.isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.user.avatar} data-ai-hint={msg.user.dataAiHint}/>
                      <AvatarFallback>Y</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-2">
            <Button variant="outline" onClick={handleSuggestReply} disabled={isSuggesting}>
                {isSuggesting ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                    </>
                ) : (
                    <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Suggest Reply
                    </>
                )}
            </Button>
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}


// This remains a server component to correctly handle params
export default function ChatPage({ params }: { params: Promise<{ clubId: string; subdivision: string }> }) {
  const resolvedParams = use(params);
  return <ChatClientPage subdivision={resolvedParams.subdivision} />;
}
