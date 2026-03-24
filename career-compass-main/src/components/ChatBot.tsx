import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  role: "user" | "bot";
  text: string;
}

const botResponses: Record<string, string> = {
  hello: "Hi there! 👋 I'm the CRM Job Shopee assistant. I can help you with job search, profile setup, and resume tips. What do you need?",
  hi: "Hello! 😊 How can I help you today? Ask me about jobs, your profile, or interview tips!",
  job: "Looking for a job? Head to our Jobs page to search by keyword, location, or type. You can filter by Full-time, Part-time, Remote, or Internship!",
  resume: "📝 Resume tips:\n• Keep it to 1-2 pages\n• Use action verbs (Led, Built, Managed)\n• Include measurable achievements\n• Tailor it for each job\n• Upload your resume in your Profile!",
  profile: "Your profile helps auto-fill job applications! Go to Profile and add your personal details, experience, skills, and upload your resume.",
  interview: "💡 Interview tips:\n• Research the company beforehand\n• Practice common questions\n• Prepare questions to ask them\n• Dress professionally\n• Be confident and honest!",
  salary: "💰 Salary negotiation tips:\n• Research market rates on Glassdoor\n• Know your worth\n• Don't give a number first\n• Consider the full package (benefits, growth)\n• Be confident but flexible",
  skills: "🔧 Top skills employers look for:\n• Communication\n• Problem-solving\n• Technical skills relevant to role\n• Teamwork & collaboration\n• Adaptability",
  apply: "To apply for a job:\n1. Browse Jobs page\n2. Click 'Apply Now' on any listing\n3. Sign in if not logged in\n4. Fill the form (auto-fills from profile!)\n5. Submit! 🎉",
  thanks: "You're welcome! 😊 Good luck with your job search. I'm always here if you need help!",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(botResponses)) {
    if (lower.includes(key)) return response;
  }
  return "I'm not sure about that, but I can help with job search, resume tips, profile setup, interview prep, and salary advice. Try asking about one of those! 😊";
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi! 👋 I'm your  CRM Job Shopee assistant. Ask me about jobs, resume tips, or interview prep!" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", text: input };
    const botMsg: Message = { role: "bot", text: getBotResponse(input) };
    setMessages((m) => [...m, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[420px] w-[340px] flex-col rounded-xl border bg-background shadow-2xl">
          <div className="flex items-center gap-2 rounded-t-xl bg-primary px-4 py-3 text-primary-foreground">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">CRM Job Shopee Assistant</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="flex gap-2 border-t p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask me anything..."
              className="text-sm"
            />
            <Button size="icon" onClick={send}><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </>
  );
}
