import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { jobs as staticJobs } from "@/data/jobs";
import JobCard from "@/components/JobCard";
import JobDetailModal from "@/components/JobDetailModal";
import ApplyModal from "@/components/ApplyModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Briefcase, Users, Building2, MapPinIcon } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import axios from "axios";

const ICON_MAP: Record<string, any> = {
  "Active Jobs":        Briefcase,
  "Companies":          Building2,
  "Candidates Placed":  Users,
  "Cities":             MapPin,
};

const Index = () => {
  const { user, openAuthModal, pendingApplyJobId, clearPendingApply } = useAuth();
  const navigate = useNavigate();

  const [apiJobs, setApiJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [viewJob, setViewJob] = useState<any>(null);
  const [applyJob, setApplyJob] = useState<any>(null);

  // ✅ Read hero from localStorage (admin edited)
  const homeHero = JSON.parse(localStorage.getItem("homeHero") || "null");
  const heroTitle    = homeHero?.title    || "Find Your Dream Job";
  const heroSubtitle = homeHero?.subtitle || "Job HR CRM Consultancy For CRM Solutions";

  // ✅ Read stats from localStorage (admin edited)
  const homeStats = JSON.parse(localStorage.getItem("homeStats") || "null") || [
    { label: "Active Jobs",       value: "500+"   },
    { label: "Companies",         value: "120+"   },
    { label: "Candidates Placed", value: "2,500+" },
    { label: "Cities",            value: "25+"    },
  ];

  // ✅ Fetch jobs from backend for search dropdown
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("https://crm-lz8h.onrender.com/api/jobs");
        const data = res.data;
        if (Array.isArray(data)) setApiJobs(data);
        else if (Array.isArray(data.jobs)) setApiJobs(data.jobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  // ✅ Search dropdown filter
  const filteredJobs = search.trim()
    ? apiJobs.filter(
        (job) =>
          job.title?.toLowerCase().includes(search.toLowerCase()) ||
          job.company?.toLowerCase().includes(search.toLowerCase()) ||
          job.location?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = (job: any) => {
  if (!user) {
    openAuthModal(job.id);
    return;
  }
  setApplyJob(job);
};

  if (user && pendingApplyJobId && !applyJob) {
    setApplyJob(pendingApplyJobId);
    clearPendingApply();
  }

  // ✅ Featured jobs — admin controlled via localStorage
  const savedIds: string[] = JSON.parse(localStorage.getItem("featuredJobIds") || "[]");
  const featuredJobs = savedIds.length > 0
  ? apiJobs.filter((job) =>
      savedIds.includes(job._id || job.id)
    )
  : apiJobs.filter((job) => job.featured === true);
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20">
        <div className="absolute inset-0 -z-10">
          <img src={heroBg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          {/* ✅ Hero title from localStorage */}
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            {heroTitle.includes("Dream Job") ? (
              <>
                {heroTitle.split("Dream Job")[0]}
                <span className="text-primary">Dream Job</span>
                {heroTitle.split("Dream Job")[1]}
              </>
            ) : (
              heroTitle
            )}
          </h1>

          {/* ✅ Hero subtitle from localStorage */}
          <p className="mb-8 text-lg text-gray-200">{heroSubtitle}</p>

          <div className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row">
            {/* Search with Dropdown */}
            <div className="relative flex-1" ref={dropdownRef}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
              <Input
                className="pl-10 bg-white"
                placeholder="Job title or keyword..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => search.trim() && setShowDropdown(true)}
              />

              {/* Dropdown */}
              {showDropdown && search.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border z-50 max-h-72 overflow-y-auto text-left">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-0 transition-colors"
                        onClick={() => {
                          setShowDropdown(false);
                          setSearch(job.title);
                          setViewJob(job);
                        }}
                      >
                        <Briefcase className="mt-1 h-4 w-4 text-primary shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{job.title}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            {job.company} &nbsp;•&nbsp;
                            <MapPinIcon className="inline h-3 w-3" /> {job.location}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-sm text-gray-500 text-center">
                      No jobs found for "<span className="font-medium">{search}</span>"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Location */}
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 bg-white"
                placeholder="Location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>

            <Button
              size="lg"
              className="whitespace-nowrap"
              onClick={() => navigate(`/jobs?search=${search}&location=${locationFilter}`)}
            >
              Search Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* ✅ Stats — from localStorage (admin editable) */}
      <section className="border-b bg-background py-12">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
          {homeStats.map(({ label, value }: { label: string; value: string }) => {
            const Icon = ICON_MAP[label] ?? Briefcase;
            return (
              <div key={label} className="text-center">
                <Icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ✅ Featured Jobs — unchanged */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Featured <span className="text-primary">Jobs</span>
          </h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <JobCard key={job.id || job.id} job={job} onApply={handleApply} onView={setViewJob} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg" onClick={() => navigate("/jobs")}>
              View All Jobs →
            </Button>
          </div>
        </div>
      </section>

      {/* CTA — unchanged */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Start Your Career?</h2>
          <p className="mb-6 text-lg opacity-90">
            Create your profile, upload your resume, and apply to top jobs today.
          </p>
          {user ? (
            <Button variant="secondary" size="lg" onClick={() => navigate("/profile")}>
              Go to Profile
            </Button>
          ) : (
            <Button variant="secondary" size="lg" onClick={() => navigate("/signup")}>
              Sign Up Now
            </Button>
          )}
        </div>
      </section>

      {/* Modals — unchanged */}
      <JobDetailModal
        job={apiJobs.find((j) => j.id === viewJob) || null}
        open={!!viewJob}
        onClose={() => setViewJob(null)}
        onApply={(id) => { setViewJob(null); handleApply(id); }}
      />
      <ApplyModal
        job={applyJob}
        open={!!applyJob}
        onClose={() => setApplyJob(null)}
      />
    </div>
  );
};

export default Index;