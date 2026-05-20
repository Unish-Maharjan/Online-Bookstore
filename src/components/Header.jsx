import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useCart } from './CartContext'

const Header = () => {
  const navigate = useNavigate();
  const { state } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const admin = JSON.parse(localStorage.getItem('admin') || 'null');

  const handleUserClick = () => {
  setMenuOpen(false);

  if (admin) {
    navigate('/admin-dashboard');
  } else {
    navigate('/user');
  }
  };

  return (
    <header className='sticky top-0 w-full bg-[#ffffff]/90 text-black px-5 py-4 font-[Poppins] backdrop-blur-lg z-50 shadow-md'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>

        <Link to='/home' className='font-bold flex items-center gap-2 text-[22px] sm:text-[26px] ease-out duration-300 hover:text-[#5951e6]'>
          <i className="fa-solid fa-book-open"></i>
          BookStore
        </Link>

        <nav className='hidden sm:flex items-center gap-8 text-[17px]'>
          <Link to='/home' className='font-semibold hover:text-[#5951e6] transition-colors duration-200'>Home</Link>
          <Link to='/books' className='font-semibold hover:text-[#5951e6] transition-colors duration-200'>Books</Link>

          <div className="relative">
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-[12px] text-white font-bold bg-green-400 z-10">
                {totalItems}
              </span>
            )}
            <Link to="/cart">
              <button className="text-2xl hover:text-[#5951e6] transition-colors duration-200">
                <i className="fa-solid fa-cart-shopping"></i>
              </button>
            </Link>
          </div>

          <button
            onClick={handleUserClick}
            className='text-[22px] flex items-center hover:text-[#5951e6] transition-colors duration-200'
          >
            <i className="fa-regular fa-user"></i>
          </button>
        </nav>

        <div className='flex sm:hidden items-center gap-5'>
          <div className="relative">
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-[12px] text-white font-bold bg-green-400 z-10">
                {totalItems}
              </span>
            )}
            <Link to="/cart">
              <button className="text-2xl hover:text-[#5951e6]">
                <i className="fa-solid fa-cart-shopping"></i>
              </button>
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className='text-2xl hover:text-[#5951e6]'
          >
            <i className={menuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className='sm:hidden mt-3 pb-4 border-t border-gray-100 flex flex-col gap-4 pt-4 px-4 font-[Poppins]'>
          <Link
            to='/home'
            onClick={() => setMenuOpen(false)}
            className='font-semibold text-[16px] hover:text-[#5951e6]'
          >
            Home
          </Link>
          <Link
            to='/books'
            onClick={() => setMenuOpen(false)}
            className='font-semibold text-[16px] hover:text-[#5951e6]'
          >
            Books
          </Link>
          <button
            onClick={handleUserClick}
            className='font-semibold text-[16px] text-left flex items-center gap-2 hover:text-[#5951e6]'
          >
            <i className="fa-regular fa-user"></i>
            {admin ? 'Admin Dashboard' : user ? 'My Account' : 'Login'}
          </button>
        </div>
      )}
    </header>
  )
}

export default Header