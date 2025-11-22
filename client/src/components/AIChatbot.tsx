import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, X, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ChatMessage } from "@shared/schema";

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAIAvailable, setIsAIAvailable] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI university advisor. Ask me anything about universities, or try:\n\n• 'Which universities are best for Computer Science under $50k?'\n• 'Compare MIT and Stanford'\n• 'Show me universities in Canada with scholarships'",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { message, history: messages });
      return response.json();
    },
    onSuccess: (data: { message: string }) => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.message,
        timestamp: Date.now(),
      }]);
    },
    onError: (error: Error) => {
      const isConfigError = error.message.includes("OPENAI_API_KEY") || error.message.includes("503");
      if (isConfigError) {
        setIsAIAvailable(false);
      }
      
      const errorMessage = isConfigError
        ? "AI Advisor is not configured. Please contact the administrator to set up the OpenAI API key."
        : "Sorry, I encountered an error. Please try again.";
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: errorMessage,
        timestamp: Date.now(),
      }]);
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    chatMutation.mutate(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="absolute inset-0 rounded-full bg-gradient-primary animate-pulse blur-xl opacity-75" />
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="relative w-16 h-16 rounded-full bg-gradient-primary hover:shadow-2xl shadow-primary/50 transition-all duration-250 animate-pulse"
          data-testid="button-open-chat"
        >
          <Sparkles className="w-7 h-7" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] glass-effect-strong rounded-3xl shadow-2xl flex flex-col z-50 animate-slide-up" data-testid="panel-ai-chat">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">AI Advisor</h3>
            <p className="text-xs text-muted-foreground">Powered by GPT-5</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            data-testid="button-minimize-chat"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setMessages([messages[0]]);
              setIsOpen(false);
            }}
            data-testid="button-close-chat"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
              data-testid={`message-${message.role}-${idx}`}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                  message.role === "user"
                    ? "bg-gradient-primary text-white"
                    : "bg-secondary/50 text-foreground"
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="flex justify-start">
              <div className="bg-secondary/50 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-75" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/50">
        {!isAIAvailable && (
          <div className="mb-3 p-2 bg-destructive/10 border border-destructive/30 rounded-lg text-xs text-destructive-foreground">
            AI features are currently unavailable. Configuration required.
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isAIAvailable ? "Ask me anything..." : "AI unavailable"}
            className="flex-1 bg-secondary/30 border-0"
            disabled={chatMutation.isPending || !isAIAvailable}
            data-testid="input-chat-message"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || chatMutation.isPending || !isAIAvailable}
            size="icon"
            className="bg-gradient-primary"
            data-testid="button-send-message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
