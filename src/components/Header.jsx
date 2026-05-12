import React from 'react'
import { Link, useNavigate } from 'react-router'
import { useCart } from './CartContext' 

const Header = () => {

  const navigate = useNavigate();
  const {state} = useCart();

  const totalItems = state.cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
    <header className='sticky top-0 w-full bg-[#ffffff]/90 text-black px-5 py-4 font-[Poppins] backdrop-blur-lg z-50 shadow-md'>
     <div className='container'>
        <div className='flex justify-between items-center ml-5'>
        <div className='flex items-center gap-2 text-[26px] '>
          <Link to='/home' className='font-bold flex items-center gap-1 ease-out duration-400 hover:cursor-pointer hover:text-[#5951e6]'>
            <i class="fa-solid fa-book-open"></i>
            BookStore
          </Link>
        </div>
        <div className='flex items-center justify-center gap-10 text-[18px] mr-8'>
            <Link to='/home' className='font-semibold hover:cursor-pointer hover:text-[#5951e6]'>Home</Link>
            <Link to='/books' className='font-semibold hover:cursor-pointer hover:text-[#5951e6]'>Books</Link>
            <div className="relative">
  
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-[12px] text-white font-bold bg-green-400">
                  {totalItems}
                </span>
              )}

              <Link to="/cart">
                <button className="text-2xl hover:text-[#5951e6]">
                  <i className="fa-solid fa-cart-shopping"></i>
                </button>
              </Link>

            </div>
            
            <button className='flex text-[22px] items-center hover:cursor-pointer hover:text-[#5951e6]'>
              <i class="fa-regular fa-user"></i>
              </button>
        </div>
        </div>
      </div>
    </header> 
    </>
  )
}

export default Header
