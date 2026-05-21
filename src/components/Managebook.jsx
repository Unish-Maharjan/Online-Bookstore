import { useState, useEffect } from "react";
import { Link } from "react-router";


const SERVER_URL = "https://bookstore-backend-1-nc4r.onrender.com";


function getSavedToken() {
  return localStorage.getItem("token");
}

function EditPopup({ book, onClose, onSaved }) {

  // one variable for each field in the form
  const [title, setTitle] = useState(book.title || "");
  const [author, setAuthor] = useState(book.author || "");
  const [category, setCategory] = useState(book.category || "");
  const [price, setPrice] = useState(book.price || "");
  const [stock, setStock] = useState(book.stock || "");
  const [rating, setRating] = useState(book.rating || "");
  const [description, setDescription] = useState(book.description || "");
  const [newImage, setNewImage] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function saveChanges(e) {
    e.preventDefault(); 
    setIsSaving(true);
    setErrorMessage("");

    try {
      const token = getSavedToken();

   
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("rating", rating);
      formData.append("description", description);
      if (newImage) formData.append("image", newImage);

     
      const response = await fetch(`${SERVER_URL}/books/${book._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Could not update the book.");
      }

      const updatedBook = await response.json();
      onSaved(updatedBook); 
      onClose();            
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(15,23,42,0.55)]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Edit Book</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg">✕</button>
        </div>

  
        <form onSubmit={saveChanges} className="p-6 space-y-4">

         
          {errorMessage && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{errorMessage}</p>
          )}

   
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </label>

          {/* Author field */}
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Author</span>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</span>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>
          </div>

     
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock</span>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rating</span>
              <input
                type="number"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>
          </div>

        
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Cover Image <span className="normal-case text-slate-400">(optional)</span>
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files[0])}
              className="text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function DeletePopup({ book, onClose, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

 
  async function confirmDelete() {
    setIsDeleting(true);
    setErrorMessage("");

    try {
      const token = getSavedToken();

      const response = await fetch(`${SERVER_URL}/books/${book._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Could not delete the book.");
      }

      onDeleted(book._id);
      onClose();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(15,23,42,0.55)]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">

        
        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-2xl mx-auto">🗑️</div>

      
        <h2 className="text-center text-lg font-bold text-slate-800">Delete Book?</h2>
        <p className="text-center text-sm text-slate-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-700">"{book.title}"</span>?
          This cannot be undone.
        </p>

      
        {errorMessage && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg text-center">{errorMessage}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            disabled={isDeleting}
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-60"
          >
            {isDeleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManageBooks() {
  const [bookList, setBookList] = useState([]);      
  const [isLoading, setIsLoading] = useState(true);  
  const [loadError, setLoadError] = useState("");    
  const [searchText, setSearchText] = useState("");  
  const [bookToEdit, setBookToEdit] = useState(null); 
  const [bookToDelete, setBookToDelete] = useState(null);

  
  useEffect(function () {
    async function loadBooks() {
      try {
        const response = await fetch(`${SERVER_URL}/books`);
        if (!response.ok) throw new Error("Could not load books from the server.");
        const data = await response.json();
        setBookList(data);
      } catch (err) {
        setLoadError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadBooks();
  }, []); 

  function updateBookInList(updatedBook) {
    setBookList(function (currentList) {
      return currentList.map(function (book) {
        if (book._id === updatedBook._id) return updatedBook;
        return book; 
      });
    });
  }

  function removeBookFromList(deletedId) {
    setBookList(function (currentList) {
      return currentList.filter(function (book) {
        return book._id !== deletedId; // keep all books except the deleted one
      });
    });
  }

  const visibleBooks = bookList.filter(function (book) {
    const query = searchText.toLowerCase();
    const titleMatch = book.title?.toLowerCase().includes(query);
    const authorMatch = book.author?.toLowerCase().includes(query);
    return titleMatch || authorMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-[Poppins] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manage Books</h1>
            <p className="text-slate-400 text-sm mt-1">View, edit, and manage your book inventory</p>
          </div>
          <Link to="/addbooks">
            <button className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-md bg-purple-500 hover:bg-purple-600 transition">
              + Add New Book
            </button>
          </Link>
        </div>

    
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3">
          <div className="flex items-center gap-3 text-slate-400">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {isLoading && (
          <p className="text-center text-slate-400 py-16">Loading books…</p>
        )}

  
        {loadError && (
          <p className="text-center text-red-500 py-8">{loadError}</p>
        )}

        {!isLoading && !loadError && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">


            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["Book", "Author", "Category", "Price", "Stock", "Rating", "Actions"].map((heading) => (
                      <th key={heading} className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
            
                  {visibleBooks.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-slate-400 text-sm">
                        No books found.
                      </td>
                    </tr>
                  )}

            
                  {visibleBooks.map(function (book) {
                    return (
                      <tr key={book._id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">

                        {/* Book cover + title */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={book.image}
                              alt={book.title}
                              className="w-10 h-14 object-cover rounded-lg shadow-sm shrink-0"
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                            <span className="font-semibold text-slate-800">{book.title}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-500">{book.author}</td>

                   
                        <td className="px-5 py-4">
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                            {book.category}
                          </span>
                        </td>

                        <td className="px-5 py-4 font-bold text-slate-800">${Number(book.price).toFixed(2)}</td>
                        <td className="px-5 py-4 text-slate-500">{book.stock}</td>
                        <td className="px-5 py-4 text-amber-500 font-semibold">★ {book.rating}</td>

                  
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setBookToEdit(book)}
                              className="p-2 rounded-xl text-indigo-500 hover:bg-indigo-50 transition"
                              title="Edit"
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button
                              onClick={() => setBookToDelete(book)}
                              className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition"
                              title="Delete"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          
            <div className="sm:hidden divide-y divide-slate-50">
              {visibleBooks.length === 0 && (
                <p className="text-center py-16 text-slate-400 text-sm">No books found.</p>
              )}

              {visibleBooks.map(function (book) {
                return (
                  <div key={book._id} className="flex items-start gap-3 p-4">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded-lg shadow-sm shrink-0"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{book.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{book.author}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {book.category}
                        </span>
                        <span className="text-xs font-bold text-slate-800">${Number(book.price).toFixed(2)}</span>
                        <span className="text-xs text-slate-400">Stock: {book.stock}</span>
                        <span className="text-xs text-amber-500 font-semibold">★ {book.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => setBookToEdit(book)}
                        className="p-2 rounded-xl text-indigo-500 hover:bg-indigo-50 transition"
                      >
                        <i className="fa-solid fa-pen-to-square text-sm"></i>
                      </button>
                      <button
                        onClick={() => setBookToDelete(book)}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition"
                      >
                        <i className="fa-solid fa-trash text-sm"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

     
        {!isLoading && !loadError && (
          <p className="text-xs text-slate-400 text-right">
            Showing {visibleBooks.length} of {bookList.length} books
          </p>
        )}
      </div>

      {bookToEdit && (
        <EditPopup
          book={bookToEdit}
          onClose={() => setBookToEdit(null)}
          onSaved={updateBookInList}
        />
      )}

      {bookToDelete && (
        <DeletePopup
          book={bookToDelete}
          onClose={() => setBookToDelete(null)}
          onDeleted={removeBookFromList}
        />
      )}
    </div>
  );
}