import React from 'react'
import { Link } from 'react-router'

const Header = () => {
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
            <Link to='/cart'><button className='flex text-xl items-center hover:cursor-pointer hover:text-[#5951e6]'><i class="fa-solid fa-cart-arrow-down"></i></button></Link>
            <button className='flex text-xl items-center hover:cursor-pointer hover:text-[#5951e6]'><i class="fa-regular fa-user"></i></button>
        </div>
        </div>
      </div>
    </header> 
    </>
  )
}

export default Header
