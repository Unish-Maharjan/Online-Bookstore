import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SERVER_URL = "https://bookstore-backend-1-nc4r.onrender.com";

const Addbooks = () => {
  const navigate = useNavigate();

  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    rating: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const inputStyle =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";


  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

 
  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  }


  function clearForm() {
    setFormData({
      title: "",
      author: "",
      price: "",
      description: "",
      category: "",
      stock: "",
      rating: "",
    });

    setImageFile(null);
    setPreviewImage("");
  }

  // Submit form
  async function handleSubmit(e) {
    e.preventDefault();

    const { title, author, price, description, rating } = formData;

    if (!title || !author || !price || !description || !rating) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        navigate("/user");
        return;
      }

      const bookData = new FormData();

    
      Object.keys(formData).forEach((key) => {
        bookData.append(key, formData[key]);
      });

      if (imageFile) {
        bookData.append("image", imageFile);
      }

      const response = await fetch(`${SERVER_URL}/books`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: bookData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add book");
      }

      toast.success("Book added successfully");
      clearForm();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-800">
          Add New Book
        </h1>

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
            <label className="block mb-1 text-sm font-medium">
              Book Title *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              className={inputStyle}
              required
            />
          </div>

     
          <div>
            <label className="block mb-1 text-sm font-medium">
              Author *
            </label>

            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Price *
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              step="0.01"
              className={inputStyle}
              required
            />
          </div>

          
          <div>
            <label className="block mb-1 text-sm font-medium">
              Rating *
            </label>

            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="e.g. 4.5"
              min="0"
              max="5"
              step="0.1"
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Fiction, Science..."
              className={inputStyle}
            />
          </div>

        
          <div>
            <label className="block mb-1 text-sm font-medium">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Available quantity"
              min="0"
              className={inputStyle}
            />
          </div>
        </div>

   
        <div className="mt-5">
          <label className="block mb-2 text-sm font-medium">
            Cover Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm"
          />

    
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-4 w-40 h-56 object-cover rounded-lg shadow"
            />
          )}
        </div>

       
        <div className="mt-5">
          <label className="block mb-2 text-sm font-medium">
            Description *
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Write book description"
            className={`${inputStyle} resize-none`}
            required
          />
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