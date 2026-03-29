import { useState, useEffect, useRef } from "react";
import axios from "axios";
import JobCard from "@/components/JobCard";
import JobDetailModal from "@/components/JobDetailModal";
import ApplyModal from "@/components/ApplyModal";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Briefcase, MapPinIcon } from "lucide-react";

const types = ["All", "Full-time", "Part-time", "Remote", "Internship"];

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [viewJob, setViewJob] = useState<any>(null);
  const [applyJob, setApplyJob] = useState<any>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("https://crm-lz8h.onrender.com/api/jobs");
        const data = res.data;
        if (Array.isArray(data)) setJobs(data);
        else if (Array.isArray(data.jobs)) setJobs(data.jobs);
        else { console.error("Invalid jobs response:", data); setJobs([]); }
      } catch (error) {
        console.error(error);
        setJobs([]);
      }
    };
    fetchJobs();
  }, []);

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

  // ✅ Dropdown filtered jobs (based on search input)
  const dropdownJobs = search.trim()
    ? jobs.filter(
        (job) =>
          job.title?.toLowerCase().includes(search.toLowerCase()) ||
          job.company?.toLowerCase().includes(search.toLowerCase()) ||
          job.location?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // ✅ Grid filtered jobs (search + location + type)
  const filtered = Array.isArray(jobs)
    ? jobs.filter((j) => {
        const matchSearch =
          !search ||
          j.title?.toLowerCase().includes(search.toLowerCase()) ||
          j.company?.toLowerCase().includes(search.toLowerCase());
        const matchLocation =
          !locationFilter ||
          j.location?.toLowerCase().includes(locationFilter.toLowerCase());
        const matchType = typeFilter === "All" || j.type === typeFilter;
        return matchSearch && matchLocation && matchType;
      })
    : [];

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">
        Browse <span className="text-primary">Jobs</span>
      </h1>

      <div className="flex gap-3 mb-6">

        {/* ✅ Search with Dropdown */}
        <div className="relative flex-1" ref={dropdownRef}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
          <Input
            className="pl-10"
            placeholder="Search..."
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
              {dropdownJobs.length > 0 ? (
                dropdownJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-0 transition-colors"
                    onClick={() => {
                      setShowDropdown(false);
                      setSearch(job.title);
                      setViewJob(job); // ✅ Opens job detail modal directly
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

        {/* Location Filter */}
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={typeFilter} onValueChange={setTypeFilter}>
        <TabsList>
          {types.map((t) => (
            <TabsTrigger key={t} value={t}>{t}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {filtered.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onApply={setApplyJob}
            onView={setViewJob}
          />
        ))}
      </div>

      <JobDetailModal
        job={viewJob}
        open={!!viewJob}
        onClose={() => setViewJob(null)}
        onApply={setApplyJob}
      />

      <ApplyModal
        job={applyJob}
        open={!!applyJob}
        onClose={() => setApplyJob(null)}
      />
    </div>
  );
}