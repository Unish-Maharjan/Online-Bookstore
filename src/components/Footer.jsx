import React from 'react'
import { Link } from 'react-router'

const Footer = () => {
  return (
    <footer className='bg-[#1e2939] text-white font-[Poppins]'>
      <div className='max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10'>

        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-2 text-xl'>
            <i className="fa-solid fa-book-open text-indigo-400"></i>
            <p className='font-bold'>BookStore</p>
          </div>
          <p className='text-gray-400 text-sm leading-relaxed'>
            Your one-stop shop for amazing books. Discover, read, and grow.
          </p>
        </div>

        <div className='flex flex-col gap-3'>
          <p className='font-semibold text-white text-[15px]'>Quick Links</p>
          <Link to='/home' className='text-gray-400 text-sm hover:text-indigo-400 transition-colors duration-200 w-fit'>Home</Link>
          <Link to='/books' className='text-gray-400 text-sm hover:text-indigo-400 transition-colors duration-200 w-fit'>Books</Link>
          <Link to='/cart' className='text-gray-400 text-sm hover:text-indigo-400 transition-colors duration-200 w-fit'>Cart</Link>
          <Link to='/user' className='text-gray-400 text-sm hover:text-indigo-400 transition-colors duration-200 w-fit'>My Account</Link>
        </div>

        <div className='flex flex-col gap-3'>
          <p className='font-semibold text-white text-[15px]'>Follow Us</p>
          <div className='flex gap-4'>
            <a href='#' className='w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-indigo-500 transition-colors duration-200'>
              <i className="fa-brands fa-facebook-f text-sm"></i>
            </a>
            <a href='#' className='w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-indigo-500 transition-colors duration-200'>
              <i className="fa-brands fa-twitter text-sm"></i>
            </a>
            <a href='#' className='w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-indigo-500 transition-colors duration-200'>
              <i className="fa-brands fa-instagram text-sm"></i>
            </a>
          </div>
        </div>

      </div>

      <div className='border-t border-white/10 py-4 text-center text-gray-500 text-xs px-6'>
        © 2026 BookStore. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer