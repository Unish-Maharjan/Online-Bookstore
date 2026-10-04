import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAddBookMutation } from '../services/bookApi';

class BookFormModel {
  static createInitialState() {
    return {
      title: "",
      author: "",
      price: "",
      description: "",
      category: "",
      stock: "",
      rating: "",
    };
  }

  static validate(formData) {
    const { title, author, price, description, rating } = formData;
    return Boolean(title && author && price && description && rating);
  }

  static buildPayload(formData, imageFile) {
    const bookData = new FormData();
    Object.keys(formData).forEach((key) => {
      bookData.append(key, formData[key]);
    });

    if (imageFile) {
      bookData.append("image", imageFile);
    }

    return bookData;
  }
}

class BookFormService {
  constructor({ addBook, navigate, notify }) {
    this.addBook = addBook;
    this.navigate = navigate;
    this.notify = notify;
  }

  async submit(formData, imageFile) {
    if (!BookFormModel.validate(formData)) {
      this.notify.error("Please fill all required fields");
      return false;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      this.notify.error("Please login first");
      this.navigate("/user");
      return false;
    }

    const bookData = BookFormModel.buildPayload(formData, imageFile);

    try {
      await this.addBook(bookData).unwrap();
      this.notify.success("Book added successfully");
      return true;
    } catch (error) {
      this.notify.error(error?.data?.message || "Something went wrong");
      return false;
    }
  }
}

const Addbooks = () => {
  const navigate = useNavigate();
  const [addBook, { isLoading }] = useAddBookMutation();

  const [formData, setFormData] = useState(BookFormModel.createInitialState());
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const inputStyle =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  const bookFormService = new BookFormService({
    addBook,
    navigate,
    notify: toast,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  }

  function clearForm() {
    setFormData(BookFormModel.createInitialState());
    setImageFile(null);
    setPreviewImage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const isSuccess = await bookFormService.submit(formData, imageFile);

    if (isSuccess) {
      clearForm();
    }
  }

  function handleLogout() {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/user");
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-3xl font-bold text-gray-800">Add New Book</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 sm:p-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 text-sm font-medium">Book Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter book title" className={inputStyle} required />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Author *</label>
            <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Enter author name" className={inputStyle} required />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Price *</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Enter price" min="0" step="0.01" className={inputStyle} required />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Rating *</label>
            <input type="number" name="rating" value={formData.rating} onChange={handleChange} placeholder="e.g. 4.5" min="0" max="5" step="0.1" className={inputStyle} required />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Fiction, Science..." className={inputStyle} />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Stock</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Available quantity" min="0" className={inputStyle} />
          </div>
        </div>

        <div className="mt-5">
          <label className="block mb-2 text-sm font-medium">Cover Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" />
          {previewImage && (
            <img src={previewImage} alt="Preview" className="mt-4 w-40 h-56 object-cover rounded-lg shadow" />
          )}
        </div>

        <div className="mt-5">
          <label className="block mb-2 text-sm font-medium">Description *</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="Write book description" className={`${inputStyle} resize-none`} required />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-400"
          >
            {isLoading ? "Adding Book..." : "Add Book"}
          </button>

          <button
            type="button"
            onClick={clearForm}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default Addbooks;