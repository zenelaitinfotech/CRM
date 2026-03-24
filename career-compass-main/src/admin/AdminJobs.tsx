import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Briefcase, MapPin, Building2, X, Trash2 } from "lucide-react";

const EMPTY_FORM = {
  title:        "",
  company:      "",
  location:     "",
  type:         "Full-time",
  salary:       "",
  description:  "",
  requirements: "",
};

export default function AdminJobs() {
  const { token } = useAuth();
  const [jobs,    setJobs]    = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm,setShowForm]= useState(false);
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState<{ text: string; ok: boolean } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => { if (token) fetchJobs(); }, [token]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createJob = async () => {
    if (!form.title || !form.company) {
      setMsg({ text: "Title and Company are required", ok: false });
      return;
    }
    setSaving(true);
    try {
      await axios.post(
        "http://localhost:5000/api/jobs",
        { ...form, requirements: form.requirements.split(",").map((r) => r.trim()) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm(EMPTY_FORM);
      setShowForm(false);
      setMsg({ text: "Job created successfully!", ok: true });
      fetchJobs();
    } catch (e: any) {
      setMsg({ text: e.response?.data?.message || "Failed to create job", ok: false });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  const deleteJob = async (id: number) => {
  if (!window.confirm("Are you sure you want to delete this job?")) return;
  setDeletingId(id);
  try {
    await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setMsg({ text: "Job deleted successfully!", ok: true });
  } catch (e: any) {
    setMsg({ text: e.response?.data?.message || "Failed to delete job", ok: false });
  } finally {
    setDeletingId(null);
    setTimeout(() => setMsg(null), 3000);
  }
};

  return (
    <div className="space-y-6">

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Job Listings</h2>
          <p className="text-sm text-gray-500">{jobs.length} job{jobs.length !== 1 ? "s" : ""} posted</p>
        </div>
        <button
          onClick={() => setShowForm((p) => !p)}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
        >
          {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Job</>}
        </button>
      </div>

      {/* Toast */}
      {msg && (
        <div className={`rounded-lg px-4 py-3 text-sm font-medium ${msg.ok ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {msg.text}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-700">New Job</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Job Title *"  value={form.title}    onChange={(e) => setForm({ ...form, title:    e.target.value })} />
            <Input placeholder="Company *"    value={form.company}  onChange={(e) => setForm({ ...form, company:  e.target.value })} />
            <Input placeholder="Location"     value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Input placeholder="Type (Full-time / Part-time…)" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
            <Input placeholder="Salary"       value={form.salary}   onChange={(e) => setForm({ ...form, salary:   e.target.value })} />
            <Input placeholder="Requirements (comma separated)" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
          </div>
          <Textarea rows={4} placeholder="Job Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex gap-3">
            <button onClick={createJob} disabled={saving}
              className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 transition disabled:opacity-60">
              {saving ? "Saving…" : "Create Job"}
            </button>
            <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Job List */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading jobs…</p>
      ) : jobs.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center text-gray-400">
          <Briefcase size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No jobs yet. Click "Add Job" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job._id ?? job.id} className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-green-300 transition">
              <div className="space-y-1">
                 <button
    onClick={() => deleteJob(job.id)}
    disabled={deletingId === job.id}
    className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-700 transition disabled:opacity-50"
  >
    <Trash2 size={15} />
    {deletingId === job.id ? "Deleting…" : "Delete"}
  </button>
                <p className="font-semibold text-gray-800">{job.title}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Building2 size={12} />{job.company}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                  {job.type && <span className="rounded-full bg-green-50 px-2 py-0.5 text-green-700 font-medium">{job.type}</span>}
                  {job.salary && <span>💰 {job.salary}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
