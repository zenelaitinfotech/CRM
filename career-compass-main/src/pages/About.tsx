import ChatbotWidget from "@/components/ChatBot";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Users } from "lucide-react";

const values = [
  {icon: Target, title: "Our Mission", desc: "To connect talented professionals with their dream careers by providing a seamless, transparent job search experience." },
  { icon: Eye, title: "Our Vision", desc: "To become the most trusted recruitment platform, empowering millions to find meaningful work worldwide." },
  { icon: Heart, title: "Our Values", desc: "Integrity, innovation, and inclusivity drive everything we do — from the candidates we support to the companies we partner with." },
  { icon: Users, title: "Our Team", desc: "A passionate group of HR professionals, engineers, and career coaches dedicated to transforming the hiring landscape." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">

      {/* HERO SECTION */}
      <section className="bg-hero-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-bold text-white"
          >
            About CRM Job Shopee
          </motion.h1>

          <p className="mx-auto max-w-5xl text-white">
           CRM HR CONSULTANCY services is engaged in various activities viz, support services / man power services specialized in varied categories ( i.e., Front office management services, Banking services and industrial lab our supplies for private sectors, Telecom , BPO , IT , Engineering & Manufacturing industry, FMCG ,Constructions, Waste water treatment Ro plants, sectors) and also we place on contract basis. <br /> <br /> The organization serves in the above respective fields from 2005 our team is comprised of a mixture of recruitment consultants with in-depth knowledge and quality experience in various industry sectors. They are supported by the largest team of researchers in the market; we operates in Tamilnadu, Andhrapradesh
          </p>
        </div>
      </section>

      {/* CARDS */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 border rounded"
            >
              <v.icon className="mb-3 h-8 w-8" />
              <h3 className="mb-2 text-xl font-bold">{v.title}</h3>
              <p>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <ChatbotWidget />
    </div>
  );
};

export default About;