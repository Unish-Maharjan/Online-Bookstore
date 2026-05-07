import React from 'react'

const Footer = () => {
  return (
    <>
        <div className='flex flex-col items-center bg-[#1e2939] text-white p-8 gap-1'>
            <div className='flex items-center gap-2 text-xl '>
            <i class="fa-solid fa-book-open"></i>
            <p className='font-bold'>BookStore</p>
            </div>
            <span className='text-gray-400'>
                Your one-stop shop for amazing books
            </span>
            <span className='font-extralight text-gray-500'>
                2026 BookStore. All rights reserved
            </span>
        </div> 
    </>
  )
}

export default Footer
