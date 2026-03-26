import Navbar from "@/components/Navbar";
import ChatbotWidget from "@/components/ChatBot";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

interface ContactInfo {
  email: string;
  phone: string;
  office_address: string;
  off_address: string;
}

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "Info@crmjobshopee.com",
    phone: "+91 8939750730",
    office_address: "Door no 71, Block no 151, Ezhil Nagar, Perumbakkam, Chennai, Tamil Nadu, India.",
    off_address: "Survey No 153 Raja Gopalapuram, Cherivey, Tada Sricity, Sathyavedu TK, Thirupathy Dist, A P, India.",
  });

  useEffect(() => {
    fetch("http://localhost:5000/admin/contact-info")
      .then((r) => r.json())
      .then((data) => {
        if (data?.email) setContactInfo(data);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast({ title: "Validation Error", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }
    toast({ title: "Message Sent!", description: "We'll get back to you soon." });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-hero-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 font-display text-4xl font-bold text-primary-foreground md:text-5xl"
          >
            Contact US
          </motion.h1>
          <p className="text-primary-foreground/80">Have questions? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-foreground">Get in Touch</h2>
            <p className="text-muted-foreground">
              Reach out to us for any queries about job listings, partnerships, or career advice. Our team is here to help!
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{contactInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{contactInfo.office_address}</p>
                  <p className="text-sm text-muted-foreground">Off Address</p>
                  <p className="font-medium text-foreground">{contactInfo.off_address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="glass-card space-y-4 rounded-xl p-6"
          >
            <Input
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              maxLength={100}
            />
            <Input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              maxLength={255}
            />
            <Input
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              maxLength={200}
            />
            <Textarea
              placeholder="Your Message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              maxLength={2000}
            />
            <Button type="submit" className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </motion.form>
        </div>
      </section>

      <ChatbotWidget />
    </div>
  );
};

export default Contact;
