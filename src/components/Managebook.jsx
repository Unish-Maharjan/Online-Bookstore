import { useState, useEffect } from "react";
import { Link } from "react-router";

const API_BASE_URL = "https://bookstore-backend-1-nc4r.onrender.com";

// get the login token from localStorage
function getToken() {
  return localStorage.getItem("token");
}



function getCategoryClass(category) {
  if (category === "fiction") return "bg-violet-100 text-violet-700";
  if (category === "self-help") return "bg-blue-100 text-blue-700";
  if (category === "technology") return "bg-emerald-100 text-emerald-700";
  if (category === "science") return "bg-amber-100 text-amber-700";
  if (category === "history") return "bg-rose-100 text-rose-700";
  return "bg-slate-100 text-slate-600";
}


function EditModal({ book, onClose, onSaved }) {

  const [title, setTitle] = useState(book.title || "");
  const [author, setAuthor] = useState(book.author || "");
  const [category, setCategory] = useState(book.category || "");
  const [price, setPrice] = useState(book.price || "");
  const [stock, setStock] = useState(book.stock || "");
  const [rating, setRating] = useState(book.rating || "");
  const [description, setDescription] = useState(book.description || "");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("rating", rating);
      formData.append("description", description);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(`${API_BASE_URL}/books/${book._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // send the token so backend allows the request
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update book");
      }

      const updatedBook = await response.json();
      onSaved(updatedBook); 
      onClose();            
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(15,23,42,0.55)]">
     
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Edit Book</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="grid grid-cols-2 gap-4">

            
            <label className="col-span-2 flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </label>

    
            <label className="col-span-2 flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Author</span>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </label>

       
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</span>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</span>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </label>

  
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock</span>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rating</span>
              <input
                type="number"
                step="0.01"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </label>

            <label className="col-span-2 flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
              />
            </label>

          
            <label className="col-span-2 flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Cover Image <span className="normal-case text-slate-400">(optional — leave blank to keep current)</span>
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </label>

          </div>

       
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 transition"
            >
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}


function DeleteModal({ book, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      const response = await fetch(`${API_BASE_URL}/books/${book._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete book");
      }

      onDeleted(book._id); 
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(15,23,42,0.55)]">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">

        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-2xl mx-auto">🗑️</div>
        <h2 className="text-center text-lg font-bold text-slate-800">Delete Book?</h2>
        <p className="text-center text-sm text-slate-500">
          Are you sure you want to delete <span className="font-semibold text-slate-700">"{book.title}"</span>? This cannot be undone.
        </p>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg text-center">{error}</p>
        )}

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 transition"
          >
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>

      </div>
    </div>
  );
}
export default function ManageBooks() {
  const [books, setBooks] = useState([]);       
  const [loading, setLoading] = useState(true); 
  const [fetchError, setFetchError] = useState(""); 
  const [search, setSearch] = useState("");   
  const [editBook, setEditBook] = useState(null);  
  const [deleteBook, setDeleteBook] = useState(null); 

  // fetch all books when the page loads
  useEffect(function () {
    async function loadBooks() {
      try {
        const response = await fetch(`${API_BASE_URL}/books`);
        if (!response.ok) throw new Error("Failed to fetch books");
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  // after editing replace the old book in the list with the updated one
  function handleSaved(updatedBook) {
    setBooks(function (previousBooks) {
      return previousBooks.map(function (b) {
        return b._id === updatedBook._id ? updatedBook : b;
      });
    });
  }

  // after deleting remove the book from the list
  function handleDeleted(deletedId) {
    setBooks(function (previousBooks) {
      return previousBooks.filter(function (b) {
        return b._id !== deletedId;
      });
    });
  }

  // filter books based on what the user typed in the search box
  const filteredBooks = books.filter(function (book) {
    const query = search.toLowerCase();
    return (
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 font-[Poppins] p-8">
      <div className="max-w-6xl mx-auto space-y-7">

       
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manage Books</h1>
            <p className="text-slate-400 text-sm mt-1">View, edit, and manage your book inventory</p>
          </div>
          <Link to="/addbooks">
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white text-sm 
          font-semibold shadow-md hover:-translate-y-0.5 transition-transform bg-purple-500 ">
            + Add New Book
          </button>
          </Link>
        </div>

  
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4">
          <div className="flex items-center gap-3 text-slate-400">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {!loading && !fetchError && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Book</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Author</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rating</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>

         
                {filteredBooks.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400 text-sm">
                      No books found.
                    </td>
                  </tr>
                )}

               
                {filteredBooks.map(function (book) {
                  return (
                    <tr
                      key={book._id}
                      className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Book cover + title */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-10 object-cover rounded-lg shadow-sm shrink-0"
                            style={{ height: "52px" }}
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                          <span className="font-semibold text-slate-800 leading-tight">{book.title}</span>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="px-5 py-4 text-slate-500">{book.author}</td>

                      {/* Category badge */}
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryClass(book.category)}`}>
                          {book.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 font-bold text-slate-800">
                        ${Number(book.price).toFixed(2)}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4 text-slate-500">{book.stock}</td>

                      {/* Rating */}
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-amber-500 font-semibold">
                          ★ {book.rating}
                        </span>
                      </td>

                      {/* Edit and Delete buttons */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditBook(book)}
                            className="p-2 rounded-xl text-indigo-500 hover:bg-indigo-50 transition-colors"
                            title="Edit"
                          >
                            <i class="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button
                            onClick={() => setDeleteBook(book)}
                            className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <i class="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              </tbody>
            </table>
          )}
        </div>

        
        {!loading && !fetchError && (
          <p className="text-xs text-slate-400 text-right">
            Showing {filteredBooks.length} of {books.length} books
          </p>
        )}

      </div>


      {editBook && (
        <EditModal
          book={editBook}
          onClose={() => setEditBook(null)}
          onSaved={handleSaved}
        />
      )}

      {deleteBook && (
        <DeleteModal
          book={deleteBook}
          onClose={() => setDeleteBook(null)}
          onDeleted={handleDeleted}
        />
      )}


    </div>
  );
}