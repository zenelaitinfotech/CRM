import { useEffect, useState } from "react";
import {
  Target, Eye, Heart, Users,
  Plus, Trash2, Save, RotateCcw, Pencil, X, Check,
} from "lucide-react";

// ── Icon map ──────────────────────────────────────────────────────────────────
const ICON_OPTIONS = [
  { name: "Target", component: Target },
  { name: "Eye",    component: Eye    },
  { name: "Heart",  component: Heart  },
  { name: "Users",  component: Users  },
];
const iconMap: Record<string, React.ElementType> = Object.fromEntries(
  ICON_OPTIONS.map((i) => [i.name, i.component])
);

interface Card { icon: string; title: string; desc: string; }
interface AboutData { heading: string; content: string; description: string; cards: Card[]; }

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ message, type }: { message: string; type: "success" | "error" }) => (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-white shadow-xl transition-all ${type === "success" ? "bg-green-600" : "bg-red-500"}`}>
    {type === "success" ? <Check size={15} /> : <X size={15} />}
    {message}
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const AdminAbout = () => {
  const API = "https://crm-lz8h.onrender.com/api/admin/about";

  const [hero,         setHero]         = useState({ heading: "", content: "", description: "" });
  const [heroOriginal, setHeroOriginal] = useState({ heading: "", content: "", description: "" });
  const [heroEditing,  setHeroEditing]  = useState(false);

  const [cards,         setCards]         = useState<Card[]>([]);
  const [showNewForm,   setShowNewForm]   = useState(false);
  const [newCard,       setNewCard]       = useState<Card>({ icon: "Target", title: "", desc: "" });
  const [editingIndex,  setEditingIndex]  = useState<number | null>(null);
  const [editDraft,     setEditDraft]     = useState<Card>({ icon: "Target", title: "", desc: "" });

  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((data: AboutData) => {
        const h = { heading: data.heading, content: data.content, description: data.description };
        setHero(h);
        setHeroOriginal(h);
        setCards(data.cards || []);
      })
      .catch(() => showToast("Failed to load about data", "error"))
      .finally(() => setLoading(false));
  }, []);

  // ── Save Hero ──────────────────────────────────────────────────────────────
  const saveHero = async () => {
    if (!hero.heading || !hero.content) { showToast("Heading and content are required", "error"); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API}/hero`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hero),
      });
      if (!res.ok) throw new Error();
      setHeroOriginal({ ...hero });
      setHeroEditing(false);
      showToast("Hero section saved successfully!");
    } catch { showToast("Failed to save hero section", "error"); }
    finally { setSaving(false); }
  };

  // ── Save Cards to DB ───────────────────────────────────────────────────────
  const persistCards = async (updated: Card[]) => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/cards`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards: updated }),
      });
      if (!res.ok) throw new Error();
      setCards(updated);
      showToast("Cards saved successfully!");
    } catch { showToast("Failed to save cards", "error"); }
    finally { setSaving(false); }
  };

  // ── Card Actions ───────────────────────────────────────────────────────────
  const addCard = async () => {
    if (!newCard.title.trim() || !newCard.desc.trim()) { showToast("Title and description are required", "error"); return; }
    await persistCards([...cards, newCard]);
    setNewCard({ icon: "Target", title: "", desc: "" });
    setShowNewForm(false);
  };

  const deleteCard = async (i: number) => {
    if (!window.confirm("Delete this card?")) return;
    await persistCards(cards.filter((_, idx) => idx !== i));
  };

  const saveEditCard = async () => {
    if (!editDraft.title.trim() || !editDraft.desc.trim()) { showToast("Title and description are required", "error"); return; }
    await persistCards(cards.map((c, i) => (i === editingIndex ? editDraft : c)));
    setEditingIndex(null);
  };

  if (loading)
    return <div className="flex h-64 items-center justify-center text-gray-400 text-sm">Loading about page data…</div>;

  return (
    <div className="space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Page header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Edit About Page</h2>
        <p className="mt-1 text-sm text-gray-500">All changes are saved to the database and reflected on the public About page instantly.</p>
      </div>

      {/* ── HERO SECTION ──────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="font-semibold text-gray-700">Hero Section</h3>
            <p className="text-xs text-gray-400">Page heading and description paragraphs</p>
          </div>
          {!heroEditing ? (
            <button onClick={() => setHeroEditing(true)}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition">
              <Pencil size={14} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => { setHero({ ...heroOriginal }); setHeroEditing(false); }}
                className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition">
                <RotateCcw size={14} /> Cancel
              </button>
              <button onClick={saveHero} disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition disabled:opacity-60">
                <Save size={14} /> {saving ? "Saving…" : "Save"}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-5 px-6 py-5">
          {[
            { key: "heading",     label: "Page Heading",            rows: 1  },
            { key: "content",     label: "Paragraph 1 (content)",   rows: 4  },
            { key: "description", label: "Paragraph 2 (description)",rows: 4 },
          ].map(({ key, label, rows }) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">{label}</label>
              {heroEditing ? (
                rows === 1 ? (
                  <input type="text" value={(hero as any)[key]}
                    onChange={(e) => setHero({ ...hero, [key]: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500" />
                ) : (
                  <textarea rows={rows} value={(hero as any)[key]}
                    onChange={(e) => setHero({ ...hero, [key]: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500" />
                )
              ) : (
                <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm leading-relaxed text-gray-700 min-h-[2.5rem]">
                  {(hero as any)[key] || <span className="italic text-gray-400">Empty</span>}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── VALUE CARDS ───────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="font-semibold text-gray-700">Mission / Vision Cards</h3>
            <p className="text-xs text-gray-400">Saved as JSON — add, edit or delete cards freely</p>
          </div>
          <button onClick={() => { setShowNewForm(true); setEditingIndex(null); }} disabled={showNewForm || editingIndex !== null}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition disabled:opacity-50">
            <Plus size={14} /> Add Card
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {/* New card form */}
          {showNewForm && (
            <CardForm draft={newCard} onChange={setNewCard}
              onSave={addCard} onCancel={() => { setShowNewForm(false); setNewCard({ icon: "Target", title: "", desc: "" }); }}
              saving={saving} isNew />
          )}

          {cards.length === 0 && !showNewForm && (
            <p className="px-6 py-10 text-center text-sm text-gray-400">No cards yet. Click "Add Card" to create one.</p>
          )}

          {cards.map((card, index) =>
            editingIndex === index ? (
              <CardForm key={index} draft={editDraft} onChange={setEditDraft}
                onSave={saveEditCard} onCancel={() => setEditingIndex(null)} saving={saving} />
            ) : (
              <CardRow key={index} card={card}
                onEdit={() => { setEditingIndex(index); setEditDraft({ ...card }); }}
                onDelete={() => deleteCard(index)}
                disabled={showNewForm || editingIndex !== null} />
            )
          )}
        </div>
      </div>

      {/* ── LIVE PREVIEW ──────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="font-semibold text-gray-700">Live Preview</h3>
          <p className="text-xs text-gray-400">Approximate look of the public About page</p>
        </div>
        <div className="bg-green-700 px-8 py-10 text-center text-white">
          <h1 className="mb-3 text-2xl font-bold">{hero.heading || "Page Heading"}</h1>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed opacity-90">{hero.content}</p>
          {hero.description && <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed opacity-90">{hero.description}</p>}
        </div>
        <div className="grid gap-4 p-8 md:grid-cols-2">
          {cards.map((card, i) => {
            const IconComp = iconMap[card.icon] ?? Target;
            return (
              <div key={i} className="rounded-lg border border-gray-200 p-5">
                <IconComp className="mb-2 h-7 w-7 text-gray-700" />
                <h3 className="mb-1 font-bold text-gray-800">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Card Row ──────────────────────────────────────────────────────────────────
const CardRow = ({ card, onEdit, onDelete, disabled }: { card: Card; onEdit: () => void; onDelete: () => void; disabled: boolean }) => {
  const IconComp = iconMap[card.icon] ?? Target;
  return (
    <div className="flex items-start gap-4 px-6 py-4">
      <div className="mt-1 rounded-lg bg-green-50 p-2 shrink-0">
        <IconComp className="h-5 w-5 text-green-700" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-800">{card.title}</p>
        <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">{card.desc}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button onClick={onEdit} disabled={disabled} title="Edit"
          className="rounded-lg border border-gray-300 p-2 text-gray-500 hover:border-green-500 hover:text-green-600 transition disabled:opacity-40">
          <Pencil size={14} />
        </button>
        <button onClick={onDelete} disabled={disabled} title="Delete"
          className="rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-40">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

// ── Card Form ─────────────────────────────────────────────────────────────────
const CardForm = ({ draft, onChange, onSave, onCancel, saving, isNew = false }: {
  draft: Card; onChange: (d: Card) => void;
  onSave: () => void; onCancel: () => void;
  saving: boolean; isNew?: boolean;
}) => (
  <div className="space-y-4 bg-green-50/40 px-6 py-5">
    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">{isNew ? "➕ New Card" : "✏️ Editing Card"}</p>

    {/* Icon Picker */}
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500">Icon</label>
      <div className="flex flex-wrap gap-2">
        {ICON_OPTIONS.map(({ name, component: Icon }) => (
          <button key={name} onClick={() => onChange({ ...draft, icon: name })}
            className={`flex flex-col items-center gap-1 rounded-lg border-2 px-3 py-2 text-xs transition ${draft.icon === name ? "border-green-600 bg-green-600 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-green-400"}`}>
            <Icon size={16} />{name}
          </button>
        ))}
      </div>
    </div>

    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500">Title</label>
      <input type="text" value={draft.title} placeholder="e.g. Our Mission" onChange={(e) => onChange({ ...draft, title: e.target.value })}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500" />
    </div>

    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500">Description</label>
      <textarea rows={3} value={draft.desc} placeholder="Write a short description…" onChange={(e) => onChange({ ...draft, desc: e.target.value })}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500" />
    </div>

    <div className="flex gap-2">
      <button onClick={onCancel}
        className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition">
        <X size={14} /> Cancel
      </button>
      <button onClick={onSave} disabled={saving}
        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition disabled:opacity-60">
        <Save size={14} /> {saving ? "Saving…" : isNew ? "Add Card" : "Update Card"}
      </button>
    </div>
  </div>
);

export default AdminAbout;
