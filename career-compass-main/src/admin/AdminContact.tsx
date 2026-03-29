import { useEffect, useState } from "react";
import { Pencil, Save, X, Loader2 } from "lucide-react";

interface ContactInfo {
  email: string;
  phone: string;
  office_address: string;
  off_address: string;
}

const defaultInfo: ContactInfo = { email: "", phone: "", office_address: "", off_address: "" };

const AdminContact = () => {
  const [info, setInfo] = useState<ContactInfo>(defaultInfo);
  const [draft, setDraft] = useState<ContactInfo>(defaultInfo);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("https://crm-lz8h.onrender.com/admin/contact-info")
      .then((r) => r.json())
      .then((data) => {
        if (data?.email) { setInfo(data); setDraft(data); }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!draft.email || !draft.phone || !draft.office_address || !draft.off_address) {
      showToast("error", "All fields are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("https://crm-lz8h.onrender.com/admin/contact-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (res.ok) {
        setInfo(draft);
        setEditing(false);
        showToast("success", "Contact details saved successfully.");
      } else {
        showToast("error", data.error || "Failed to save.");
      }
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const fields: { key: keyof ContactInfo; label: string; type: "input" | "textarea" | "email" }[] = [
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone", type: "input" },
    { key: "office_address", label: "Office Address", type: "textarea" },
    { key: "off_address", label: "Off Address", type: "textarea" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Contact</h2>
        <p className="mt-1 text-sm text-gray-500">
          All changes are saved to the database and reflected on the public Contact page instantly.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`rounded-lg px-4 py-3 text-sm font-medium border ${
          toast.type === "success"
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-red-50 text-red-700 border-red-200"
        }`}>
          {toast.text}
        </div>
      )}

      {/* Contact Details Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Card Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-gray-800">Contact Details</h3>
            <p className="text-sm text-gray-400 mt-0.5">
              Email, phone and addresses shown on the public Contact page
            </p>
          </div>
          {!editing ? (
            <button
              onClick={() => { setDraft(info); setEditing(true); }}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => { setDraft(info); setEditing(false); }}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading contact details...
          </div>
        ) : (
          <div className="space-y-5">
            {fields.map(({ key, label, type }) => (
              <div key={key}>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {label}
                </p>
                {editing ? (
                  type === "textarea" ? (
                    <textarea
                      rows={2}
                      value={draft[key]}
                      onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      type={type === "email" ? "email" : "text"}
                      value={draft[key]}
                      onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  )
                ) : (
                  <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                    {info[key] || <span className="italic text-gray-300">Empty</span>}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submissions placeholder */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Contact Submissions</h3>
          <p className="text-sm text-gray-400 mt-0.5">Messages submitted via the Contact page form</p>
        </div>
        <div className="mt-4 rounded-xl border-2 border-dashed border-gray-200 py-14 text-center">
          <p className="text-sm text-gray-400">Contact submissions management coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminContact;
