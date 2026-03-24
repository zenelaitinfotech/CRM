export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Remote" | "Internship";
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
}

export const jobs: Job[] = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "TechCorp Solutions",
    location: "Chennai",
    type: "Full-time",
    salary: "₹12,00,000 - ₹18,00,000",
    description: "We are looking for an experienced React developer to join our team. You will be building complex web applications using React, TypeScript, and modern tooling.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "REST API integration", "Git version control"],
    postedDate: "2026-02-15",
  },
  {
    id: "2",
    title: "UI/UX Designer",
    company: "DesignHub India",
    location: "Bangalore",
    type: "Full-time",
    salary: "₹8,00,000 - ₹14,00,000",
    description: "Join our creative team to design beautiful and intuitive user interfaces for web and mobile applications.",
    requirements: ["Figma/Sketch expertise", "3+ years UI/UX experience", "Portfolio required", "Wireframing skills"],
    postedDate: "2026-02-14",
  },
  {
    id: "3",
    title: "Backend Developer (Node.js)",
    company: "CloudNet Systems",
    location: "Hyderabad",
    type: "Remote",
    salary: "₹10,00,000 - ₹16,00,000",
    description: "Build scalable backend services using Node.js and cloud technologies. Work on microservices architecture.",
    requirements: ["Node.js & Express", "MongoDB/PostgreSQL", "AWS/GCP experience", "Docker & Kubernetes"],
    postedDate: "2026-02-13",
  },
  {
    id: "4",
    title: "Digital Marketing Intern",
    company: "GrowthLab",
    location: "Mumbai",
    type: "Internship",
    salary: "₹15,000/month",
    description: "Learn digital marketing from industry experts. Work on real campaigns across social media, SEO, and email marketing.",
    requirements: ["Currently pursuing degree", "Basic social media knowledge", "Good communication skills", "Eager to learn"],
    postedDate: "2026-02-16",
  },
  {
    id: "5",
    title: "Data Analyst",
    company: "DataMinds Analytics",
    location: "Pune",
    type: "Full-time",
    salary: "₹7,00,000 - ₹12,00,000",
    description: "Analyze large datasets to provide business insights. Create dashboards and reports for stakeholders.",
    requirements: ["SQL & Python", "Power BI / Tableau", "Statistics knowledge", "Excel advanced"],
    postedDate: "2026-02-12",
  },
  {
    id: "6",
    title: "Content Writer",
    company: "MediaPulse",
    location: "Delhi",
    type: "Part-time",
    salary: "₹3,00,000 - ₹5,00,000",
    description: "Write engaging content for blogs, social media, and marketing materials. SEO-friendly writing is a plus.",
    requirements: ["Excellent English writing", "SEO basics", "Creative thinking", "Meeting deadlines"],
    postedDate: "2026-02-17",
  },
  {
    id: "7",
    title: "Mobile App Developer (Flutter)",
    company: "AppForge Technologies",
    location: "Coimbatore",
    type: "Full-time",
    salary: "₹9,00,000 - ₹15,00,000",
    description: "Develop cross-platform mobile applications using Flutter and Dart. Collaborate with designers and backend teams.",
    requirements: ["Flutter & Dart", "2+ years mobile dev", "Firebase experience", "Published apps preferred"],
    postedDate: "2026-02-11",
  },
  {
    id: "8",
    title: "HR Executive",
    company: "PeopleFirst HR",
    location: "Chennai",
    type: "Full-time",
    salary: "₹4,00,000 - ₹7,00,000",
    description: "Manage recruitment, onboarding, and employee engagement activities. Maintain HR records and compliance.",
    requirements: ["MBA in HR", "1+ year experience", "Strong communication", "HRMS knowledge"],
    postedDate: "2026-02-18",
  },
  {
    id: "9",
    title: "DevOps Engineer",
    company: "InfraStack",
    location: "Bangalore",
    type: "Remote",
    salary: "₹14,00,000 - ₹22,00,000",
    description: "Set up CI/CD pipelines, manage cloud infrastructure, and ensure high availability of production systems.",
    requirements: ["AWS/Azure/GCP", "Terraform/Ansible", "Docker & Kubernetes", "Linux administration"],
    postedDate: "2026-02-10",
  },
  {
    id: "10",
    title: "Sales Executive",
    company: "CRM Job Shopee",
    location: "Chennai",
    type: "Full-time",
    salary: "₹3,50,000 - ₹6,00,000",
    description: "Drive sales for our recruitment consultancy services. Build client relationships and close deals.",
    requirements: ["1+ year sales experience", "Good negotiation skills", "Tamil & English fluency", "Own vehicle preferred"],
    postedDate: "2026-02-19",
  },
];
