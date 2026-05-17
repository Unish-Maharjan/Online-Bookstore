import { useState, useEffect } from "react";

const API_BASE_URL = "https://bookstore-backend-1-nc4r.onrender.com";

// ── tiny reusable icon components ──────────────────────────────────────────
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── category badge colours ──────────────────────────────────────────────────
const categoryStyle = {
  fiction:     "bg-violet-100 text-violet-700",
  "self-help": "bg-blue-100 text-blue-700",
  technology:  "bg-emerald-100 text-emerald-700",
  science:     "bg-amber-100 text-amber-700",
  history:     "bg-rose-100 text-rose-700",
};

const badgeClass = (cat) =>
  `text-xs font-semibold px-3 py-1 rounded-full ${categoryStyle[cat] ?? "bg-slate-100 text-slate-600"}`;

// ── Edit Modal ──────────────────────────────────────────────────────────────
function EditModal({ book, onClose, onSaved }) {
  const [form, setForm] = useState({
    title:    book.title    ?? "",
    author:   book.author   ?? "",
    category: book.category ?? "",
    price:    book.price    ?? "",
    stock:    book.stock    ?? "",
    rating:   book.rating   ?? "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      if (imageFile) body.append("image", imageFile);

      const res = await fetch(`${API_BASE_URL}/books/${book._id}`, {
        method: "PUT",
        body,
      });
      if (!res.ok) throw new Error("Failed to update book");
      const updated = await res.json();
      onSaved(updated);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-[fadeUp_.22s_ease]">

        {/* header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Edit Book</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Title",    name: "title",    type: "text",   colSpan: true },
              { label: "Author",   name: "author",   type: "text",   colSpan: true },
              { label: "Category", name: "category", type: "text" },
              { label: "Price",    name: "price",    type: "number" },
              { label: "Stock",    name: "stock",    type: "number" },
              { label: "Rating",   name: "rating",   type: "number" },
            ].map(({ label, name, type, colSpan }) => (
              <label key={name} className={`flex flex-col gap-1 ${colSpan ? "col-span-2" : ""}`}>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
                <input
                  name={name}
                  type={type}
                  step={name === "price" || name === "rating" ? "0.01" : undefined}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </label>
            ))}

            {/* image upload */}
            <label className="col-span-2 flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Cover Image <span className="normal-case text-slate-400">(optional — leave blank to keep current)</span>
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-4
                           file:rounded-lg file:border-0 file:text-xs file:font-semibold
                           file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600
                         border border-slate-200 hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white
                         bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 transition">
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ────────────────────────────────────────────────────
function DeleteModal({ book, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/books/${book._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete book");
      onDeleted(book._id);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 animate-[fadeUp_.22s_ease]">
        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-2xl mx-auto">🗑️</div>
        <h2 className="text-center text-lg font-bold text-slate-800">Delete Book?</h2>
        <p className="text-center text-sm text-slate-500">
          Are you sure you want to delete <span className="font-semibold text-slate-700">"{book.title}"</span>?
          This action cannot be undone.
        </p>
        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg text-center">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-slate-600
                       border border-slate-200 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-white
                       bg-red-500 hover:bg-red-600 disabled:opacity-60 transition">
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function ManageBooks() {
  const [books, setBooks]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch]         = useState("");
  const [editBook, setEditBook]     = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);

  // fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/books`);
        if (!res.ok) throw new Error("Failed to fetch books");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // update book in local state after edit
  const handleSaved = (updated) =>
    setBooks((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));

  // remove book from local state after delete
  const handleDeleted = (id) =>
    setBooks((prev) => prev.filter((b) => b._id !== id));

  const filtered = books.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-[Poppins] p-8">
      <div className="max-w-6xl mx-auto space-y-7">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manage Books</h1>
            <p className="text-slate-400 text-sm mt-1">View, edit, and manage your book inventory</p>
          </div>
          <button
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white text-sm font-semibold
                       shadow-md hover:-translate-y-0.5 transition-transform"
            style={{ background: "linear-gradient(135deg, #5e3fd9, #6d52ed)" }}
          >
            + Add New Book
          </button>
        </div>

        {/* ── Search ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4">
          <div className="flex items-center gap-3 text-slate-400">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
              Loading books…
            </div>
          ) : fetchError ? (
            <div className="flex items-center justify-center py-20 text-red-500 text-sm">
              {fetchError}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Book", "Author", "Category", "Price", "Stock", "Rating", "Actions"].map((h) => (
                    <th key={h}
                      className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400 text-sm">
                      No books found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((book) => (
                    <tr key={book._id}
                      className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">

                      {/* Book */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-10 h-13 object-cover rounded-lg shadow-sm shrink-0"
                            style={{ height: "52px" }}
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                          <span className="font-semibold text-slate-800 leading-tight">{book.title}</span>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="px-5 py-4 text-slate-500">{book.author}</td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className={badgeClass(book.category)}>{book.category}</span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 font-bold text-slate-800">${Number(book.price).toFixed(2)}</td>

                      {/* Stock */}
                      <td className="px-5 py-4 text-slate-500">{book.stock}</td>

                      {/* Rating */}
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-amber-500 font-semibold">
                          ★ {book.rating}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditBook(book)}
                            className="p-2 rounded-xl text-indigo-500 hover:bg-indigo-50 transition-colors"
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => setDeleteBook(book)}
                            className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* book count */}
        {!loading && !fetchError && (
          <p className="text-xs text-slate-400 text-right">
            Showing {filtered.length} of {books.length} books
          </p>
        )}
      </div>

      {/* ── Modals ── */}
      {editBook   && <EditModal   book={editBook}   onClose={() => setEditBook(null)}   onSaved={handleSaved}   />}
      {deleteBook && <DeleteModal book={deleteBook} onClose={() => setDeleteBook(null)} onDeleted={handleDeleted} />}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}