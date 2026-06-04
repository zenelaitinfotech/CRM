import { useState, useEffect } from "react";
import { Download, FileText, Trash2, Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { API_URL } from "../config";

export default function AdminApplications() {
  const { token } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchApps();
    }
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await axios.delete(`${API_URL}/admin/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error("Failed to delete application:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Applied Jobs</h2>
          <p className="text-sm text-gray-500">Excel-style spreadsheet overview of all incoming job applications</p>
        </div>
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
          {applications.length} Applications
        </span>
      </div>

      {/* Spreadsheet Tabular Table */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-gray-400">Loading applications...</p>
        ) : applications.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-200 py-16 text-center text-gray-400">
            <FileText size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No applications received yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="border-b border-r border-gray-200 px-4 py-3">Applicant Name</th>
                  <th className="border-b border-r border-gray-200 px-4 py-3">Email</th>
                  <th className="border-b border-r border-gray-200 px-4 py-3">Phone</th>
                  <th className="border-b border-r border-gray-200 px-4 py-3">Location</th>
                  <th className="border-b border-r border-gray-200 px-4 py-3">Target Role</th>
                  <th className="border-b border-r border-gray-200 px-4 py-3">Expected Salary</th>
                  <th className="border-b border-r border-gray-200 px-4 py-3">Applied Date</th>
                  <th className="border-b px-4 py-3 text-center">Resume & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="border-r border-gray-200 px-4 py-3 font-semibold text-gray-900">{app.candidate_name}</td>
                    <td className="border-r border-gray-200 px-4 py-3">{app.candidate_email}</td>
                    <td className="border-r border-gray-200 px-4 py-3 whitespace-nowrap">{app.candidate_phone || "N/A"}</td>
                    <td className="border-r border-gray-200 px-4 py-3">{app.candidate_location || "N/A"}</td>
                    <td className="border-r border-gray-200 px-4 py-3">
                      <div className="font-semibold text-gray-800">{app.job_title}</div>
                      <div className="text-xs text-gray-400">{app.job_company}</div>
                    </td>
                    <td className="border-r border-gray-200 px-4 py-3 font-medium text-green-700">{app.expected_salary || "N/A"}</td>
                    <td className="border-r border-gray-200 px-4 py-3 whitespace-nowrap">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {app.candidate_resume ? (
                          <a
                            href={app.candidate_resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 rounded bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700 transition"
                          >
                            <Download size={12} /> Download CV
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No CV uploaded</span>
                        )}
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                          title="Delete Application"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
