import { useState, useEffect } from "react";
import axios from "axios";
import {
  Briefcase, MapPin, Building2, Users, Star,
  Save, RotateCcw, Pencil, X, Check,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface HeroData  { title: string; subtitle: string; }
interface StatItem  { label: string; value: string; }

const STORAGE_KEY_FEATURED = "featuredJobIds";
const STORAGE_KEY_HERO     = "homeHero";
const STORAGE_KEY_STATS    = "homeStats";

const DEFAULT_HERO: HeroData = {
  title:    "Find Your Dream Job",
  subtitle: "Job HR CRM Consultancy For CRM Solutions",
};

const DEFAULT_STATS: StatItem[] = [
  { label: "Active Jobs",        value: "500+"   },
  { label: "Companies",          value: "120+"   },
  { label: "Candidates Placed",  value: "2,500+" },
  { label: "Cities",             value: "25+"    },
];

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ message, type }: { message: string; type: "success" | "error" }) => (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-white shadow-xl transition-all ${type === "success" ? "bg-green-600" : "bg-red-500"}`}>
    {type === "success" ? <Check size={15} /> : <X size={15} />}
    {message}
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminHomePage() {

  // ── Hero state ──────────────────────────────────────────────────────────────
  const [hero,         setHero]         = useState<HeroData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_HERO);
    return saved ? JSON.parse(saved) : DEFAULT_HERO;
  });
  const [heroOriginal, setHeroOriginal] = useState<HeroData>(hero);
  const [heroEditing,  setHeroEditing]  = useState(false);

  // ── Stats state ─────────────────────────────────────────────────────────────
  const [stats,         setStats]         = useState<StatItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STATS);
    return saved ? JSON.parse(saved) : DEFAULT_STATS;
  });
  const [statsOriginal, setStatsOriginal] = useState<StatItem[]>(stats);
  const [statsEditing,  setStatsEditing]  = useState(false);

  // ── Featured jobs state ─────────────────────────────────────────────────────
  const [jobs,       setJobs]       = useState<any[]>([]);
  const [featuredIds,setFeaturedIds]= useState<string[]>(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_FEATURED) || "[]");
  });
  const [loadingJobs, setLoadingJobs] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch jobs ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true);
      try {
        const res = await axios.get("http://localhost:5000/api/jobs");
        const data = res.data;
        if (Array.isArray(data)) setJobs(data);
        else if (Array.isArray(data.jobs)) setJobs(data.jobs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  // ── Save Hero ───────────────────────────────────────────────────────────────
  const saveHero = () => {
    if (!hero.title.trim() || !hero.subtitle.trim()) {
      showToast("Title and subtitle are required", "error");
      return;
    }
    localStorage.setItem(STORAGE_KEY_HERO, JSON.stringify(hero));
    setHeroOriginal({ ...hero });
    setHeroEditing(false);
    showToast("Hero section saved successfully!");
  };

  // ── Save Stats ──────────────────────────────────────────────────────────────
  const saveStats = () => {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
    setStatsOriginal([...stats]);
    setStatsEditing(false);
    showToast("Stats section saved successfully!");
  };

  // ── Featured Jobs toggle ────────────────────────────────────────────────────
  const toggleFeatured = (id: string) => {
    setFeaturedIds((prev) => {
      if (prev.includes(id)) return prev.filter((f) => f !== id);
      if (prev.length >= 6) {
        showToast("Maximum 6 featured jobs allowed!", "error");
        return prev;
      }
      return [...prev, id];
    });
  };

  const saveFeatured = () => {
    localStorage.setItem(STORAGE_KEY_FEATURED, JSON.stringify(featuredIds));
    showToast("Featured jobs updated successfully!");
  };

  return (
    <div className="space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Edit Home Page</h2>
        <p className="mt-1 text-sm text-gray-500">
          All changes are saved to localStorage and reflected on the public Home page instantly.
        </p>
      </div>

      {/* ── HERO SECTION ──────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="font-semibold text-gray-700">Hero Section</h3>
            <p className="text-xs text-gray-400">Main title and subtitle shown on the homepage banner</p>
          </div>
          {!heroEditing ? (
            <button
              onClick={() => setHeroEditing(true)}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
            >
              <Pencil size={14} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => { setHero({ ...heroOriginal }); setHeroEditing(false); }}
                className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                <RotateCcw size={14} /> Cancel
              </button>
              <button
                onClick={saveHero}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
              >
                <Save size={14} /> Save
              </button>
            </div>
          )}
        </div>

        <div className="space-y-5 px-6 py-5">
          {[
            { key: "title",    label: "Main Title",  placeholder: "Find Your Dream Job"                  },
            { key: "subtitle", label: "Subtitle",    placeholder: "Job HR CRM Consultancy For CRM Solutions" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">{label}</label>
              {heroEditing ? (
                <input
                  type="text"
                  value={(hero as any)[key]}
                  placeholder={placeholder}
                  onChange={(e) => setHero({ ...hero, [key]: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              ) : (
                <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 min-h-[2.5rem]">
                  {(hero as any)[key] || <span className="italic text-gray-400">Empty</span>}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS SECTION ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="font-semibold text-gray-700">Stats Section</h3>
            <p className="text-xs text-gray-400">Numbers shown below the hero banner</p>
          </div>
          {!statsEditing ? (
            <button
              onClick={() => setStatsEditing(true)}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
            >
              <Pencil size={14} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => { setStats([...statsOriginal]); setStatsEditing(false); }}
                className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                <RotateCcw size={14} /> Cancel
              </button>
              <button
                onClick={saveStats}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
              >
                <Save size={14} /> Save
              </button>
            </div>
          )}
        </div>

        <div className="divide-y divide-gray-100">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-4 px-6 py-4">
              <div className="w-40 shrink-0">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{stat.label}</p>
              </div>
              {statsEditing ? (
                <div className="flex flex-1 gap-3">
                  <input
                    type="text"
                    value={stat.value}
                    placeholder="e.g. 500+"
                    onChange={(e) => {
                      const updated = [...stats];
                      updated[index] = { ...updated[index], value: e.target.value };
                      setStats(updated);
                    }}
                    className="w-32 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    placeholder="Label"
                    onChange={(e) => {
                      const updated = [...stats];
                      updated[index] = { ...updated[index], label: e.target.value };
                      setStats(updated);
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              ) : (
                <p className="text-lg font-bold text-gray-800">{stat.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURED JOBS ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="font-semibold text-gray-700">Featured Jobs</h3>
            <p className="text-xs text-gray-400">
              Select up to <strong>6 jobs</strong> to display on the homepage.{" "}
              <span className="text-green-600 font-medium">{featuredIds.length}/6 selected</span>
            </p>
          </div>
          <button
            onClick={saveFeatured}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
          >
            <Save size={14} /> Save Changes
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {loadingJobs ? (
            <p className="px-6 py-8 text-sm text-gray-400">Loading jobs…</p>
          ) : jobs.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              <Briefcase size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No jobs found. Add jobs from the Jobs section first.</p>
            </div>
          ) : (
            jobs.map((job) => {
              const isFeatured = featuredIds.includes(job._id);
              return (
                <div
                  key={job._id}
                  onClick={() => toggleFeatured(job._id)}
                  className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-colors ${
                    isFeatured ? "bg-green-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800">{job.title}</p>
                      {isFeatured && (
                        <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          <Star size={10} fill="currentColor" /> Featured
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Building2 size={12} />{job.company}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                      {job.type && (
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-green-700 font-medium">{job.type}</span>
                      )}
                      {job.salary && <span>💰 {job.salary}</span>}
                    </div>
                  </div>

                  {/* Toggle */}
                  <div className={`ml-4 h-6 w-11 rounded-full transition-colors shrink-0 ${isFeatured ? "bg-green-500" : "bg-gray-300"} relative`}>
                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isFeatured ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── LIVE PREVIEW ──────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="font-semibold text-gray-700">Live Preview</h3>
          <p className="text-xs text-gray-400">Approximate look of the public Home page hero & stats</p>
        </div>
        {/* Hero Preview */}
        <div className="bg-gray-800 px-8 py-10 text-center text-white">
          <h1 className="mb-3 text-2xl font-bold">{hero.title}</h1>
          <p className="text-sm opacity-80">{hero.subtitle}</p>
        </div>
        {/* Stats Preview */}
        <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}