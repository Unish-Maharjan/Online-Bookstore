import React, { useState } from 'react'
import { useAddBookMutation } from '../services/bookApi'
import toast from 'react-hot-toast'

const Addbooks = () => {
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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

      setFormData({
        title: '',
        author: '',
        price: '',
        description: '',
        image: '',
        category: '',
        stock: '',
        rating: '',
      })
    } catch (error) {
      toast.error(error.data?.message || 'Failed to add book')
      console.error('Error adding book:', error)
    }
  }

  return (
    <div className='container my-10 px-4 py-10'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8 text-gray-800'>Add New Book</h1>

        <form onSubmit={handleSubmit} className='bg-white p-8 rounded-lg shadow-lg'>
          {/* Title */}
          <div className='mb-6'>
            <label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-2'>
              Book Title <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter book title'
              required
            />
          </div>

          {/* Author */}
          <div className='mb-6'>
            <label htmlFor='author' className='block text-sm font-medium text-gray-700 mb-2'>
              Author <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='author'
              name='author'
              value={formData.author}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter author name'
              required
            />
          </div>

          {/* Price */}
          <div className='mb-6'>
            <label htmlFor='price' className='block text-sm font-medium text-gray-700 mb-2'>
              Price <span className='text-red-500'>*</span>
            </label>
            <input
              type='number'
              id='price'
              name='price'
              value={formData.price}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter price'
              step='0.01'
              min='0'
              required
            />
          </div>

          {/* Rating */}
          <div className='mb-6'>
            <label htmlFor='rating' className='block text-sm font-medium text-gray-700 mb-2'>
              Rating <span className='text-red-500'>*</span>
            </label>
            <input
              type='number'
              id='rating'
              name='rating'
              value={formData.rating}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter rating (e.g. 4.5)'
              step='0.1'
              min='0'
              max='5'
              required
            />
          </div>

          {/* Description */}
          <div className='mb-6'>
            <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-2'>
              Description <span className='text-red-500'>*</span>
            </label>
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
              placeholder='Enter book description'
              rows='4'
              required
            />
          </div>

          {/* Image URL */}
          <div className='mb-6'>
            <label htmlFor='image' className='block text-sm font-medium text-gray-700 mb-2'>
              Image URL
            </label>
            <input
              type='url'
              id='image'
              name='image'
              value={formData.image}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter image URL'
            />
          </div>

          {/* Category */}
          <div className='mb-6'>
            <label htmlFor='category' className='block text-sm font-medium text-gray-700 mb-2'>
              Category
            </label>
            <input
              type='text'
              id='category'
              name='category'
              value={formData.category}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='e.g., Fiction, Science, History'
            />
          </div>

          {/* Stock */}
          <div className='mb-6'>
            <label htmlFor='stock' className='block text-sm font-medium text-gray-700 mb-2'>
              Stock Quantity
            </label>
            <input
              type='number'
              id='stock'
              name='stock'
              value={formData.stock}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter stock quantity'
              min='0'
            />
          </div>

          {/* Buttons */}
          <div className='flex gap-4'>
            <button
              type='submit'
              disabled={isLoading}
              className='flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-200'
            >
              {isLoading ? 'Adding Book...' : 'Add Book'}
            </button>
            <button
              type='button'
              onClick={() => setFormData({
                title: '',
                author: '',
                price: '',
                description: '',
                image: '',
                category: '',
                stock: '',
                rating: '',
              })}
              className='flex-1 bg-gray-400 text-white font-semibold py-3 rounded-lg hover:bg-gray-500 transition duration-200'
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Addbooks