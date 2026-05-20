import React, { useState } from 'react'
import { useAddBookMutation } from '../services/bookApi'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Addbooks = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    description: '',
    image: '',
    category: '',
    stock: '',
    rating: '',
  })

  const [addBook, { isLoading }] = useAddBookMutation()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.author || !formData.price || !formData.description || !formData.rating) {
      toast.error('Please fill in all required fields')
      return
    }
    try {
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: formData.stock ? parseInt(formData.stock) : 0,
        rating: parseFloat(formData.rating),
      }
      await addBook(bookData).unwrap()
      toast.success('Book added successfully!')
      setFormData({ title: '', author: '', price: '', description: '', image: '', category: '', stock: '', rating: '' })
    } catch (error) {
      toast.error(error.data?.message || 'Failed to add book')
      console.error('Error adding book:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/user')
  }

  const clearForm = () =>
    setFormData({ title: '', author: '', price: '', description: '', image: '', category: '', stock: '', rating: '' })

  return (
    <div className='w-full max-w-2xl mx-auto px-4 py-8 sm:py-12'>
      <div className='flex flex-wrap items-center justify-between gap-3 mb-8'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>Add New Book</h1>
        <button
          onClick={handleLogout}
          className='flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-200 text-sm sm:text-base'
        >
          <i className='fa-solid fa-right-from-bracket'></i>
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className='bg-white p-5 sm:p-8 rounded-xl shadow-lg'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-5'>
          <div className='mb-5'>
            <label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-1.5'>
              Book Title <span className='text-red-500'>*</span>
            </label>
            <input type='text' id='title' name='title' value={formData.title} onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base'
              placeholder='Enter book title' required />
          </div>

          <div className='mb-5'>
            <label htmlFor='author' className='block text-sm font-medium text-gray-700 mb-1.5'>
              Author <span className='text-red-500'>*</span>
            </label>
            <input type='text' id='author' name='author' value={formData.author} onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base'
              placeholder='Enter author name' required />
          </div>

          <div className='mb-5'>
            <label htmlFor='price' className='block text-sm font-medium text-gray-700 mb-1.5'>
              Price <span className='text-red-500'>*</span>
            </label>
            <input type='number' id='price' name='price' value={formData.price} onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base'
              placeholder='Enter price' step='0.01' min='0' required />
          </div>

          <div className='mb-5'>
            <label htmlFor='rating' className='block text-sm font-medium text-gray-700 mb-1.5'>
              Rating <span className='text-red-500'>*</span>
            </label>
            <input type='number' id='rating' name='rating' value={formData.rating} onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base'
              placeholder='e.g. 4.5' step='0.1' min='0' max='5' required />
          </div>

          <div className='mb-5'>
            <label htmlFor='category' className='block text-sm font-medium text-gray-700 mb-1.5'>Category</label>
            <input type='text' id='category' name='category' value={formData.category} onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base'
              placeholder='e.g., Fiction, Science, History' />
          </div>

          <div className='mb-5'>
            <label htmlFor='stock' className='block text-sm font-medium text-gray-700 mb-1.5'>Stock Quantity</label>
            <input type='number' id='stock' name='stock' value={formData.stock} onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base'
              placeholder='Enter stock quantity' min='0' />
          </div>
        </div>

        <div className='mb-5'>
          <label htmlFor='image' className='block text-sm font-medium text-gray-700 mb-1.5'>Image URL</label>
          <input type='url' id='image' name='image' value={formData.image} onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base'
            placeholder='Enter image URL' />
        </div>

        <div className='mb-6'>
          <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-1.5'>
            Description <span className='text-red-500'>*</span>
          </label>
          <textarea id='description' name='description' value={formData.description} onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base'
            placeholder='Enter book description' rows='4' required />
        </div>

        <div className='flex flex-col sm:flex-row gap-3'>
          <button type='submit' disabled={isLoading}
            className='flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-200 text-sm sm:text-base'>
            {isLoading ? 'Adding Book...' : 'Add Book'}
          </button>
          <button type='button' onClick={clearForm}
            className='flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition duration-200 text-sm sm:text-base'>
            Clear
          </button>
        </div>
      </form>
    </div>
  )
}

export default Addbooks