import React from 'react'

const Header = () => {
  return (
    <>
    <header className='bg-[#1976d2] text-white px-5 py-4 font-sans sticky'>
        <div className='flex justify-between items-center ml-5'>
        <div className='flex items-center gap-2 text-2xl '>
            <i class="fa-solid fa-book-open"></i>
            <p className='font-bold'>BookStore</p>
        </div>
        <div className='flex items-center justify-center gap-6 text-[17px] mr-5'>
            <button className='border py-1 px-3 rounded-[5px] hover:bg-white hover:text-[#1976d2]'>BROWSE</button>
            <button className='flex gap-1 items-center'><i class="fa-solid fa-cart-arrow-down"></i>CART</button>
            <button className='flex gap-1 items-center'><i class="fa-solid fa-gear"></i>ADMIN</button>
        </div>
        </div>
    </header> 
    </>
  )
}

export default Header
